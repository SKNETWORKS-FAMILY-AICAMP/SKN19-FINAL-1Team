# CALL:ACT

> **카드사 콜센터 상담원을 위한 AI 상담 업무 지원 서비스**

LLM을 활용한 내부 고객 업무 효율성 향상을 위한 문서 검색 시스템

---

## 목차

1. [팀 소개](#1-팀-소개)
2. [프로젝트 개요](#2-프로젝트-개요)
3. [기술 스택](#3-기술-스택)
4. [문제 정의](#4-문제-정의)
5. [문제 해결 전략](#5-문제-해결-전략)
6. [수집 데이터 및 활용 목적](#6-수집-데이터-및-활용-목적)
7. [시스템 아키텍처](#7-시스템-아키텍처)
8. [성과 및 검증](#8-성과-및-검증)
9. [트러블 슈팅](#9-트러블-슈팅)
10. [향후 계획](#10-향후-계획)

---

## 1. 팀 소개

<div align="center">

### 레디테디

*"항상 내 얘기를 들어주는 테디 베어처럼"*
  
| **박소희** | **배상준** | **안수이** | **오흥재** |
|:---:|:---:|:---:|:---:|
| <img width="108" height="108" alt="image" src="https://github.com/user-attachments/assets/ef0628b2-d087-418b-a018-7f9c5c325b88" /> | <img width="108" height="108" alt="image" src="https://github.com/user-attachments/assets/a53f0da4-f30c-4b2e-af34-404f88c40bec" /> | <img width="108" height="108" alt="image" src="https://github.com/user-attachments/assets/6456c1e9-77bf-4141-9dfe-390efd3c9836" /> | <img width="108" height="108" alt="image" src="https://github.com/user-attachments/assets/0f6a25c8-78c5-4613-bf7a-5c344e83a2f1" /> |
| [![GitHub](https://img.shields.io/badge/GitHub-xxoysauce-2496ED?logo=github&logoColor=white)](https://github.com/xxoysauce) | [![GitHub](https://img.shields.io/badge/GitHub-WindyAle-2496ED?logo=github&logoColor=white)](https://github.com/WindyAle) | [![GitHub](https://img.shields.io/badge/GitHub-ahnsui-2496ED?logo=github&logoColor=white)](https://github.com/ahnsui) | [![GitHub](https://img.shields.io/badge/GitHub-vfxpedia-2496ED?logo=github&logoColor=white)](https://github.com/vfxpedia) |
| RAG 문서 검색<br>인프라 구축 | 키워드 추출<br>교육 시뮬레이션 | STT 설계<br>후처리 & 피드백<br>인프라 구축 | DB 구축 및 관리<br>프론트엔드 |

</div>

---

## 2. 프로젝트 개요

### 프로젝트명
**CALL:ACT** - 카드사 콜센터 상담원을 위한 AI 상담 업무 지원 서비스

### 프로젝트 기간
2025년 12월 18일 ~ 2026년 2월 11일

### 프로젝트 목표
LLM과 RAG 기술을 활용하여 콜센터 상담원의 업무 효율성을 향상시키는 AI 기반 상담 지원 플랫폼 개발

### 주요 기능

| 기능 | 설명 |
|------|------|
| **실시간 상담 지원** | WebSocket 기반 STT, RAG 검색, AI 상담 가이드 |
| **교육 시뮬레이션** | TTS 활용 가상 고객 대화 연습, 상담 평가 |
| **후처리(ACW)** | 상담 내용 자동 요약, AI 피드백 |
| **고객/상담사 관리** | 고객 정보 조회, 상담 이력 관리 |
| **공지사항/FAQ** | 공지사항 관리, 자주 들어오는 문의 |

---

## 3. 기술 스택

### Backend
| 분류 | 기술 |
|------|------|
| Language | Python 3.11 |
| Framework | FastAPI 0.128 |
| Database | PostgreSQL 17, pgvector |
| LLM | OpenAI API (GPT-4.1), kanana 1.5, kanana nano |
| STT/TTS | Whisper, Qwen3-TTS |
| NLP | KiwiPiepy 0.22, PyKoSpacing 0.5 |

### Frontend
| 분류 | 기술 |
|------|------|
| Framework | React 18.3, TypeScript |
| Build Tool | Vite 6.3 |
| Styling | Tailwind CSS 4.1, Material-UI 7.3 |

### DevOps
| 분류 | 기술 |
|------|------|
| Cache | Redis 7 |
| Container | Docker 3.8 |
| Web Server | Nginx |
| Deployment | AWS EC2 |

---

## 4. 문제 정의

### 콜센터 상담원이 겪는 문제점

#### 1. AICC 도입의 부작용
- AI는 정답이 정해진 단순 응대 외의 복잡한 케이스를 대처하지 못함
- 고객들은 여전히 인간 상담원을 원하는 수요와 공급 간의 부조화
- 미흡한 AI 챗봇으로 인해 불만이 늘어난 고객을 상대해야 하는 상담원의 감정노동

#### 2. 정보 검색의 비효율성
- 고객이 무엇이 필요한지 실시간으로 탐색하는 것의 어려움
- 키워드 기반 검색의 한계로 원하는 정보를 찾는 데 시간 소요

#### 3. 신입 상담원의 높은 학습장벽
- 다양한 상품과 서비스에 대한 지식 습득에 오랜 시간 필요
- 실제 상담 경험 부족으로 인한 응대 품질 저하
- 실무와 동떨어진 이론 위주 교육

#### 4. 후처리 업무 부담
- 상담 종료 후 내용 정리 및 요약에 많은 시간 소요, 그에 따른 상사의 압박
- 수작업으로 인한 기록 누락 및 오류 발생
- 상담 품질 분석의 어려움

---

## 5. 문제 해결 전략

### 해결 방안

| 문제 | 해결 전략 |
|------|----------|
| 정보 검색 비효율 | RAG 기반 의미 검색 |
| 실시간 응대 가이드 | 실시간 STT + AI 추천 |
| 신입 교육 부족 | AI 시뮬레이션 교육 |
| 후처리 부담 | 자동 요약 및 피드백 |

### 핵심 기술 적용

#### RAG (Retrieval-Augmented Generation)
```
사용자 질문 → 키워드 추출 → 벡터 검색 → 재랭킹 → 응답 생성
```
- 형태소 분석을 통한 금융 키워드 추출
- pgvector를 활용한 의미 기반 문서 검색
- LLM 기반 검색 결과 재정렬 및 응답 생성

#### 실시간 음성 처리
```
음성 입력 → STT (Whisper) → 화자 분리 → 텍스트 처리 → RAG 검색
```
- WebSocket 기반 실시간 통신
- Whisper를 활용한 음성 인식
- 화자 분리(Diarization)를 통한 상담원/고객 구분

---

## 6. 수집 데이터 및 활용 목적

### 수집 데이터

| 데이터 유형 | 내용 | 활용 목적 |
|------------|------|----------|
| **카드 상품 정보** | 신용카드 상품명, 혜택, 연회비 등 | RAG 검색 대상 |
| **서비스 가이드** | 카드 발급, 분실 신고, 결제 방법 등 | 상담 응답 생성 |
| **FAQ 데이터** | 자주 묻는 질문과 답변 | 빠른 응답 제공 |
| **상담 시나리오** | 다양한 상담 상황 시나리오 | 교육 시뮬레이션 |

### 데이터 전처리

1. **텍스트 정제**: 불필요한 특수문자 제거, 정규화
2. **청킹(Chunking)**: 문서를 적절한 크기로 분할
3. **임베딩**: OpenAI Embedding 모델을 통한 벡터화
4. **인덱싱**: pgvector에 벡터 데이터 저장

---

## 7. 시스템 아키텍처

### 전체 시스템 구조

<img width="1136" height="566" alt="image" src="https://github.com/user-attachments/assets/cfca7862-7ce2-469f-881a-488cb1729bc6" />


### 프로젝트 구조

```
SKN19-FINAL-1Team/
├── backend/                   # FastAPI 백엔드
│   ├── app/
│   │   ├── api/v1/endpoints/  # API 엔드포인트
│   │   ├── audio/             # 음성 처리 (STT, TTS)
│   │   ├── llm/               # LLM 모듈
│   │   ├── rag/               # RAG 파이프라인
│   │   ├── db/                # 데이터베이스
│   │   └── crud/              # CRUD 작업
│   ├── docker/                # Docker 설정
│   └── requirements.txt
│
├── frontend/                   # React 프론트엔드
│   ├── src/
│   │   ├── app/pages/         # 페이지 컴포넌트
│   │   ├── api/               # API 클라이언트
│   │   └── types/             # TypeScript 타입
│   └── package.json
│
└── docs/                       # 프로젝트 문서
```

---

## 8. 성과 및 검증

### 주요 성과

| 지표 | 내용 |
|------|------|
| **검색 정확도** | RAG 파이프라인을 통한 맥락 기반 정확한 정보 제공 |
| **응답 속도** | WebSocket 기반 실시간 STT 및 응답 추천 |
| **교육 효과** | AI 시뮬레이션을 통한 체계적인 상담원 교육 |
| **업무 효율** | 자동 요약 기능으로 사후 처리 시간 단축 |

### 구현 기능 검증

- **실시간 상담**: WebSocket 연결 안정성, STT 정확도 테스트
- **RAG 검색**: 다양한 질문에 대한 검색 결과 품질 평가
- **교육 시뮬레이션**: 가상 고객 응답의 자연스러움 검증
- **사후 처리**: 요약 정확도 및 피드백 유용성 평가

---
