# 시나리오 모듈화 검증 가이드

## ✅ 완료 체크리스트

1. [ ] 모든 scenario1~8.ts 파일에 내용 붙여넣기 완료
2. [ ] 각 파일이 `export const scenarioN: Scenario = {`로 시작하는지 확인
3. [ ] 각 파일이 `};`로 끝나는지 확인
4. [ ] TypeScript 에러 없는지 확인 (`npm run build` 또는 에디터에서 확인)

## 🧪 테스트 방법

### 1. Import 테스트
다음 코드를 임의의 파일에서 실행해보세요:

```typescript
import { scenarios, getScenarioByCategory } from '@/data/scenarios';

console.log('총 시나리오 개수:', scenarios.length); // 8이어야 함
console.log('시나리오 1:', scenarios[0].category); // "카드분실"이어야 함
console.log('카테고리 검색:', getScenarioByCategory('카드분실')?.id); // "scenario-1"이어야 함
```

### 2. 기존 코드 호환성 테스트
기존 코드에서 사용하던 모든 import가 정상 작동하는지 확인:

```typescript
// 기존 방식 (여전히 작동해야 함)
import { scenarios } from '@/data/scenarios';
import type { Scenario } from '@/data/scenarios';
```

## ⚠️ 문제 발생 시

### TypeScript 에러 발생
- 각 scenario 파일에서 `import type { Scenario } from './types';`가 있는지 확인
- 마지막 `};`가 빠지지 않았는지 확인

### scenarios.length가 8이 아닌 경우
- index.ts에서 모든 scenario1~8이 import되었는지 확인
- scenarios 배열에 8개가 모두 포함되었는지 확인

### 특정 시나리오가 undefined인 경우
- 해당 scenario 파일에서 `export const scenarioN`로 정확히 export되었는지 확인
- 붙여넣기한 내용이 올바른 줄 범위인지 재확인
