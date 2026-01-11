"""
오디오 스트림 처리 모듈
웹소켓으로 받은 오디오 바이트를 처리하고 STT 수행
"""
import queue
import numpy as np
import logging
from typing import Optional, Deque
from collections import deque
from app.audio.stt import get_stt_engine
from app.core.config import settings

logger = logging.getLogger(__name__)


class AudioBuffer:
    """오디오 버퍼 관리 클래스"""
    
    def __init__(self, max_duration_sec: float = None):
        """
        Args:
            max_duration_sec: 최대 버퍼 크기 (초)
        """
        self.max_duration_sec = max_duration_sec or settings.AUDIO_BUFFER_DURATION_SEC
        self.sample_rate = settings.AUDIO_SAMPLE_RATE
        self.max_samples = int(self.max_duration_sec * self.sample_rate)
        
        # 오디오 샘플 저장 (numpy 배열)
        self.buffer: Deque[float] = deque(maxlen=self.max_samples)
        
        # 텍스트 버퍼 (partial transcript 저장)
        self.text_buffer: str = ""
    
    def append(self, audio_samples: np.ndarray):
        """오디오 샘플 추가"""
        # numpy 배열을 리스트로 변환하여 추가
        self.buffer.extend(audio_samples.tolist())
    
    def get_array(self) -> np.ndarray:
        """현재 버퍼를 numpy 배열로 반환"""
        if len(self.buffer) == 0:
            return np.array([], dtype=np.float32)
        return np.array(list(self.buffer), dtype=np.float32)
    
    def clear(self):
        """버퍼 클리어"""
        self.buffer.clear()
        self.text_buffer = ""
    
    def get_duration_sec(self) -> float:
        """현재 버퍼 길이 (초)"""
        return len(self.buffer) / self.sample_rate
    
    def is_full(self) -> bool:
        """버퍼가 가득 찼는지 확인"""
        return len(self.buffer) >= self.max_samples


def bytes_to_audio_array(audio_bytes: bytes, sample_rate: int = None) -> Optional[np.ndarray]:
    """
    오디오 바이트를 numpy 배열로 변환
    
    Args:
        audio_bytes: 오디오 바이트 데이터 (PCM 형식 가정)
        sample_rate: 샘플레이트 (기본값: 설정값 사용)
    
    Returns:
        numpy 배열 (float32, -1.0 ~ 1.0 범위)
    """
    if sample_rate is None:
        sample_rate = settings.AUDIO_SAMPLE_RATE
    
    try:
        # PCM 16-bit 리틀 엔디안으로 가정
        # 웹 브라우저에서 오는 오디오는 보통 Int16Array를 base64 인코딩하거나
        # raw PCM 바이트로 전송됨
        audio_int16 = np.frombuffer(audio_bytes, dtype=np.int16)
        
        # Int16을 Float32로 변환 (-1.0 ~ 1.0 범위)
        audio_float32 = audio_int16.astype(np.float32) / 32768.0
        
        # 모노로 변환 (필요한 경우)
        if len(audio_float32.shape) > 1:
            audio_float32 = np.mean(audio_float32, axis=1)
        
        return audio_float32
        
    except Exception as e:
        logger.error(f"오디오 바이트 변환 실패: {e}")
        return None


def process_audio_stream(
    user_queue: queue.Queue, 
    session_id: str,
    result_queue: queue.Queue = None
):
    """
    오디오 스트림 처리 메인 함수
    
    Args:
        user_queue: 오디오 청크를 받는 큐
        session_id: 세션 ID
        result_queue: STT 결과를 전달할 큐 (None일 경우 로깅만 수행)
    """
    print(f"{session_id} : process_audio_stream 진입")
    logger.info(f"{session_id} : 오디오 스트림 처리 스레드 시작")
    
    try:
        # 엔진 초기화
        stt_engine = get_stt_engine()
        
        # VAD 핸들러 동적 임포트 (순환 참조 방지 등)
        from app.audio.vad import VADHandler
        vad_handler = VADHandler()
        
        logger.info(f"{session_id} : STT Thread Config - MaxContinuous={settings.VAD_MAX_UTTERANCE_SEC}s, Silence={settings.VAD_SILENCE_THRESHOLD_SEC}s")

        # 상태 변수 초기화
        audio_buffer = AudioBuffer()
        chunk_counter = 0
        process_chunk_interval = 5  # 5개 청크(0.5초)마다 partial 결과 전송

        # 헬퍼 함수: 버퍼 처리 및 초기화
        def finalize_buffer(reason: str, send_result: bool = True):
            """
            현재 버퍼의 내용을 Final Transcribe 하고 초기화
            """
            nonlocal chunk_counter
            
            try:
                audio_array = audio_buffer.get_array()
                final_transcript = stt_engine.transcribe_final(
                    audio_array,
                    sample_rate=settings.AUDIO_SAMPLE_RATE
                )
                
                # 결과 전송 (send_result가 True이고 결과가 있을 때)
                if send_result and final_transcript and final_transcript.strip():
                    cleaned_transcript = final_transcript.strip()
                    logger.info(f"{session_id} : Final transcript ({reason}): {cleaned_transcript}")
                    
                    # 키워드 검출
                    detected_keywords = [
                        k for k in settings.KEYWORDS 
                        if k in cleaned_transcript.replace(" ", "")
                    ]
                    
                    if result_queue is not None:
                        result_queue.put({
                            "type": "final",
                            "transcript": cleaned_transcript,
                            "keywords": detected_keywords if detected_keywords else None
                        }, timeout=0.1)
                elif not send_result:
                     logger.warning(f"{session_id} : {reason} -> 결과 전송 건너뜀")

            except Exception as e:
                logger.error(f"{session_id} : {reason} 처리 중 오류: {e}")
            finally:
                # 상태 초기화 (항상 수행)
                audio_buffer.clear()
                vad_handler.reset()
                chunk_counter = 0

        # 메인 루프
        while True:
            try:
                # 1.0초 타임아웃으로 큐에서 가져오기 (종료 신호 확인용)
                audio_chunk = user_queue.get(timeout=1.0)
                
                if audio_chunk is None:
                    logger.info(f"{session_id} : 스레드 종료 신호 수신")
                    break
                
                # 바이트 -> Numpy 변환
                audio_samples = bytes_to_audio_array(audio_chunk)
                if audio_samples is None or len(audio_samples) == 0:
                    user_queue.task_done()
                    continue
                
                # 버퍼 추가
                audio_buffer.append(audio_samples)
                chunk_counter += 1
                
                # VAD 상태 업데이트
                is_speech = vad_handler.is_speech(audio_samples, settings.AUDIO_SAMPLE_RATE)
                if is_speech:
                    vad_handler.silence_counter = 0.0
                    vad_handler.is_speech_active = True
                else:
                    vad_handler.silence_counter += settings.AUDIO_CHUNK_SIZE_MS / 1000.0
                
                # --- 조건별 처리 로직 ---
                
                # Case A: 침묵 감지 (VAD 종료)
                if vad_handler.is_speech_active and vad_handler.silence_counter >= settings.VAD_SILENCE_THRESHOLD_SEC:
                    print(f"{session_id} : [VAD] 침묵 감지 ({vad_handler.silence_counter:.1f}초) -> 문장 종료")
                    finalize_buffer(reason="VAD")
                
                # Case B: 최대 발화 길이 초과 (강제 처리)
                elif audio_buffer.get_duration_sec() >= settings.VAD_MAX_UTTERANCE_SEC:
                    logger.info(f"{session_id} : 연속 발화 제한 초과 -> 강제 처리")
                    finalize_buffer(reason="Periodic")
                
                # Case C: 버퍼 오버플로우 (비우기)
                elif audio_buffer.is_full():
                    logger.warning(f"{session_id} : 버퍼 가득 참 -> 비우기")
                    finalize_buffer(reason="BufferOverflow", send_result=False)

                # Case D: Partial STT (말하는 중일 때 주기적 업데이트)
                elif vad_handler.is_speech_active and chunk_counter % process_chunk_interval == 0:
                    audio_array = audio_buffer.get_array()
                    if len(audio_array) > 0:
                        try:
                            transcript, _ = stt_engine.transcribe_chunk(
                                audio_array, 
                                sample_rate=settings.AUDIO_SAMPLE_RATE
                            )
                            if transcript and transcript.strip():
                                current_text = transcript.strip()
                                # 이전과 다를 때만 전송
                                if current_text != audio_buffer.text_buffer.strip():
                                    audio_buffer.text_buffer = current_text
                                    logger.debug(f"{session_id} : Partial: {current_text}")
                                    
                                    if result_queue is not None:
                                        result_queue.put({
                                            "type": "partial",
                                            "transcript": current_text
                                        }, timeout=0.1)
                        except Exception:
                            pass # Partial 에러는 무시

                user_queue.task_done()

            except queue.Empty:
                continue
            except Exception as e:
                logger.error(f"{session_id} : 오디오 처리 루프 중 오류: {e}")
                break

    except Exception as e:
        logger.error(f"{session_id} : STT 엔진/VAD 초기화 또는 치명적 오류: {e}")
    finally:
        logger.info(f"{session_id} : 오디오 스트림 처리 스레드 로직 종료")
