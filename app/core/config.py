<<<<<<< HEAD
# Postgre DB 정보
DB_HOST = "100.80.74.83"
DB_PORT = 5432
DB_USER = "postgres"
DB_PASSWORD = "0912"
DB_NAME = "callact"
=======
from pydantic_settings import BaseSettings
from typing import Literal


class Settings(BaseSettings):
    """애플리케이션 설정"""
    
    # Faster Whisper 설정
    WHISPER_MODEL_SIZE: str = "medium"  # tiny, base, small, medium, large 중 선택 (medium: 한국어 인식률 높음)
    WHISPER_DEVICE: Literal["cpu", "cuda"] = "cuda"  # GPU 사용 시 "cuda"
    WHISPER_COMPUTE_TYPE: Literal["int8", "int8_float16", "int16", "float16", "float32"] = "float16"  # int8 → float16 (정확도 향상)
    WHISPER_LANGUAGE: str = "ko"  # 한국어
    WHISPER_BEAM_SIZE: int = 5  # beam size 증가 시 정확도 향상 (속도 저하)
    WHISPER_TEMPERATURE: float = 0.0  # 0.0이 가장 정확
    
    # 오디오 처리 설정
    AUDIO_SAMPLE_RATE: int = 16000  # Whisper는 16kHz 권장
    AUDIO_CHANNELS: int = 1  # 모노
    AUDIO_CHUNK_SIZE_MS: float = 100.0  # 0.1초 단위
    AUDIO_BUFFER_DURATION_SEC: float = 30.0  # 최대 버퍼 크기 (초)
    
    # VAD 설정 (Phase 2에서 사용 예정)
    VAD_TYPE: Literal["energy", "webrtc", "silero"] = "webrtc"  # 사용할 VAD 종류
    VAD_SILENCE_THRESHOLD_SEC: float = 0.5  # 조용한 시간 (초)
    VAD_MAX_UTTERANCE_SEC: float = 2.0  # 연속 발화 시 강제 처리 주기 (초)
    
    # 키워드 감지 설정
    KEYWORDS: list[str] = ["카드발급", "이자율", "연회비", "나라사랑", "카드"]
    
    # 애플리케이션 설정
    PROJECT_NAME: str = "CALL:ACT"
    API_VERSION: str = "v1"
    
    class Config:
        env_file = ".env"
        case_sensitive = False
        extra = "ignore"  # .env 파일의 추가 필드는 무시


settings = Settings()
>>>>>>> f83d105012044fbb6c36b74e619b9fe5777b98d3
