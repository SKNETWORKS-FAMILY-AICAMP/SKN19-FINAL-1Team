"""
서버 실행 스크립트
이 스크립트를 사용하여 서버를 실행하면 PYTHONPATH가 자동으로 설정됩니다.
"""
import sys
import os
from pathlib import Path

# 프로젝트 루트를 PYTHONPATH에 추가
project_root = Path(__file__).parent
sys.path.insert(0, str(project_root))

if __name__ == "__main__":
    import uvicorn
    
    # 환경 변수 설정
    os.environ.setdefault("PYTHONPATH", str(project_root))
    
    # 서버 실행
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        reload_dirs=["app"],
    )
