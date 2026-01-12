"""
STT 웹소켓 핸들러 모듈
오디오 수신 및 STT 결과 전송 로직을 처리
"""
import queue
import asyncio
import logging
from typing import Optional
from datetime import datetime
from fastapi import WebSocket, WebSocketDisconnect
from app.schemas.audio import STTPartialResponse, STTFinalResponse, STTErrorResponse

logger = logging.getLogger(__name__)


async def receive_audio_task(
    websocket: WebSocket,
    audio_queue: queue.Queue,
    session_id: str,
    disconnected_flag: dict
):
    """
    오디오 데이터 수신 태스크
    
    Args:
        websocket: 웹소켓 연결 객체
        audio_queue: 오디오 데이터를 넣을 큐
        session_id: 세션 ID
        disconnected_flag: 연결 종료 플래그 (딕셔너리)
    """
    try:
        while not disconnected_flag.get("disconnected", False):
            try:
                # 데이터 수신 (타임아웃 없이 대기)
                data = await websocket.receive_bytes()
                audio_queue.put(data)
                logger.debug(f"{session_id} : 오디오 청크 수신 ({len(data)} bytes)")
            except WebSocketDisconnect:
                logger.info(f"{session_id} : 웹소켓 연결 끊김 (수신)")
                disconnected_flag["disconnected"] = True
                break
            except Exception as e:
                logger.error(f"{session_id} : 오디오 수신 중 오류: {e}")
                disconnected_flag["disconnected"] = True
                break
    except Exception as e:
        logger.error(f"{session_id} : 오디오 수신 태스크 오류: {e}")
        disconnected_flag["disconnected"] = True
    finally:
        # 종료 신호 전송
        audio_queue.put(None)


async def send_stt_results_task(
    websocket: WebSocket,
    result_queue: queue.Queue,
    session_id: str,
    disconnected_flag: dict
):
    """
    STT 결과 전송 태스크
    
    Args:
        websocket: 웹소켓 연결 객체
        result_queue: STT 결과를 받을 큐
        session_id: 세션 ID
        disconnected_flag: 연결 종료 플래그 (딕셔너리)
    """
    try:
        while not disconnected_flag.get("disconnected", False):
            try:
                # 결과 큐에서 데이터 가져오기 (비동기적으로 대기)
                result = result_queue.get(timeout=0.1)
                
                if result is None:  # 종료 신호
                    break
                
                # 결과 타입에 따라 적절한 응답 생성
                response = create_stt_response(result, session_id)
                if response is None:
                    continue
                
                # JSON으로 변환하여 전송
                await websocket.send_text(response.model_dump_json())
                logger.debug(f"{session_id} : STT 결과 전송 ({result['type']})")
                
            except queue.Empty:
                # 큐가 비어있으면 계속 대기
                await asyncio.sleep(0.01)
                continue
            except WebSocketDisconnect:
                logger.info(f"{session_id} : 웹소켓 연결 끊김 (전송)")
                disconnected_flag["disconnected"] = True
                break
            except Exception as e:
                logger.error(f"{session_id} : 결과 전송 중 오류: {e}")
                # 에러 응답 전송 시도
                try:
                    error_response = STTErrorResponse(
                        message=str(e),
                        session_id=session_id,
                        timestamp=datetime.now()
                    )
                    await websocket.send_text(error_response.model_dump_json())
                except:
                    pass
                disconnected_flag["disconnected"] = True
                break
    except Exception as e:
        logger.error(f"{session_id} : 결과 전송 태스크 오류: {e}")
        disconnected_flag["disconnected"] = True


def create_stt_response(result: dict, session_id: str):
    """
    STT 결과 딕셔너리를 스키마 객체로 변환
    
    Args:
        result: STT 결과 딕셔너리
        session_id: 세션 ID
    
    Returns:
        STT 응답 스키마 객체
        또는 None (알 수 없는 타입)
    """
    result_type = result.get("type")
    
    if result_type == "partial":
        return STTPartialResponse(
            transcript=result["transcript"],
            session_id=session_id,
            timestamp=datetime.now()
        )
    elif result_type == "final":
        return STTFinalResponse(
            transcript=result["transcript"],
            session_id=session_id,
            timestamp=datetime.now(),
            keywords=result.get("keywords")
        )
    elif result_type == "error":
        return STTErrorResponse(
            message=result["message"],
            session_id=session_id,
            timestamp=datetime.now()
        )
    else:
        logger.warning(f"{session_id} : 알 수 없는 결과 타입: {result_type}")
        return None


async def handle_stt_websocket_tasks(
    websocket: WebSocket,
    audio_queue: queue.Queue,
    result_queue: queue.Queue,
    session_id: str,
    disconnected_flag: dict
):
    """
    STT 웹소켓 태스크들을 병렬로 실행
    
    Args:
        websocket: 웹소켓 연결 객체
        audio_queue: 오디오 데이터를 넣을 큐
        result_queue: STT 결과를 받을 큐
        session_id: 세션 ID
        disconnected_flag: 연결 종료 플래그 (dict with 'disconnected' key)
    """
    try:
        # 두 태스크를 동시에 실행
        await asyncio.gather(
            receive_audio_task(websocket, audio_queue, session_id, disconnected_flag),
            send_stt_results_task(websocket, result_queue, session_id, disconnected_flag),
            return_exceptions=True
        )
    except Exception as e:
        logger.error(f"{session_id} : 웹소켓 태스크 처리 중 오류: {e}")
