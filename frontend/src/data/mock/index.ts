/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * CALL:ACT - Mock 데이터 통합 Export
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * ⭐ 모든 페이지/컴포넌트는 이 파일에서만 import 하세요!
 * 
 * import { employeesData, consultationsData } from '@/data/mock';
 * 
 * @version 1.0
 * @since 2025-02-03
 */

// ========== DB 연동 대상 (MVP 이후) ==========
export { employeesData } from './employees.mock';
export { consultationsData } from './consultations.mock';
export { noticesData } from './notices.mock';
export { frequentInquiriesData } from './frequentInquiries.mock';
export { frequentInquiriesDetailData } from './frequentInquiriesDetail.mock';
export { simulationsData } from './simulations.mock';
export { searchMockData } from './search.mock';

// ⭐ 추가: mockData.ts에서 가져오는 데이터
export { 
  simulationScenariosData, 
  recentAttemptsData, 
  dashboardStatsData, 
  weeklyGoalData, 
  teamStatsData, 
  badgesData, 
  monthlyStatsData 
} from '../mockData';

// ========== MVP 예외 항목 (나중에 DB 연동 가능) ==========
export { mockCustomerDB } from './customer.mock';
export type { CustomerPersona } from './customer.mock';
export { getACWDataByCategory, getAllACWData } from './afterCallWork.mock';
export type { ACWData } from './afterCallWork.mock';

// ========== 비즈니스 로직 (항상 Mock 유지) ==========
export { personaTypes } from './personas.mock';
export { categoryMapping, getSubCategories, getMainCategory } from './categoryMapping.mock';

// ========== 시나리오 데이터 (이미 모듈화 완료, 그대로 유지) ==========
// scenarios는 `/src/data/scenarios/index.ts`에서 직접 import
// 이유: 8개 시나리오가 이미 완벽하게 모듈화되어 있음
export type {
  DocumentType,
  ScenarioKeyword,
  ScenarioSTT,
  ScenarioCard,
  ScenarioStep,
  CustomerInfo,
  RecentConsultation,
  Scenario,
} from '../scenarios/types';

export { scenarios, getScenarioByCategory } from '../scenarios';
