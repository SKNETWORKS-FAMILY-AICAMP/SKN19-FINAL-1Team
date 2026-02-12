/**
 * ⭐ Phase A: 상담 데이터 타입 정의
 * 
 * DB 스키마 확정 후 업데이트 예정
 */

// ========================================
// 1. 기본 엔티티 타입
// ========================================

/**
 * 상담사 정보
 */
export interface Employee {
  id: string;               // DB PK (auto-increment or UUID)
  employeeId: string;       // EMP-002, ADMIN-001
  name: string;
  role: 'agent' | 'admin';
  department?: string;
  email?: string;
}

/**
 * 고객 정보
 */
export interface Customer {
  id: string;               // CUST-001
  name: string;
  phone: string;
  birthDate?: string;
  address?: string;
}

/**
 * 참조 문서
 */
export interface ReferencedDocument {
  stepNumber: number;       // RAG 조회 순서
  documentId: string;       // DOC-123
  title: string;
  used: boolean;            // 클릭 여부
  viewCount?: number;       // 조회 횟수 (상담 중)
}

// ========================================
// 2. 상담 데이터 (Core)
// ========================================

/**
 * 상담 기본 정보 (DB consultations 테이블)
 * 
 * TODO: DB 스키마 확정 후 필드 추가/수정
 */
export interface Consultation {
  // 식별자
  consultationId: string;   // CS-EMP002-202601211430
  employeeId: string;       // EMP-002
  customerId: string;       // CUST-001
  
  // 상담 내용
  category: string;         // 카드분실, 해외결제 등
  title: string;            // 상담 제목
  status: string;           // 진행중, 완료, 보류
  
  // 시간 정보
  datetime: string;         // 2025-01-21 14:30
  callTimeSeconds: number;  // 통화 시간 (초)
  acwTimeSeconds: number;   // 후처리 시간 (초)
  
  // AI 분석 결과
  aiSummary: string;        // LLM 요약
  sentiment?: string;       // 감정 분석 (긍정/부정/중립)
  feedbackScore?: number;   // ⭐ Phase 10-5: 피드백 점수 (100점 만점, 0-100)
  satisfactionScore?: number; // ⭐ Phase 10-5: 고객 만족도 (5점 만점, 1-5)
  
  // 상담 내용
  memo: string;             // 상담사 메모
  transcript?: string;      // STT 전문 (선택)
  
  // 후속 조치
  followUpTasks: string;
  handoffDepartment: string;
  handoffNotes: string;
  
  // 참조 문서
  referencedDocuments: ReferencedDocument[];
  referencedDocumentIds: string[];
}

// ========================================
// 3. 프론트엔드 전용 타입 (localStorage)
// ========================================

/**
 * 상담 종료 시 localStorage에 저장되는 데이터
 * (RealTimeConsultationPage → LoadingPage → AfterCallWorkPage)
 */
export interface PendingConsultation {
  consultationId: string;
  employeeId: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  category: string;
  datetime: string;
  callTime: number;         // 통화 시간 (초)
  memo: string;
}

/**
 * LLM 분석 결과 (LoadingPage에서 생성)
 */
export interface LLMAnalysisResult {
  summary: string;          // AI 요약
  title: string;            // 제목 추천
  category: string;         // 카테고리 분류
  followUpTasks: string;    // 후속 조치 추천
  sentiment?: string;       // 감정 분석
  feedbackScore?: number;   // 피드백 점수
}

// ========================================
// 4. API 요청/응답 타입
// ========================================

/**
 * 상담 저장 API 요청 (POST /api/consultations)
 * 
 * TODO: 백엔드 API 스펙 확정 후 수정
 */
// 처리 타임라인 항목
export interface ProcessingTimelineItem {
  time: string;      // "14:32:30" 형식
  action: string;    // "고객 본인 확인"
  category?: string | null; // 카테고리 (선택)
}

export interface SaveConsultationRequest {
  consultationId: string;
  employeeId: string;
  customerId: string;
  customerName: string;     // 고객명은 참고용 (FK는 customerId)
  category: string;
  title: string;
  status: string;
  datetime: string;
  callTimeSeconds: number;
  acwTimeSeconds: number;
  aiSummary: string;
  memo: string;
  transcript?: string;      // 선택적
  followUpTasks: string;
  handoffDepartment: string;
  handoffNotes: string;
  referencedDocuments: ReferencedDocument[];
  referencedDocumentIds: string[];
  processingTimeline?: ProcessingTimelineItem[]; // ⭐ 처리 타임라인
  sentiment?: string;
  feedbackScore?: number;   // ⭐ Phase 10-5: 피드백 점수 (100점 만점, 0-100)
  satisfactionScore?: number; // ⭐ Phase 10-5: 고객 만족도 (5점 만점, 1-5)
}

/**
 * API 응답 (공통)
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// ========================================
// 5. Mock 데이터 타입
// ========================================

/**
 * AfterCallWorkPage Mock 데이터
 */
export interface MockAfterCallWorkData {
  callInfo: {
    id: string;
    datetime: string;
  };
  customerInfo: {
    id: string;
    name: string;
    phone: string;
  };
  currentCase: {
    category: string;
    summary: string;
    aiRecommendation: string;
  };
  similarCase: {
    category: string;
    summary: string;
  };
  callTranscript: Array<{
    speaker: 'customer' | 'agent';
    message: string;
    timestamp: string;
  }>;
}