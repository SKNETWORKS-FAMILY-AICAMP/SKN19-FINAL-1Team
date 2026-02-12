/**
 * ⭐ Phase 10: Mock 고객 DB 데이터
 * 
 * 백엔드 customers 테이블 구조 반영:
 * - 12개 페르소나 기반 Mock 고객 데이터
 * - personality_tags, communication_style 포함
 * - 실제 이름/전화번호 저장 (Frontend에서 마스킹)
 * - birth_date, address 필드 추가 (Phase 10-4)
 * 
 * 백엔드 구현 완료 후 실제 API로 대체 예정
 */

import type { CustomerInfo } from './scenarios';
import { generateBirthDateByAgeGroup, generateRandomAddress } from '@/utils/generateBirthDate';

/**
 * 12개 고객 페르소나 타입 정의
 */
export type CustomerPersona = 
  | 'N1' // 일반친절형 (25%)
  | 'N2' // 조용한내성형 (15%)
  | 'N3' // 실용주의형 (12%)
  | 'N4' // 친화적수다형 (8%)
  | 'S1' // 급한성격형 (8%)
  | 'S2' // 꼼꼼상세형 (6%)
  | 'S3' // 감정호소형 (5%)
  | 'S4' // 시니어친화형 (8%)
  | 'S5' // 디지털네이티브 (5%)
  | 'S6' // VIP고객형 (3%)
  | 'S7' // 반복민원형 (3%)
  | 'S8'; // 불만항의형 (2%)

/**
 * 페르소나별 특성 매핑
 */
export const PERSONA_CONFIG: Record<CustomerPersona, {
  personalityTags: string[];
  communicationStyle: {
    speed: 'fast' | 'moderate' | 'slow';
    tone: 'formal' | 'neutral' | 'casual' | 'warm' | 'empathetic' | 'direct' | 'calm' | 'respectful' | 'premium' | 'solution_focused' | 'calm_professional';
  };
  traits: string[]; // Frontend 표시용
  preferredStyle: string; // LLM 가이드 대체용
}> = {
  N1: {
    personalityTags: ['normal', 'polite'],
    communicationStyle: { speed: 'moderate', tone: 'neutral' },
    traits: ['일반 고객', '친절한 성향'],
    preferredStyle: '일반적인 응대로 친절하게 안내하세요. 표준 매뉴얼대로 진행하시면 됩니다.'
  },
  N2: {
    personalityTags: ['quiet', 'reserved'],
    communicationStyle: { speed: 'moderate', tone: 'calm' },
    traits: ['조용한 성향', '내성적'],
    preferredStyle: '간결한 답변을 선호합니다. 불필요한 대화는 최소화하고 핵심만 전달하세요.'
  },
  N3: {
    personalityTags: ['practical', 'efficient'],
    communicationStyle: { speed: 'fast', tone: 'direct' },
    traits: ['실용주의', '효율 중시', '목적 지향적'],
    preferredStyle: '목적 지향적입니다. 해결책을 먼저 제시하고, 절차는 간단하게 설명하세요.'
  },
  N4: {
    personalityTags: ['friendly', 'talkative'],
    communicationStyle: { speed: 'moderate', tone: 'warm' },
    traits: ['친화적', '수다형', '대화 선호'],
    preferredStyle: '대화를 즐기는 고객입니다. 친근하게 응대하고, 약간의 일상 대화도 괜찮습니다.'
  },
  S1: {
    personalityTags: ['impatient', 'direct', 'busy'],
    communicationStyle: { speed: 'fast', tone: 'direct' },
    traits: ['급한 성향', '빠른 답변 선호', '바쁨'],
    preferredStyle: '빠른 답변을 선호합니다. 간결하게 핵심만 전달하고, 대기 시간을 최소화하세요.'
  },
  S2: {
    personalityTags: ['detailed', 'analytical'],
    communicationStyle: { speed: 'slow', tone: 'formal' },
    traits: ['꼼꼼한 성향', '상세한 설명 필요', '분석적'],
    preferredStyle: '상세한 설명이 필요합니다. 차근차근 단계별로 안내하고, 서면 자료 제공을 제안하세요.'
  },
  S3: {
    personalityTags: ['emotional', 'expressive'],
    communicationStyle: { speed: 'moderate', tone: 'empathetic' },
    traits: ['감정 호소형', '공감 필요', '표현적'],
    preferredStyle: '먼저 경청하고 공감한 후 해결책을 제시하세요. "고객님 말씀 충분히 이해됩니다" 같은 공감 표현을 자주 사용하세요.'
  },
  S4: {
    personalityTags: ['elderly', 'patient', 'needs_repetition'],
    communicationStyle: { speed: 'slow', tone: 'respectful' },
    traits: ['시니어', '천천히 설명 필요', '반복 안내 필요'],
    preferredStyle: '천천히 쉬운 용어로 설명하세요. 필요시 반복 안내하고, 존댓말을 정확히 사용하세요.'
  },
  S5: {
    personalityTags: ['tech_savvy', 'self_service'],
    communicationStyle: { speed: 'fast', tone: 'casual' },
    traits: ['디지털 네이티브', '기술 친화적', '셀프서비스 선호'],
    preferredStyle: '앱/웹 셀프서비스 경로를 먼저 안내하세요. 기술적인 설명을 이해하는 고객입니다.'
  },
  S6: {
    personalityTags: ['high_value', 'premium', 'loyal'],
    communicationStyle: { speed: 'moderate', tone: 'premium' },
    traits: ['VIP 고객', '프리미엄 서비스 기대', '충성 고객'],
    preferredStyle: 'VIP 전용 혜택을 우선 안내하고, 신속 처리를 약속하세요. 담당 매니저 연결 옵션을 제시하세요.'
  },
  S7: {
    personalityTags: ['frequent_caller', 'frustrated'],
    communicationStyle: { speed: 'moderate', tone: 'solution_focused' },
    traits: ['반복 민원', '좌절감', '이전 이력 확인 필요'],
    preferredStyle: '이전 상담 이력을 먼저 확인하세요. 이번엔 확실하게 해결하겠다는 확신을 주세요.'
  },
  S8: {
    personalityTags: ['complaining', 'demanding'],
    communicationStyle: { speed: 'moderate', tone: 'calm_professional' },
    traits: ['불만 항의', '요구사항 많음', '까다로움'],
    preferredStyle: '차분하게 경청한 후 구체적인 해결 방안을 제시하세요. 감정적으로 대응하지 마세요.'
  },
};

/**
 * Mock 고객 데이터 (실제 DB 연동 전까지 사용)
 * 
 * 실제 백엔드 구현 후:
 * GET /api/v1/customers/{customer_id} 로 조회
 */
export const MOCK_CUSTOMER_DB: CustomerInfo[] = [
  // N1: 일반친절형 (25% - 샘플 3명)
  {
    id: 'CUST-TEDDY-00001',
    name: '김민수',
    phone: '010-1234-5678',
    cardNumber: '1234-5678-9012-3456',
    cardType: '테디카드 스탠다드',
    grade: 'GENERAL',
    birthDate: '1982-05-15',
    address: '서울시 강남구 테헤란로 123, 5동 301호',
    ...PERSONA_CONFIG.N1,
    gender: 'male',
    ageGroup: '40대',
    age: 42,
    totalConsultations: 3,
    lastConsultationDate: '2024-12-15',
  },
  {
    id: 'CUST-TEDDY-00002',
    name: '이영희',
    phone: '010-2345-6789',
    cardNumber: '2345-6789-0123-4567',
    cardType: '테디카드 프리미엄',
    grade: 'SILVER',
    birthDate: '1989-08-22',
    address: '서울시 서초구 반포대로 201, 12동 1502호',
    ...PERSONA_CONFIG.N1,
    gender: 'female',
    ageGroup: '30대',
    age: 35,
    totalConsultations: 5,
    lastConsultationDate: '2024-12-10',
  },
  {
    id: 'CUST-TEDDY-00003',
    name: '박지훈',
    phone: '010-3456-7890',
    cardNumber: '3456-7890-1234-5678',
    cardType: '테디카드 스탠다드',
    grade: 'GENERAL',
    birthDate: '1972-11-03',
    address: '서울시 송파구 올림픽로 300, 3동 805호',
    ...PERSONA_CONFIG.N1,
    gender: 'male',
    ageGroup: '50대',
    age: 52,
    totalConsultations: 2,
    lastConsultationDate: '2024-11-28',
  },

  // N2: 조용한내성형 (15% - 샘플 2명)
  {
    id: 'CUST-TEDDY-00010',
    name: '최수진',
    phone: '010-4567-8901',
    cardNumber: '4567-8901-2345-6789',
    cardType: '테디카드 스탠다드',
    grade: 'GENERAL',
    birthDate: '1996-03-14',
    address: '서울시 마포구 월드컵북로 396, 7동 1204호',
    ...PERSONA_CONFIG.N2,
    gender: 'female',
    ageGroup: '20대',
    age: 28,
    totalConsultations: 1,
    lastConsultationDate: '2024-12-01',
  },
  {
    id: 'CUST-TEDDY-00011',
    name: '정민호',
    phone: '010-5678-9012',
    cardNumber: '5678-9012-3456-7890',
    cardType: '테디카드 스탠다드',
    grade: 'GENERAL',
    ...PERSONA_CONFIG.N2,
    gender: 'male',
    ageGroup: '30대',
    age: 33,
    totalConsultations: 2,
    lastConsultationDate: '2024-12-12',
  },

  // N3: 실용주의형 (12% - 샘플 2명)
  {
    id: 'CUST-TEDDY-00020',
    name: '강서연',
    phone: '010-6789-0123',
    cardNumber: '6789-0123-4567-8901',
    cardType: '테디카드 프리미엄',
    grade: 'GOLD',
    ...PERSONA_CONFIG.N3,
    gender: 'female',
    ageGroup: '40대',
    age: 45,
    totalConsultations: 7,
    lastConsultationDate: '2024-12-18',
  },
  {
    id: 'CUST-TEDDY-00021',
    name: '윤재호',
    phone: '010-7890-1234',
    cardNumber: '7890-1234-5678-9012',
    cardType: '테디카드 비즈니스',
    grade: 'GOLD',
    ...PERSONA_CONFIG.N3,
    gender: 'male',
    ageGroup: '30대',
    age: 38,
    totalConsultations: 10,
    lastConsultationDate: '2024-12-20',
  },

  // N4: 친화적수다형 (8% - 샘플 1명)
  {
    id: 'CUST-TEDDY-00030',
    name: '송미라',
    phone: '010-8901-2345',
    cardNumber: '8901-2345-6789-0123',
    cardType: '테디카드 스탠다드',
    grade: 'GENERAL',
    ...PERSONA_CONFIG.N4,
    gender: 'female',
    ageGroup: '50대',
    age: 55,
    totalConsultations: 4,
    lastConsultationDate: '2024-12-05',
  },

  // S1: 급한성격형 (8% - 샘플 1명)
  {
    id: 'CUST-TEDDY-00040',
    name: '김민지',
    phone: '010-9012-3456',
    cardNumber: '9012-3456-7890-1234',
    cardType: '테디카드 프리미엄',
    grade: 'VIP',
    ...PERSONA_CONFIG.S1,
    gender: 'female',
    ageGroup: '30대',
    age: 35,
    totalConsultations: 8,
    lastConsultationDate: '2024-12-22',
  },

  // S2: 꼼꼼상세형 (6% - 샘플 1명)
  {
    id: 'CUST-TEDDY-00050',
    name: '이동욱',
    phone: '010-0123-4567',
    cardNumber: '0123-4567-8901-2345',
    cardType: '테디카드 스탠다드',
    grade: 'SILVER',
    ...PERSONA_CONFIG.S2,
    gender: 'male',
    ageGroup: '40대',
    age: 47,
    totalConsultations: 6,
    lastConsultationDate: '2024-12-08',
  },

  // S3: 감정호소형 (5% - 샘플 1명)
  {
    id: 'CUST-TEDDY-00060',
    name: '한지은',
    phone: '010-1111-2222',
    cardNumber: '1111-2222-3333-4444',
    cardType: '테디카드 스탠다드',
    grade: 'GENERAL',
    ...PERSONA_CONFIG.S3,
    gender: 'female',
    ageGroup: '50대',
    age: 51,
    totalConsultations: 5,
    lastConsultationDate: '2024-12-14',
  },

  // S4: 시니어친화형 (8% - 샘플 1명)
  {
    id: 'CUST-TEDDY-00070',
    name: '박영수',
    phone: '010-2222-3333',
    cardNumber: '2222-3333-4444-5555',
    cardType: '테디카드 실버',
    grade: 'GENERAL',
    ...PERSONA_CONFIG.S4,
    gender: 'male',
    ageGroup: '60대',
    age: 68,
    totalConsultations: 3,
    lastConsultationDate: '2024-12-11',
  },

  // S5: 디지털네이티브 (5% - 샘플 1명)
  {
    id: 'CUST-TEDDY-00080',
    name: '정현우',
    phone: '010-3333-4444',
    cardNumber: '3333-4444-5555-6666',
    cardType: '테디카드 디지털',
    grade: 'SILVER',
    ...PERSONA_CONFIG.S5,
    gender: 'male',
    ageGroup: '20대',
    age: 26,
    totalConsultations: 2,
    lastConsultationDate: '2024-12-17',
  },

  // S6: VIP고객형 (3% - 샘플 1명)
  {
    id: 'CUST-TEDDY-00090',
    name: '최재현',
    phone: '010-4444-5555',
    cardNumber: '4444-5555-6666-7777',
    cardType: '테디카드 프리미엄 플러스',
    grade: 'VIP',
    ...PERSONA_CONFIG.S6,
    gender: 'male',
    ageGroup: '40대',
    age: 48,
    totalConsultations: 15,
    lastConsultationDate: '2024-12-21',
  },

  // S7: 반복민원형 (3% - 샘플 1명)
  {
    id: 'CUST-TEDDY-00100',
    name: '서은영',
    phone: '010-5555-6666',
    cardNumber: '5555-6666-7777-8888',
    cardType: '테디카드 스탠다드',
    grade: 'GENERAL',
    ...PERSONA_CONFIG.S7,
    gender: 'female',
    ageGroup: '50대',
    age: 53,
    totalConsultations: 12,
    lastConsultationDate: '2024-12-19',
  },

  // S8: 불만항의형 (2% - 샘플 1명)
  {
    id: 'CUST-TEDDY-00110',
    name: '황동환',
    phone: '010-6666-7777',
    cardNumber: '6666-7777-8888-9999',
    cardType: '테디카드 스탠다드',
    grade: 'GENERAL',
    ...PERSONA_CONFIG.S8,
    gender: 'male',
    ageGroup: '60대',
    age: 62,
    totalConsultations: 9,
    lastConsultationDate: '2024-12-16',
  },
];

/**
 * 고객 ID로 고객 정보 조회 (Mock)
 * 
 * @param customerId - 고객 ID (예: 'CUST-TEDDY-00001')
 * @returns 고객 정보 또는 null
 */
export function getCustomerById(customerId: string): CustomerInfo | null {
  return MOCK_CUSTOMER_DB.find(customer => customer.id === customerId) || null;
}

/**
 * 페르소나 타입으로 고객 목록 조회 (Mock)
 * 
 * @param persona - 페르소나 타입 (예: 'S1')
 * @returns 해당 페르소나의 고객 목록
 */
export function getCustomersByPersona(persona: CustomerPersona): CustomerInfo[] {
  const config = PERSONA_CONFIG[persona];
  return MOCK_CUSTOMER_DB.filter(customer => 
    JSON.stringify(customer.personalityTags) === JSON.stringify(config.personalityTags)
  );
}

/**
 * 전체 고객 수 조회 (Mock)
 */
export function getTotalCustomerCount(): number {
  return MOCK_CUSTOMER_DB.length;
}
