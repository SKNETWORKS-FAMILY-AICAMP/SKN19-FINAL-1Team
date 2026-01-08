## 환경 변수 설정

`.env` 파일 생성

```
# OPENAI
OPENAI_API_KEY=
# HUGGINGFACE
HF_TOKEN=
# RUNPOD
RUNPOD_API_KEY=

# R-DB
DB_HOST=localhost
DB_PORT=5432
DB_USER=
DB_PASSWORD=
DB_NAME=

# 모델 파일을 저장할 로컬 폴더 경로
MODEL_CACHE_DIR=./model_cache
```

## 실행 방법
```
# 0. 저장소 클론
git clone <repository-url>

# 1. 새 conda 가상환경 생성
conda env create -f environment.yml

# 2. 가상환경 활성화
conda activate final_env

# 3. 라이브러리 설치
pip install -r requirements.txt
```

## 기타
```
# 가상환경 활성화
conda activate final_env

# requirements 최신화
pip freeze > requirements.txt

# conda 가상환경 삭제
conda remove -n 삭제할가상환경 --all

# fastapi 실행
uvicorn main:app --reload
```