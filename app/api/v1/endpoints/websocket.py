from app.audio.processor import process_audio_stream
from app.api.v1.endpoints.stt_handler import handle_stt_websocket_tasks
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
import threading
import queue
import uuid

router = APIRouter()

@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    print('Websocket 연결 성공')

    # 독립적인 session_id, 큐 생성
    session_id = str(uuid.uuid4())[:8]
    print(f"{session_id} 연결 성공")

    audio_queue = queue.Queue()
    result_queue = queue.Queue()  # STT 결과를 전달하는 큐

    # 해당 연결을 위한 작업 스레드 생성 및 시작
    worker_thread = threading.Thread(
        target=process_audio_stream,
        args=(audio_queue, session_id, result_queue),
        daemon=True
    )

    print(f"{session_id} 스레드 시작 시도")
    worker_thread.start()
    print(f"{session_id} 스레드 시작 완료")

    # 연결 종료 플래그 (dict로 전달하여 참조 공유)
    disconnected_flag = {"disconnected": False}

    try:
        # STT 웹소켓 태스크들을 병렬로 실행
        await handle_stt_websocket_tasks(
            websocket,
            audio_queue,
            result_queue,
            session_id,
            disconnected_flag
        )
    
    except WebSocketDisconnect:
        print(f"{session_id} 연결 중단")
    except Exception as e:
        print(f"{session_id} 연결 실패 : {e}")
    
    finally:
        disconnected_flag["disconnected"] = True
        audio_queue.put(None)
        result_queue.put(None)
        worker_thread.join()
        print(f"{session_id} 리소스 정리 완료")