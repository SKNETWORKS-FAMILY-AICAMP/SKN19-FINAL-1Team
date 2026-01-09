from audio.processor import process_audio_stream
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

    # 해당 연결을 위한 작업 스레드 생성 및 시작
    worker_thread = threading.Thread(
        target=process_audio_stream,
        args=(audio_queue, session_id),
        daemon=True
    )

    worker_thread.start()

    try:
        while True:
            # 데이터 수신
            data = await websocket.receive_bytes()
            audio_queue.put(data)
            
            # 데이터 발송
            await websocket.send_text("ACK")
    
    except WebSocketDisconnect:
        print(f"{session_id} 연결 중단")
    except Exception as e:
        print(f"{session_id} 연결 실패 : {e}")
    
    finally:
        audio_queue.put(None)
        worker_thread.join()
        print(f"{session_id} 리소스 정리 완료")