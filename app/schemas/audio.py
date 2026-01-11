from pydantic import BaseModel
from typing import Optional, Literal
from datetime import datetime


class STTRequest(BaseModel):
    """오디오 요청 메타데이터 (선택적)"""
    sample_rate: Optional[int] = 16000
    channels: Optional[int] = 1
    format: Optional[str] = "pcm"


class STTPartialResponse(BaseModel):
    """Partial transcript 응답 (중간 결과)"""
    type: Literal["partial"] = "partial"
    transcript: str
    session_id: str
    timestamp: datetime


class STTFinalResponse(BaseModel):
    """Final utterance 응답 (완료된 문장)"""
    type: Literal["final"] = "final"
    transcript: str
    session_id: str
    timestamp: datetime
    keywords: Optional[list[str]] = None  # 감지된 키워드 리스트


class STTErrorResponse(BaseModel):
    """STT 에러 응답"""
    type: Literal["error"] = "error"
    message: str
    session_id: str
    timestamp: datetime
