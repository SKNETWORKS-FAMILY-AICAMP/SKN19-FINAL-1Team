"""
Faster Whisper STT 엔진 모듈
실시간 오디오 스트림을 텍스트로 변환
"""
import numpy as np
from typing import Iterator, Optional, Tuple
from faster_whisper import WhisperModel
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)


class STTEngine:
    """Faster Whisper 기반 STT 엔진"""
    
    def __init__(self):
        self.model = None
        self._initialize_model()
    
    def _initialize_model(self):
        try:
            logger.info(f"Faster Whisper 모델 로딩 중: {settings.WHISPER_MODEL_SIZE}")
            self.model = WhisperModel(
                model_size_or_path=settings.WHISPER_MODEL_SIZE,
                device=settings.WHISPER_DEVICE,
                compute_type=settings.WHISPER_COMPUTE_TYPE,
            )
            logger.info("Faster Whisper 모델 로딩 완료")
        except Exception as e:
            logger.error(f"Faster Whisper 모델 로딩 실패: {e}")
            raise
    
    def transcribe_stream(
        self, 
        audio_array: np.ndarray,
        sample_rate: int = None
    ) -> Iterator[Tuple[str, bool]]:
        """
        오디오 스트림을 실시간으로 텍스트로 변환
        
        Args:
            audio_array: numpy 배열 형태의 오디오 데이터
            sample_rate: 오디오 샘플레이트 (기본값: 설정값 사용)
        
        Yields:
            (transcript, is_final) 튜플
            - transcript: 변환된 텍스트
            - is_final: 최종 결과 여부 (True: final, False: partial)
        """
        if self.model is None:
            raise RuntimeError("STT 모델이 초기화되지 않았습니다.")
        
        if sample_rate is None:
            sample_rate = settings.AUDIO_SAMPLE_RATE
        
        try:
            # faster-whisper는 스트리밍을 직접 지원하지 않으므로
            # 청크 단위로 처리하거나 VAD와 함께 사용
            segments, info = self.model.transcribe(
                audio_array,
                language=settings.WHISPER_LANGUAGE,
                beam_size=settings.WHISPER_BEAM_SIZE,
                temperature=settings.WHISPER_TEMPERATURE,
                vad_filter=True,  # VAD 필터 활성화
            )
            
            # 첫 번째 세그먼트를 partial로 반환
            first_segment = next(segments, None)
            if first_segment:
                # partial transcript (중간 결과)
                yield first_segment.text, False
                
                # 나머지 세그먼트 처리
                for segment in segments:
                    yield segment.text, True  # final utterance
            
        except Exception as e:
            logger.error(f"STT 변환 중 오류 발생: {e}")
            raise
    
    def transcribe_chunk(
        self,
        audio_array: np.ndarray,
        sample_rate: int = None
    ) -> Tuple[Optional[str], bool]:
        """
        오디오 청크를 텍스트로 변환 (non-streaming)
        
        Args:
            audio_array: numpy 배열 형태의 오디오 데이터
            sample_rate: 오디오 샘플레이트 (기본값: 설정값 사용)
        
        Returns:
            (transcript, is_final) 튜플
            - transcript: 변환된 텍스트 (None일 수 있음)
            - is_final: 최종 결과 여부
        """
        if self.model is None:
            raise RuntimeError("STT 모델이 초기화되지 않았습니다.")
        
        if sample_rate is None:
            sample_rate = settings.AUDIO_SAMPLE_RATE
        
        try:
            # 작은 청크의 경우 빈 결과가 나올 수 있음
            if len(audio_array) < sample_rate * 0.1:  # 0.1초 미만이면 건너뛰기
                return None, False
            
            segments, info = self.model.transcribe(
                audio_array,
                language=settings.WHISPER_LANGUAGE,
                beam_size=settings.WHISPER_BEAM_SIZE,
                temperature=settings.WHISPER_TEMPERATURE,
                vad_filter=False,  # 작은 청크는 VAD 필터 비활성화
            )
            
            # 첫 번째 세그먼트만 사용 (작은 청크이므로)
            segment = next(segments, None)
            if segment and segment.text.strip():
                return segment.text.strip(), False  # partial
            
            return None, False
            
        except Exception as e:
            logger.error(f"STT 청크 변환 중 오류 발생: {e}")
            return None, False
    
    def transcribe_final(
        self,
        audio_array: np.ndarray,
        sample_rate: int = None
    ) -> Optional[str]:
        """
        최종 오디오 버퍼를 텍스트로 변환 (VAD 종료 시 호출)
        
        Args:
            audio_array: numpy 배열 형태의 오디오 데이터 (완전한 발화)
            sample_rate: 오디오 샘플레이트 (기본값: 설정값 사용)
        
        Returns:
            변환된 텍스트 (None일 수 있음)
        """
        if self.model is None:
            raise RuntimeError("STT 모델이 초기화되지 않았습니다.")
        
        if sample_rate is None:
            sample_rate = settings.AUDIO_SAMPLE_RATE
        
        try:
            if len(audio_array) < sample_rate * 0.5:  # 0.5초 미만이면 건너뛰기
                return None
            
            segments, info = self.model.transcribe(
                audio_array,
                language=settings.WHISPER_LANGUAGE,
                beam_size=settings.WHISPER_BEAM_SIZE,
                temperature=settings.WHISPER_TEMPERATURE,
                vad_filter=True,  # 최종 변환 시 VAD 필터 활성화
            )
            
            # 모든 세그먼트를 합쳐서 반환
            texts = []
            for segment in segments:
                if segment.text.strip():
                    texts.append(segment.text.strip())
            
            if texts:
                return " ".join(texts)
            
            return None
            
        except Exception as e:
            logger.error(f"STT 최종 변환 중 오류 발생: {e}")
            return None


# 전역 STT 엔진 인스턴스 (싱글톤 패턴)
_stt_engine: Optional[STTEngine] = None


def get_stt_engine() -> STTEngine:
    global _stt_engine
    if _stt_engine is None:
        _stt_engine = STTEngine()
    return _stt_engine
