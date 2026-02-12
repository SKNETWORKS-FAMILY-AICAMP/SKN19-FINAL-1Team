# 🗂️ scenarios.ts 정리 가이드

## 📌 작업 목표

`/src/data/scenarios.ts` 파일 (5,137줄)에서 모듈화된 시나리오 데이터를 삭제하고, 
타입 정의와 매핑 함수만 남기기

---

## ✅ Step 1: 백업 생성 (필수!)

### 📋 작업 순서

1. `/src/data/scenarios.ts` 파일을 엽니다
2. **전체 내용을 복사** (Ctrl+A → Ctrl+C)
3. `/src/data/scenarios/back/scenarios_backup.ts` 파일을 엽니다
4. 주석 아래에 **전체 내용을 붙여넣기** (스켈레톤 이미 생성됨)
5. 저장

---

## ❌ Step 2: 불필요한 코드 삭제

### 📍 삭제할 범위: 라인 106 ~ 5102 (총 4,997줄)

#### **삭제 시작 지점 (라인 106)**
```typescript
// ========== 시나리오 1: 카드분실 ==========
```

#### **삭제 끝 지점 (라인 5102)**
```typescript
export const scenarios: Scenario[] = [
  scenario1,
  scenario2,
  scenario3,
  scenario4,
  scenario5,
  scenario6,
  scenario7,
  scenario8,
];
```

### 🎯 삭제 대상

```typescript
// ❌❌❌ 아래 전체 삭제 ❌❌❌

// ========== 시나리오 1: 카드분실 ==========
const scenario1: Scenario = {
  id: "scenario-1",
  category: "카드분실",
  customer: {
    ...
  },
  ...
};

// ========== 시나리오 2: 한도증액 ==========
const scenario2: Scenario = {
  ...
};

// ========== 시나리오 3: 해외결제 ==========
const scenario3: Scenario = {
  ...
};

// ... (scenario4 ~ scenario8까지 동일)

// ========== Export all scenarios ==========
export const scenarios: Scenario[] = [
  scenario1,
  scenario2,
  scenario3,
  scenario4,
  scenario5,
  scenario6,
  scenario7,
  scenario8,
];

// ❌❌❌ 삭제 끝 ❌❌❌
```

---

## ✅ Step 3: 유지할 코드 확인

### 📍 유지할 범위: 라인 1 ~ 105 + 라인 5103 ~ 5138

#### **✅ 유지: 파일 상단 (라인 1 ~ 105)**
- 주석
- Type 정의들:
  - `DocumentType`
  - `ScenarioKeyword`
  - `ScenarioSTT`
  - `ScenarioCard`
  - `ScenarioStep`
  - `CustomerInfo`
  - `RecentConsultation`
  - `Scenario`

#### **✅ 유지: 파일 하단 (라인 5103 ~ 5138)**
- `categoryMapping` 객체
- `getScenarioByCategory()` 함수

---

## 📊 정리 후 예상 결과

### **정리 전**
```
총 5,137줄
├── 타입 정의 (1-105줄)
├── 시나리오 데이터 (106-5102줄) ❌ 삭제 대상
└── 매핑 함수 (5103-5138줄)
```

### **정리 후**
```
총 140줄 (약 97% 감소!)
├── 타입 정의 (1-105줄) ✅
└── 매핑 함수 (106-141줄) ✅
```

---

## 🔧 Step 4: 정리 후 수정 작업

### 📌 삭제 후 라인 번호가 변경되므로, 아래 내용으로 교체

삭제 후 **라인 106**부터 다음 내용이 시작되어야 합니다:

```typescript
// ⭐ Phase 14: 8개 대분류를 6개 시나리오로 매핑
const categoryMapping: Record<string, string> = {
  "분실/도난": "카드분실",
  한도: "한도증액",
  "결제/승인": "해외결제",
  이용내역: "기타문의",
  "수수료/연체": "연체문의",
  "포인트/혜택": "포인트/혜택",
  정부지원: "정부지원",
  기타: "기타문의",
};

export function getScenarioByCategory(
  category: string,
): Scenario | null {
  // ⭐ 우수 상담 사례는 "분실/도난 > 분실신고" 형식이므로 '>' 앞부분만 추출
  const mainCategory = category.includes('>') 
    ? category.split('>')[0].trim() 
    : category;
  
  // 1. 직접 매칭 시도 (하위 호환성)
  const direct = scenarios.find((s) => s.category === mainCategory);
  if (direct) return direct;

  // 2. 8개 대분류 → 6개 시나리오 매핑
  const mappedCategory = categoryMapping[mainCategory];
  if (mappedCategory) {
    return (
      scenarios.find((s) => s.category === mappedCategory) ||
      null
    );
  }

  return null;
}
```

---

## ⚠️ Step 5: import 추가 필요!

정리 후 `scenarios` 배열이 삭제되었으므로, **파일 상단에 import 추가**:

### 📍 추가 위치: 라인 3 (주석 아래)

```typescript
// 6개 상담 시나리오 (각 대기 콜 카테고리별)
// 실제 RAG, STT, 고객DB를 시뮬레이션하는 상세한 mockData

// ⭐ 모듈화된 시나리오 import
import { scenarios } from './scenarios/index';

// ⭐ Phase 2: 문서 타입 체계화
export type DocumentType = 'terms' | 'product-spec' | 'analysis-report' | 'guide' | 'general';
```

---

## 📋 전체 작업 체크리스트

```
[ ] Step 1: scenarios.ts 전체 내용을 scenarios/back/scenarios_backup.ts에 복사
[ ] Step 2: 라인 106~5102 삭제 (시나리오 데이터 + scenarios 배열)
[ ] Step 3: 파일 상단에 import { scenarios } from './scenarios/index'; 추가
[ ] Step 4: 파일 저장
[ ] Step 5: 프로젝트 실행하여 에러 없는지 확인
```

---

## ✅ 최종 파일 구조 (정리 후)

```typescript
// /src/data/scenarios.ts (약 140줄)

// 주석...

// ⭐ 모듈화된 시나리오 import
import { scenarios } from './scenarios/index';

// ⭐ Phase 2: 문서 타입 체계화
export type DocumentType = ...

export interface ScenarioKeyword { ... }

export interface ScenarioSTT { ... }

export interface ScenarioCard { ... }

export interface ScenarioStep { ... }

export interface CustomerInfo { ... }

export interface RecentConsultation { ... }

export interface Scenario { ... }

// ⭐ Phase 14: 8개 대분류를 6개 시나리오로 매핑
const categoryMapping: Record<string, string> = { ... };

export function getScenarioByCategory(
  category: string,
): Scenario | null {
  ...
}
```

---

## 🎯 작업 완료 후 확인 사항

1. ✅ `/src/data/scenarios.ts` 파일이 약 140줄로 줄어들었는지 확인
2. ✅ `import { scenarios } from './scenarios/index';` 추가되었는지 확인
3. ✅ `getScenarioByCategory()` 함수가 정상 동작하는지 확인
4. ✅ 프로젝트 실행 시 에러가 없는지 확인

---

**문제 발생 시: `/src/data/scenarios/back/scenarios_backup.ts` 백업 파일에서 복구 가능!**
