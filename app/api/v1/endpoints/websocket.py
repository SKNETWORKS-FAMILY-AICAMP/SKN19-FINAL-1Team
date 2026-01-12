<<<<<<< HEAD
=======
from app.audio.processor import process_audio_stream
from app.api.v1.endpoints.stt_handler import handle_stt_websocket_tasks
>>>>>>> f83d105012044fbb6c36b74e619b9fe5777b98d3
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
import asyncio
import uuid
from app.audio.whisper import WhisperService 
from app.rag.pipeline import RAGConfig, run_rag

router = APIRouter()

@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    session_id = str(uuid.uuid4())[:8]
    print(f"[{session_id}] 웹소켓 연결 완료")

<<<<<<< HEAD
    whisper_service = WhisperService()

    # 결과 처리 콜백
    async def on_transcription_result(text: str):
        print(f"[{session_id}] STT 결과 : {text}")
        await websocket.send_json(text)

        try:
            result = await run_rag(text, config=RAGConfig(top_k=4, normalize_keywords=True))
            
            if result:
                print(f"[{session_id}] RAG 검색 결과 : {result}")
                # await websocket.send_json(result)  RAG 검색 결과 프론트로 전송

                
        except Exception as e:
            print(f"[{session_id}] RAG 처리 중 에러 : {e}")

    # 서비스 시작
    loop = asyncio.get_running_loop()
    whisper_service.start(callback=on_transcription_result, loop=loop)

    try:
        while True:
            data = await websocket.receive_bytes()
            whisper_service.add_audio(data)
            
=======
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
    
>>>>>>> f83d105012044fbb6c36b74e619b9fe5777b98d3
    except WebSocketDisconnect:
        print(f"[{session_id}] 연결 종료")

    except Exception as e:
        print(f"[{session_id}] 오류 발생: {e}")

    finally:
<<<<<<< HEAD
        whisper_service.stop()
        print(f"[{session_id}] 연결 종료")
=======
        disconnected_flag["disconnected"] = True
        audio_queue.put(None)
        result_queue.put(None)
        worker_thread.join()
        print(f"{session_id} 리소스 정리 완료")
>>>>>>> f83d105012044fbb6c36b74e619b9fe5777b98d3
