
import numpy as np
import logging
import torch
from typing import Literal, Optional
from app.core.config import settings

logger = logging.getLogger(__name__)

class VADHandler:
    """
    모듈식 VAD 핸들러
    비교 테스트를 위해 3가지 방식을 스위칭 형식으로 구현 'energy', 'webrtc', 'silero'
    """
    
    def __init__(self, mode: Literal["energy", "webrtc", "silero"] = None):
        self.mode = mode or settings.VAD_TYPE
        self.sample_rate = settings.AUDIO_SAMPLE_RATE
        self.silence_threshold = settings.VAD_SILENCE_THRESHOLD_SEC
        
        # 상태 변수
        self.silence_counter = 0.0
        self.is_speech_active = False
        
        # 모델 캐싱
        self.webrtc_vad = None
        self.silero_model = None
        
        self._initialize_vad()
        
    def _initialize_vad(self):
        """VAD 모듈 초기화"""
        logger.info(f"VAD 모드 초기화: {self.mode}")
        
        if self.mode == "webrtc":
            try:
                import webrtcvad
                # 0: 민감함(가장 많이 잡음), 3: 둔감함(확실한 것만 잡음)
                self.webrtc_vad = webrtcvad.Vad(0)  # 2 -> 0으로 변경 (더 잘 잡히게)
            except ImportError:
                logger.error("webrtcvad 모듈을 찾을 수 없습니다. 'energy' 모드로 전환합니다.")
                self.mode = "energy"
                
        elif self.mode == "silero":
            try:
                self.silero_model, utils = torch.hub.load(
                    repo_or_dir='snakers4/silero-vad',
                    model='silero_vad',
                    force_reload=False,
                    onnx=False
                )
                (self.get_speech_timestamps, _, self.read_audio, _, _) = utils
            except Exception as e:
                logger.error(f"Silero VAD 로딩 실패: {e}. 'energy' 모드로 전환합니다.")
                self.mode = "energy"
    
    def is_speech(self, audio_chunk: np.ndarray, sample_rate: int = 16000) -> bool:
        """
        음성 구간인지 판별
        
        Args:
            audio_chunk: float32 numpy array (-1.0 ~ 1.0)
            sample_rate: 샘플링 레이트
        
        Returns:
            bool: 음성이면 True, 침묵이면 False
        """
        if self.mode == "energy":
            return self._is_speech_energy(audio_chunk)
        elif self.mode == "webrtc":
            return self._is_speech_webrtc(audio_chunk, sample_rate)
        elif self.mode == "silero":
            return self._is_speech_silero(audio_chunk, sample_rate)
        else:
            # 기본값 (fallback)
            return self._is_speech_energy(audio_chunk)

    def _is_speech_energy(self, audio_chunk: np.ndarray, threshold: float = 0.001) -> bool:
        """에너지 기반 판별 (RMS)"""
        if len(audio_chunk) == 0:
            return False
        rms = np.sqrt(np.mean(audio_chunk**2))
        return rms > threshold

    def _is_speech_webrtc(self, audio_chunk: np.ndarray, sample_rate: int) -> bool:
        """WebRTC VAD 판별"""
        if self.webrtc_vad is None:
            return self._is_speech_energy(audio_chunk)
            
        # WebRTC는 Int16 필요
        audio_int16 = (audio_chunk * 32767).astype(np.int16).tobytes()
        
        # WebRTC는 10, 20, 30ms 프레임만 지원
        # 현재 청크가 100ms라면 쪼개서 확인
        frame_duration_ms = 30
        n_bytes = int(sample_rate * frame_duration_ms / 1000) * 2  # 2 bytes per sample
        
        # 청크가 너무 작으면 패스
        if len(audio_int16) < n_bytes:
            return False
            
        # 여러 프레임 중 하나라도 음성이면 음성으로 간주
        has_speech = False
        offset = 0
        while offset + n_bytes <= len(audio_int16):
            frame = audio_int16[offset:offset + n_bytes]
            if self.webrtc_vad.is_speech(frame, sample_rate):
                has_speech = True
                break
            offset += n_bytes
            
        return has_speech

    def _is_speech_silero(self, audio_chunk: np.ndarray, sample_rate: int) -> bool:
        """Silero VAD 판별"""
        if self.silero_model is None:
            return self._is_speech_energy(audio_chunk)
            
        # Tensor 변환
        tensor = torch.from_numpy(audio_chunk)
        if len(tensor.shape) == 1:
            tensor = tensor.unsqueeze(0)
            
        speech_prob = self.silero_model(tensor, sample_rate).item()
        return speech_prob > 0.5

    def reset(self):
        """상태 초기화"""
        self.silence_counter = 0.0
        self.is_speech_active = False
        if self.mode == "silero" and self.silero_model:
            self.silero_model.reset_states()
        # WebRTC VAD 상태 초기화 (잡음 적응 모델 리셋)
        if self.mode == "webrtc":
            try:
                import webrtcvad
                self.webrtc_vad = webrtcvad.Vad(0)
            except:
                pass
