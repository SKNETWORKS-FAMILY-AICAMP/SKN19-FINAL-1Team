# DB 정규화 준비 디렉토리

## 📌 목적
향후 고객, 문서, 상담 이력 등을 분리하여 실제 DB 구조와 동일하게 구성하기 위한 준비 공간

## 📋 계획된 파일 구조

```
/src/data/db/
├── customers.ts         // 고객 마스터 데이터
├── consultations.ts     // 상담 이력
├── documents.ts         // 약관/문서 전문
├── cards.ts            // 카드 상품 정보
└── index.ts            // 중앙 export
```

## 🎯 분리 시점 (Phase 2 - 기능 완성 후)

### 우선순위 1: 문서(documents.ts)
- 효과: 같은 약관 중복 제거, 법률 개정 시 1곳만 수정
- 예상 시간: 2-3시간
- 영향 범위: DocumentDetailModal, InfoCard

### 우선순위 2: 고객(customers.ts)
- 효과: 실제 DB 구조와 동일, API 연동 준비
- 예상 시간: 1-2시간
- 영향 범위: RealTimeConsultationPage, CustomerTraitGuide

### 우선순위 3: 상담 이력(consultations.ts)
- 효과: 고객별 상담 이력 통합 관리
- 예상 시간: 1시간
- 영향 범위: RecentConsultations 컴포넌트

## ⚠️ 주의사항

**현재는 비정규화 구조 유지 중:**
- 교육/시뮬레이션 특성상 즉시성과 독립성이 중요
- 기능 개발(scenario7, mockAfterCallWork)이 우선
- 정규화는 기능 완성 후 최적화 단계에서 진행

## 🔄 마이그레이션 체크리스트 (미래 작업)

### Phase 2A: 문서 분리
- [ ] documents.ts 생성
- [ ] 모든 시나리오에서 fullText 추출
- [ ] documentId 매핑 테이블 작성
- [ ] DocumentDetailModal 수정
- [ ] 테스트

### Phase 2B: 고객 DB 분리
- [ ] customers.ts 생성
- [ ] 8개 시나리오 고객 정보 추출
- [ ] customerId 참조로 변경
- [ ] RealTimeConsultationPage 수정
- [ ] 테스트

### Phase 3: 실제 DB 연동
- [ ] FastAPI 엔드포인트 구현
- [ ] Supabase 스키마 설계
- [ ] React Query 도입
- [ ] localStorage → DB 마이그레이션
- [ ] 통합 테스트
