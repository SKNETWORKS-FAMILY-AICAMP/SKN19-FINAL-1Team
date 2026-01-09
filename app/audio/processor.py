import queue

def process_audio_stream(user_queue: queue.Queue, user_id: str):
    print(f"{user_id} : 스레드 시작")

    while True:
        try:
            audio_chunk = user_queue.get()

            if audio_chunk is None:
                print(f"{user_id} : 스레드 중단")
                break

            # ffmpeg 변환 및 VAD 코드 작성하기
            # =======================================
            print(f'chunk size : {len(audio_chunk)}')

            user_queue.task_done()
        
        except queue.Empty:
            continue   # 큐가 비어있으면 대기
        except Exception as e:
            print(f"{user_id} : 스레드 오류 발생 {e}")
            break