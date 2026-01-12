import sys
import os
from pathlib import Path

# 프로젝트 루트를 Python 경로에 추가
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

import asyncio
import websockets
import sounddevice as sd
import io
import wave
import webrtcvad
import time
import collections
import queue
import threading

from app.rag.router import route_query
from app.rag.pipeline import run_rag, RAGConfig

# 설정
SAMPLE_RATE = 16000
CHANNELS = 1
FRAME_DURATION_MS = 30
VAD_MODE = 3                  # 0~3 범위, 3이 가장 민감
PADDING_DURATION_MS = 300     # 음성 전후에 추가할 패딩(침묵) 시간
SILENT_CHUNKS_THRESHOLD = 20  # 이 개수의 연속된 침묵 프레임이 감지되면 종료


class Audio(object):
    """오디오 스트림을 처리하는 클래스"""
    def __init__(self, loop, async_queue):
        self.buffer_queue = queue.Queue()
        self.recording = True
        self.vad = webrtcvad.Vad(VAD_MODE)
        self.num_voiced_frames = 0
        self.num_silent_frames = 0
        self.frames = []
        self.loop = loop
        self.async_queue = async_queue

    def frame_generator(self):
        """오디오 프레임 생성기"""
        while self.recording:
            try:
                data = self.buffer_queue.get(block=True, timeout=1)
                yield data
            except queue.Empty:
                break

    def callback_audio(self, indata, frames, time, status):
        """오디오 콜백 함수"""
        if status:
            print(f"오디오 상태: {status}")
        self.buffer_queue.put(bytes(indata))

    def vad_collector(self, threshold=SILENT_CHUNKS_THRESHOLD):
        """VAD를 통해 음성 구간 검출"""
        frame_duration_ms = FRAME_DURATION_MS
        frame_size = int(SAMPLE_RATE * frame_duration_ms / 1000)
        ring_buffer = collections.deque(maxlen=threshold)
        
        triggered = False
        for frame in self.frame_generator():
            is_speech = self.vad.is_speech(frame, SAMPLE_RATE)
            
            if not triggered:
                if is_speech:
                    triggered = True
                    print("음성 감지됨 - 녹음 시작")
                    for f in ring_buffer:
                        self.frames.append(f)
                    self.frames.append(frame)
                    self.num_voiced_frames += 1
                    ring_buffer.clear()
                else:
                    ring_buffer.append(frame)
            else:
                if is_speech:
                    self.frames.append(frame)
                    self.num_voiced_frames += 1
                    self.num_silent_frames = 0
                else:
                    self.frames.append(frame)
                    self.num_silent_frames += 1
                    
                    # 침묵이 일정 기간 계속되면 음성 세그먼트 종료
                    if self.num_silent_frames > threshold:
                        triggered = False
                        print(f"음성 세그먼트 종료")
                        
                        if self.num_voiced_frames > 0:
                            # 오디오 데이터를 메인 스레드로 안전하게 전달
                            audio_data = b''.join(self.frames)
                            if len(audio_data) > 1000:  # 너무 짧은 오디오는 무시
                                audio_buffer = io.BytesIO()
                                with wave.open(audio_buffer, 'wb') as wav_file:
                                    wav_file.setnchannels(CHANNELS)
                                    wav_file.setsampwidth(2)
                                    wav_file.setframerate(SAMPLE_RATE)
                                    wav_file.writeframes(audio_data)
                                
                                # 메인 이벤트 루프의 큐에 안전하게 데이터 추가
                                self.loop.call_soon_threadsafe(
                                    self.async_queue.put_nowait, 
                                    audio_buffer.getvalue()
                                )
                        
                        self.frames = []
                        self.num_voiced_frames = 0
                        self.num_silent_frames = 0
                        ring_buffer.clear()


async def process_rag_query(text: str):
    """STT 결과를 받아 키워드 추출 및 RAG 검색 수행"""
    print(f"\n{'='*60}")
    print(f"[STT 결과] {text}")
    print(f"{'='*60}")
    
    # 1. 키워드 추출 (라우터 사용)
    routing = route_query(text)
    print(f"\n[키워드 추출 결과]")
    print(f"  - 라우트: {routing.get('route')}")
    print(f"  - 매칭된 키워드:")
    matched = routing.get('matched', {})
    if matched.get('card_names'):
        print(f"    * 카드명: {matched['card_names']}")
    if matched.get('actions'):
        print(f"    * 액션: {matched['actions']}")
    if matched.get('payments'):
        print(f"    * 결제수단: {matched['payments']}")
    if matched.get('weak_intents'):
        print(f"    * 약한 의도: {matched['weak_intents']}")
    
    # 2. RAG 검색 수행
    if routing.get('should_search'):
        print(f"\n[RAG 검색 시작]")
        config = RAGConfig(
            top_k=5,
            model="gpt-4o-mini",
            temperature=0.2,
            include_docs=True
        )
        
        result = await run_rag(text, config)
        
        # 3. 결과 출력
        print(f"\n[검색 결과]")
        print(f"  - 검색된 문서 수: {result['meta']['doc_count']}")
        
        print(f"\n[현재 상황 카드]")
        for idx, card in enumerate(result.get('currentSituation', []), 1):
            print(f"  {idx}. {card.get('title', 'N/A')}")
            if card.get('content'):
                content_preview = card['content'][:100] + "..." if len(card['content']) > 100 else card['content']
                print(f"     내용: {content_preview}")
        
        print(f"\n[안내 스크립트]")
        print(f"  {result.get('guidanceScript', 'N/A')}")
        
        if result.get('docs'):
            print(f"\n[검색된 문서 상세]")
            for idx, doc in enumerate(result['docs'][:2], 1):  # 상위 2개만 출력
                print(f"  {idx}. ID: {doc.get('id')}")
                print(f"     제목: {doc.get('title', 'N/A')}")
                print(f"     점수: {doc.get('score', 0):.4f}")
                print(f"     테이블: {doc.get('table', 'N/A')}")
    else:
        print(f"\n[검색 불필요] {routing.get('route')} - 키워드가 충분하지 않습니다.")
    
    print(f"\n{'='*60}\n")


async def stt_and_rag(duration=60):
    """STT 음성 인식 후 RAG 검색 실행"""
    uri = "ws://127.0.0.1:8000/api/v1/ws"
    
    loop = asyncio.get_running_loop()
    audio_queue = asyncio.Queue()
    audio = Audio(loop, audio_queue)

    frame_size = int(SAMPLE_RATE * FRAME_DURATION_MS / 1000)
    stream = sd.InputStream(
        callback=audio.callback_audio, 
        blocksize=frame_size, 
        dtype='int16', 
        channels=1, 
        samplerate=SAMPLE_RATE
    )
    vad_thread = threading.Thread(target=audio.vad_collector)

    async with websockets.connect(uri) as websocket:
        print("웹소켓 연결 완료")
        print(f"음성 인식을 시작합니다. {duration}초 동안 실행됩니다.")
        print("말씀하시면 자동으로 인식하고 RAG 검색을 수행합니다.\n")

        with stream:
            vad_thread.start()
            start_time = time.time()
            
            # 오디오 전송 및 STT 결과 수신
            send_task = asyncio.create_task(send_audio(websocket, audio_queue, start_time, duration))
            receive_task = asyncio.create_task(receive_transcription(websocket))
            
            await asyncio.gather(send_task, receive_task)

        audio.recording = False
        vad_thread.join()


async def send_audio(websocket, audio_queue, start_time, duration):
    """오디오 데이터를 서버로 전송"""
    while time.time() - start_time < duration:
        try:
            audio_data = await asyncio.wait_for(audio_queue.get(), timeout=1.0)
            await websocket.send(audio_data)
            print(".", end="", flush=True)
        except asyncio.TimeoutError:
            pass


async def receive_transcription(websocket):
    """서버로부터 STT 결과를 수신하고 RAG 처리"""
    try:
        async for message in websocket:
            if isinstance(message, str):
                # STT 결과를 받아서 RAG 검색 수행
                await process_rag_query(message)
    except websockets.exceptions.ConnectionClosed:
        print("\n서버 연결이 종료되었습니다.")


if __name__ == "__main__":
    print("=" * 60)
    print("STT + RAG 통합 테스트")
    print("=" * 60)
    print()
    
    try:
        asyncio.run(stt_and_rag(duration=60))
    except KeyboardInterrupt:
        print("\n\n프로그램을 종료합니다.")
    except Exception as e:
        print(f"\n오류 발생: {e}")
