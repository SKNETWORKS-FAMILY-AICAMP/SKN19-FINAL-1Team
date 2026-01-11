import sys
import os
import traceback

import time

def log(msg):
    print(f"[{time.strftime('%H:%M:%S')}] {msg}", flush=True)

sys.path.append(os.getcwd())

log(f"Python executable: {sys.executable}")
log("STT 엔진 초기화 테스트")

try:
    log("Import app.audio.stt...")
    from app.audio.stt import get_stt_engine
    log("Imported app.audio.stt!")
    
    log("STT 엔진 호출 중...")
    engine = get_stt_engine()
    log("✅ STT 엔진 초기화 성공!")
    log(f"Model: {engine.model}")
except Exception as e:
    log(f"❌ STT 엔진 초기화 실패: {e}")
    print("-" * 60)
    traceback.print_exc()
    print("-" * 60)
