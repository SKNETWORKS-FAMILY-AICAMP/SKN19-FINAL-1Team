// 6개 상담 시나리오 (각 대기 콜 카테고리별)
// 실제 RAG, STT, 고객DB를 시뮬레이션하는 상세한 mockData
// ⭐ 모듈화된 시나리오 import
import { scenarios, getScenarioByCategory } from './scenarios/index';

// ⭐ Re-export for backward compatibility
export { scenarios, getScenarioByCategory };

// ⭐ Phase 2: 문서 타입 체계화
export type DocumentType = 'terms' | 'product-spec' | 'analysis-report' | 'guide' | 'general';

export interface ScenarioKeyword {
  text: string;
  appearTime: number; // 통화 시작 후 몇 초에 등장하는지
}

export interface ScenarioSTT {
  speaker: "customer" | "agent";
  message: string;
  timestamp: number; // 통화 시작 후 몇 초
}

export interface ScenarioCard {
  id: string;
  title: string;
  keywords: string[];
  content: string;
  systemPath: string;
  requiredChecks: string[];
  exceptions: string[];
  time: string;
  note: string;
  regulation: string;
  fullText: string;
  // ⭐ 하이브리드 카드 속성
  type?: 'text' | 'product-info';
  attributes?: Array<{ 
    label: string; 
    value: string; 
    highlight?: boolean 
  }>;
  // ⭐ Phase 2: 문서 타입 추가 (선택 필드 - 기존 코드 호환성 유지)
  documentType?: DocumentType;
  // ⭐ Phase Search Layer: 타임스탬프 추가
  timestamp?: string; // ISO 8601 형식 (YYYY-MM-DDTHH:mm:ss)
  displayTime?: string; // 화면 표시용 (HH:MM (N분 전))
  // ⭐ 검색 결과 매칭 점수
  relevanceScore?: number; // 검색 매칭 점수 (0-100)
}

export interface ScenarioStep {
  stepNumber: number;
  keywords: ScenarioKeyword[]; // 이 단계에서 등장하는 키워드들
  currentSituationCards: ScenarioCard[]; // 현재 상황 카드 2개
  nextStepCards: ScenarioCard[]; // 다음 단계 카드 2개
  guidanceScript: string; // 상담 안내 멘트
}

export interface CustomerInfo {
  id: string;
  name: string;
  phone: string;
  cardNumber: string;
  cardType: string;
  grade: string;
  // ⭐ 카드 정보 추가
  cardName?: string; // 카드 이름 (예: 하나 원큐 패밀리카드)
  cardIssueDate?: string; // 발급일 (YYYY-MM-DD)
  cardExpiryDate?: string; // 유효기간 (MM/YY)
  // 고객 기본 정보
  birthDate?: string; // 생년월일 (YYYY-MM-DD)
  address?: string; // 주소
  // 고객 특성 태그 시스템
  traits?: string[]; // 고객 특성 태그 배열 (최대 4개)
  age?: number; // 나이
  preferredStyle?: string; // 선호 소통 방식 요약
  // 고객 DB 연동 (백엔드 personality_tags 매핑 - 8개 페르소나: N1-N3, S1-S5)
  personalityTags?: string[]; // 백엔드 personality_tags
  communicationStyle?: {
    // 백엔드 communication_style
    speed?: "fast" | "moderate" | "slow";
    tone?:
      | "formal"
      | "neutral"
      | "casual"
      | "warm"
      | "empathetic";
  };
  gender?: "male" | "female" | "unknown"; // 성별
  ageGroup?: string; // 연령대 ('20대', '30대', '40대', '50대', '60대', '70대')
  totalConsultations?: number; // 총 상담 횟수
  lastConsultationDate?: string; // 마지막 상담 일자
}

export interface RecentConsultation {
  id: string;
  category: string;
  content: string;
  date: string;
}

export interface Scenario {
  id: string;
  category: string; // 카드분실, 해외결제, 수수료문의, 한도증액, 연체문의, 기타문의
  customer: CustomerInfo;
  recentConsultations: RecentConsultation[];
  sttDialogue: ScenarioSTT[];
  steps: ScenarioStep[];
}

// ⭐ 모든 함수는 scenarios/index.ts에서 관리됨