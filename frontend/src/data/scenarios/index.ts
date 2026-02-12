// 시나리오 데이터 중앙 관리
// 모든 시나리오를 여기서 export하여 하위 호환성 100% 유지

// ========== 타입 정의 Re-export ==========
export type {
  DocumentType,
  ScenarioKeyword,
  ScenarioSTT,
  ScenarioCard,
  ScenarioStep,
  CustomerInfo,
  RecentConsultation,
  Scenario,
} from './types';

// ========== 개별 시나리오 Import ==========
import { scenario1 } from './scenario1';
import { scenario2 } from './scenario2';
import { scenario3 } from './scenario3';
import { scenario4 } from './scenario4';
import { scenario5 } from './scenario5';
import { scenario6 } from './scenario6';
import { scenario7 } from './scenario7';
import { scenario8 } from './scenario8';
import type { Scenario } from './types';

// ========== Export 배열 (기존 코드와 100% 호환) ==========
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

// ========== 카테고리 매핑 (기존 로직 그대로) ==========
// ⭐ Phase 14: 8개 대분류를 8개 시나리오로 매핑
const categoryMapping: Record<string, string> = {
  "분실/도난": "카드분실",
  한도: "한도증액",
  "결제/승인": "해외결제", // 결제/승인은 해외결제 시나리오로 매핑
  이용내역: "기타문의", // 이용내역은 기타문의로 매핑
  "수수료/연체": "연체문의", // 수수료는 연체문의에 통합
  "포인트/혜택": "포인트/혜택", // ⭐ 시나리오 7
  정부지원: "정부지원", // ⭐ 시나리오 8
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

  // 2. 8개 대분류 → 8개 시나리오 매핑
  const mappedCategory = categoryMapping[mainCategory];
  if (mappedCategory) {
    return (
      scenarios.find((s) => s.category === mappedCategory) ||
      null
    );
  }

  return null;
}