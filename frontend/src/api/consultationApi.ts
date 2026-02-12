/**
 * ⭐ Phase A: 상담 API 레이어
 * 
 * Mock/Real 데이터 전환을 처리하는 API 인터페이스
 */

import { USE_MOCK_DATA } from '@/config/mockConfig';
import type { 
  SaveConsultationRequest, 
  ApiResponse,
  PendingConsultation,
  LLMAnalysisResult,
  MockAfterCallWorkData
} from '@/types/consultation';
import { API_BASE_URL } from './../config/apiConfig'


// ⭐ USE_MOCK_DATA를 re-export (다른 컴포넌트에서 사용 가능하도록)
export { USE_MOCK_DATA };

// ========================================
// 1. Mock 데이터 정의
// ========================================

/**
 * AfterCallWorkPage용 Mock 데이터
 */
export const MOCK_AFTER_CALL_WORK_DATA: MockAfterCallWorkData = {
  callInfo: {
    id: 'CS-EMP001-202501051432',
    datetime: '2025-01-05 14:32',
  },
  customerInfo: {
    id: 'CUST-TEDDY-00001',
    name: '김민지',
    phone: '010-2345-6789',
  },
  currentCase: {
    category: '카드분실',
    summary: '고객이 카드 분실 신고 요청. 즉시 카드 사용 정지 처리 완료. 재발급 카드 등록 주소로 배송 예정.',
    aiRecommendation: 'AI 추천 처리: 재발급 신청 완료 및 배송 안내',
  },
  similarCase: {
    category: '카드분실',
    summary: '2024-12-28 처리 사례. 고객 카드 분실 신고 후 재발급 처리. 해외 여행 전 긴급 배송 요청하여 익일 배송으로 ��경 처리.',
  },
  callTranscript: [
    { speaker: 'customer', message: '안녕하세요, 카드를 분실했어요.', timestamp: '14:32' },
    { speaker: 'agent', message: '안녕하세요. 즉시 카드 사용을 정지하겠습니다.', timestamp: '14:33' },
    { speaker: 'customer', message: '빨리 처리해주세요.', timestamp: '14:33' },
    { speaker: 'agent', message: '카드 사용이 정지되었습니다. 재발급 카드는 3-5일 내 배송됩니다.', timestamp: '14:35' },
    { speaker: 'customer', message: '알겠습니다. 감사합니다.', timestamp: '14:37' },
  ],
};

/**
 * ⭐ 다이렉트 콜용 빈 Mock 데이터
 * 대기콜을 선택하지 않고 직접 통화 버튼을 눌렀을 때 사용
 */
export const EMPTY_AFTER_CALL_WORK_DATA: MockAfterCallWorkData = {
  callInfo: {
    id: '',  // pendingConsultation에서 자동 생성
    datetime: '',  // pendingConsultation에서 자동 설정
  },
  customerInfo: {
    id: 'CUST-TEDDY-00000',  // 형식 예시 (DB 스키마 참고용)
    name: '(고객명 미확인)',  // 다이렉트 콜 상태 명시
    phone: '010-0000-0000',  // 형식 예시 (DB 스키마 참고용)
  },
  currentCase: {
    category: '기타',  // 기본 대분류
    summary: '',  // AI가 생성 예정
    aiRecommendation: '',
  },
  similarCase: {
    category: '기타',
    summary: '',
  },
  callTranscript: [],  // ⭐ 빈 배열 (상담 전문 없음)
};

// ========================================
// 2. localStorage 유틸리티
// ========================================

/**
 * localStorage에서 실제 상담 데이터 로드
 */
export function loadPendingConsultation(): PendingConsultation | null {
  try {
    const data = localStorage.getItem('pendingConsultation');
    if (!data) return null;
    return JSON.parse(data) as PendingConsultation;
  } catch (error) {
    console.error('❌ pendingConsultation 로드 실패:', error);
    return null;
  }
}

/**
 * localStorage에서 LLM 분석 결과 로드
 */
export function loadLLMAnalysisResult(): LLMAnalysisResult | null {
  try {
    const data = localStorage.getItem('llmApiResult');
    if (!data) return null;
    return JSON.parse(data) as LLMAnalysisResult;
  } catch (error) {
    console.error('❌ llmApiResult 로드 실패:', error);
    return null;
  }
}

/**
 * localStorage에서 참조 문서 로드
 */
export function loadReferencedDocuments() {
  try {
    const data = localStorage.getItem('referencedDocuments');
    if (!data) return [];
    return JSON.parse(data);
  } catch (error) {
    console.error('❌ referencedDocuments 로드 실패:', error);
    return [];
  }
}

/**
 * localStorage에서 통화 시간 로드
 */
export function loadCallTime(): number {
  try {
    const data = localStorage.getItem('consultationCallTime');
    return data ? parseInt(data, 10) : 0;
  } catch (error) {
    console.error('❌ consultationCallTime 로드 실패:', error);
    return 0;
  }
}

// ========================================
// 3. AfterCallWorkPage 데이터 로더
// ========================================

/**
 * AfterCallWorkPage에서 사용할 데이터 로드
 * Mock/Real 분기 처리
 */
export function loadAfterCallWorkData(): MockAfterCallWorkData {
  // ⭐ 항상 실제 데이터를 먼저 확인 (Mock 모드여도 데이터가 있으면 사용)
  const pending = loadPendingConsultation();
  
  if (USE_MOCK_DATA) {
    console.log('🎭 Mock 데이터 모드');
    
    // ⭐ pending 데이터가 있으면 실제값으로 덮어쓰기
    if (pending) {
      console.log('💡 로컬 데이터 발견: 데이터 덮어쓰기');
      
      // ⭐ 다이렉트 콜 감지 (category가 '일반문의' 또는 빈값)
      const isDirectCall = !pending.category || pending.category === '일반문의';
      
      if (isDirectCall) {
        console.log('📞 다이렉트 콜 감지 → 빈 폼으로 초기화');
        return {
          ...EMPTY_AFTER_CALL_WORK_DATA,
          callInfo: {
            id: pending.consultationId,
            datetime: pending.datetime,
          },
          // ⭐ 고객 정보가 실제로 있으면 채우기 (다이렉트 콜도 고객 DB 조회 가능)
          customerInfo: (pending.customerId && pending.customerId !== 'CUST-TEDDY-00000') ? {
            id: pending.customerId,
            name: pending.customerName,
            phone: pending.customerPhone,
          } : EMPTY_AFTER_CALL_WORK_DATA.customerInfo,
        };
      }
      
      // ⭐ 시나리오 기반 통화 (기존 로직 유지)
      return {
        ...MOCK_AFTER_CALL_WORK_DATA,
        callInfo: {
          id: pending.consultationId,
          datetime: pending.datetime,
        },
        customerInfo: {
          id: pending.customerId,
          name: pending.customerName,
          phone: pending.customerPhone,
        },
        currentCase: {
          ...MOCK_AFTER_CALL_WORK_DATA.currentCase,
          category: pending.category,
        },
      };
    }
    
    return MOCK_AFTER_CALL_WORK_DATA;
  }

  // ✅ Real 데이터 로드 (localStorage → DB에서 온 데이터)
  console.log('🔗 실제 데이터 로드');
  
  // const pending = loadPendingConsultation(); // 상단에서 이미 선언됨
  const llmResult = loadLLMAnalysisResult();
  
  if (!pending) {
    console.warn('⚠️ pendingConsultation이 없습니다. Mock 데이터로 폴백합니다.');
    return MOCK_AFTER_CALL_WORK_DATA;
  }
  
  // ⭐ 다이렉트 콜 감지 (Real 모드)
  const isDirectCall = !pending.category || pending.category === '일반문의';
  
  if (isDirectCall) {
    console.log('📞 [Real] 다이렉트 콜 감지 → 빈 폼으로 초기화');
    return {
      ...EMPTY_AFTER_CALL_WORK_DATA,
      callInfo: {
        id: pending.consultationId,
        datetime: pending.datetime,
      },
      customerInfo: (pending.customerId && pending.customerId !== 'CUST-TEDDY-00000') ? {
        id: pending.customerId,
        name: pending.customerName,
        phone: pending.customerPhone,
      } : EMPTY_AFTER_CALL_WORK_DATA.customerInfo,
      currentCase: {
        category: '기타',
        summary: llmResult?.summary || '',
        aiRecommendation: llmResult?.followUpTasks || '',
      },
    };
  }

  // TODO: DB 스키마 확정 후 매핑 로직 완성
  return {
    callInfo: {
      id: pending.consultationId,         // CS-EMP002-202601211430
      datetime: pending.datetime,
    },
    customerInfo: {
      id: pending.customerId,
      name: pending.customerName,
      phone: pending.customerPhone,
    },
    currentCase: {
      category: pending.category,
      summary: llmResult?.summary || '상담 내용 요약 중...',
      aiRecommendation: llmResult?.followUpTasks || 'AI 분석 중...',
    },
    similarCase: {
      category: pending.category,
      summary: '유사 사례를 검색 중입니다...',  // TODO: API 호출로 유사 사례 조회
    },
    callTranscript: [
      // TODO: STT 전문을 localStorage 또는 API에서 로드
      { speaker: 'customer', message: '통화 내용 로드 중...', timestamp: '00:00' },
    ],
  };
}

// ========================================
// 4. 상담 저장 API
// ========================================

/**
 * 상담 데이터를 DB에 저장
 *
 * ⭐ [v24] 저장 분기 로직:
 * - Mock 모드 (USE_MOCK_DATA = true): Mock 저장 (DB 저장 안함)
 * - Real 모드 (USE_MOCK_DATA = false):
 *   - 교육 모드 (isSimulationMode = true): Mock 저장 (simulation_results는 별도 API에서 처리)
 *   - 대기콜 (isDirectIncoming = false): Mock 저장 (DB 저장 안함, 세션만 초기화)
 *   - 다이렉트콜 + 실전 모드: Real DB 저장 (consultations 테이블)
 *
 * @param data - 저장할 상담 데이터
 * @param isDirectIncoming - 다이렉트콜 여부 (true: 다이렉트콜, false: 대기콜/시나리오)
 * @param isSimulationMode - 교육 모드 여부 (true: 기본교육/우수사례 교육)
 */
export async function saveConsultation(
  data: SaveConsultationRequest,
  isDirectIncoming: boolean = false,
  isSimulationMode: boolean = false
): Promise<ApiResponse> {
  // ⭐ [v24] Mock 저장 조건:
  // 1. Mock 모드
  // 2. Real 모드 + 대기콜
  // 3. Real 모드 + 교육 모드 (기본교육/우수사례 - simulation_results는 별도 API)
  const shouldUseMockSave = USE_MOCK_DATA || !isDirectIncoming || isSimulationMode;

  if (shouldUseMockSave) {
    // Mock 저장: 콘솔 로그 + 짧은 대기 (실제 DB 저장 안 함)
    let reason: string;
    if (USE_MOCK_DATA) {
      reason = 'Mock 모드';
    } else if (isSimulationMode) {
      reason = '교육 모드 (simulation_results는 별도 저장)';
    } else {
      reason = '대기콜 (시나리오 기반)';
    }

    console.log(`🎭 Mock 저장 - ${reason} (consultations DB 저장 안 함):`);
    console.log('📦 저장할 데이터:', data);

    await new Promise(resolve => setTimeout(resolve, 500));

    return {
      success: true,
      message: `Mock 저장 완료 (${reason})`,
      data: { consultationId: data.consultationId },
    };
  }

  // ✅ Real DB 저장: 실전 모드 + 다이렉트콜만 해당
  console.log('🔗 [실전 다이렉트콜] 실제 API 호출: POST /api/v1/consultations');

  // ⭐ [v24] 백엔드 스키마가 Frontend와 동일하므로 변환 불필요
  // Frontend/Backend 공통: { stepNumber, documentId, title, used, viewCount }
  console.log('📦 요청 데이터:', data);

  try {
    const response = await fetch(`${API_BASE_URL}/consultations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      // 422 에러 등의 경우 상세 메시지 출력
      const errorBody = await response.text();
      console.error('❌ API 에러 상세:', errorBody);
      throw new Error(`API 오류: ${response.status} ${response.statusText} - ${errorBody}`);
    }

    const result = await response.json();
    console.log('✅ [실전 다이렉트콜] DB 저장 성공:', result);

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error('❌ 저장 실패:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 오류',
    };
  }
}

// ========================================
// 5. 상담 목록 조회 API
// ========================================

export interface ConsultationItem {
  id: string;
  agent: string;
  agentId?: string;
  customer: string;
  customerId?: string;
  category: string;
  categoryMain?: string;
  categorySub?: string;
  status: string;
  content: string;
  datetime: string;
  duration: string;
  isBestPractice?: boolean;
  isSimulation?: boolean;
  fcr?: boolean;
  memo?: string;
  team?: string;
}

interface ConsultationListResponse {
  success: boolean;
  data: ConsultationItem[];
  total: number;
  message: string;
}

// ⭐ 상담 상세 정보 인터페이스
export interface ConsultationDetail {
  // 기본 정보
  id: string;
  customer_id: string;
  agent_id: string;
  status: string;
  category_main: string;
  category_sub: string;
  title: string;

  // 시간 정보
  call_date: string;
  call_time: string;
  call_end_time?: string;
  call_duration: string;
  acw_duration?: string;

  // 상담 내용
  ai_summary: string;
  agent_notes?: string;
  transcript?: { messages: Array<{ speaker: string; message: string; timestamp: string }> };
  processing_timeline?: Array<{ time: string; action: string; category?: string | null }>;

  // 감정/만족도
  sentiment?: string;
  emotion_score?: number;
  satisfaction_score?: number;
  feedback_text?: string;
  feedback_emotions?: string[];

  // 후속 처리
  follow_up_schedule?: string;
  transfer_department?: string;
  transfer_notes?: string;

  // 참조 문서
  referenced_documents?: Array<{ doc_id: string; doc_type: string; title: string; used: boolean }>;

  // 녹취
  recording_file_path?: string;
  recording_duration?: string;
  recording_file_size?: number;

  // FCR
  fcr?: boolean;
  is_best_practice?: boolean;

  // 고객 정보 (JOIN)
  customer_name: string;
  customer_phone?: string;
  customer_birth_date?: string;
  customer_address?: string;
  customer_type?: string;

  // 상담사 정보 (JOIN)
  agent_name: string;
  agent_team?: string;

  // 시간 정보
  created_at?: string;
  updated_at?: string;
}

interface ConsultationDetailResponse {
  success: boolean;
  data: ConsultationDetail;
  message: string;
}

/**
 * 상담 목록 조회
 *
 * @param options - 필터 옵션
 * @returns 상담 목록
 */
export async function fetchConsultations(options?: {
  limit?: number;
  offset?: number;
  status?: string;
  category?: string;
  agentId?: string;
  dateFrom?: string;
  dateTo?: string;
}): Promise<ConsultationItem[]> {
  // Mock 데이터 import
  const { consultationsData } = await import('@/data/mock');

  if (USE_MOCK_DATA) {
    console.log('[Mock] Fetching consultations:', options);
    return new Promise((resolve) => {
      setTimeout(() => {
        let data = [...consultationsData];

        // 필터 적용
        if (options?.status && options.status !== '전체') {
          data = data.filter(c => c.status === options.status);
        }
        if (options?.category) {
          data = data.filter(c => c.category.includes(options.category));
        }

        // 정렬 (최신순)
        data.sort((a, b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime());

        // 페이지네이션
        const offset = options?.offset || 0;
        const limit = options?.limit || 100;
        data = data.slice(offset, offset + limit);

        resolve(data as ConsultationItem[]);
      }, 300);
    });
  }

  // Real 모드: FastAPI 백엔드 호출
  try {
    console.log('[API] Fetching consultations from backend...');

    const params = new URLSearchParams();
    if (options?.limit) params.append('limit', String(options.limit));
    if (options?.offset) params.append('offset', String(options.offset));
    if (options?.status && options.status !== '전체') params.append('status', options.status);
    if (options?.category) params.append('category', options.category);
    if (options?.agentId) params.append('agent_id', options.agentId);
    if (options?.dateFrom) params.append('date_from', options.dateFrom);
    if (options?.dateTo) params.append('date_to', options.dateTo);

    const response = await fetch(`${API_BASE_URL}/consultations?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('[API Error] Failed to fetch consultations:', response.status);
      // 실패 시 Mock 데이터로 폴백
      return consultationsData as ConsultationItem[];
    }

    const result: ConsultationListResponse = await response.json();
    console.log('[API] Consultations fetched:', result.data.length, '건');
    return result.data;
  } catch (error) {
    console.error('[API Error] fetchConsultations:', error);
    // 에러 시 Mock 데이터로 폴백
    return consultationsData as ConsultationItem[];
  }
}

// ========================================
// 6. 상담 상세 조회 API
// ========================================

/**
 * 상담 상세 조회 (모달용)
 */
export async function fetchConsultationDetail(consultationId: string): Promise<ConsultationDetail | null> {
  if (USE_MOCK_DATA) {
    console.log('[Mock] Fetching consultation detail:', consultationId);
    // Mock에서는 null 반환하여 기존 하드코딩 데이터 사용
    return null;
  }

  try {
    console.log('[API] Fetching consultation detail:', consultationId);
    const response = await fetch(`${API_BASE_URL}/consultations/${consultationId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      console.error('[API Error] Failed to fetch consultation detail:', response.status);
      return null;
    }

    const result: ConsultationDetailResponse = await response.json();
    console.log('[API] Consultation detail fetched:', result.data.id);
    return result.data;
  } catch (error) {
    console.error('[API Error] fetchConsultationDetail:', error);
    return null;
  }
}

// ========================================
// 7. 페이지네이션 지원 상담 목록 조회
// ========================================

interface PaginatedConsultationsResult {
  data: ConsultationItem[];
  total: number;
  hasMore: boolean;
}

/**
 * 페이지네이션 지원 상담 목록 조회
 * - 무한 스크롤에서 사용
 * - total과 hasMore 정보 포함
 */
export async function fetchConsultationsPaginated(options?: {
  limit?: number;
  offset?: number;
  status?: string;
  category?: string;
  agentId?: string;
  dateFrom?: string;
  dateTo?: string;
}): Promise<PaginatedConsultationsResult> {
  const { consultationsData } = await import('@/data/mock');
  const limit = options?.limit || 50;
  const offset = options?.offset || 0;

  if (USE_MOCK_DATA) {
    console.log('[Mock] Fetching consultations paginated:', options);
    return new Promise((resolve) => {
      setTimeout(() => {
        let data = [...consultationsData];

        // 필터 적용
        if (options?.status && options.status !== '전체') {
          data = data.filter(c => c.status === options.status);
        }

        const total = data.length;

        // 정렬 (최신순)
        data.sort((a, b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime());

        // 페이지네이션
        data = data.slice(offset, offset + limit);

        resolve({
          data: data as ConsultationItem[],
          total,
          hasMore: offset + data.length < total,
        });
      }, 300);
    });
  }

  // Real 모드: FastAPI 백엔드 호출
  try {
    console.log('[API] Fetching consultations paginated from backend...');

    const params = new URLSearchParams();
    params.append('limit', String(limit));
    params.append('offset', String(offset));
    if (options?.status && options.status !== '전체') params.append('status', options.status);
    if (options?.category) params.append('category', options.category);
    if (options?.agentId) params.append('agent_id', options.agentId);
    if (options?.dateFrom) params.append('date_from', options.dateFrom);
    if (options?.dateTo) params.append('date_to', options.dateTo);

    const response = await fetch(`${API_BASE_URL}/consultations?${params.toString()}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      console.error('[API Error] Failed to fetch consultations:', response.status);
      return { data: [], total: 0, hasMore: false };
    }

    const result: ConsultationListResponse = await response.json();
    console.log('[API] Consultations fetched:', result.data.length, '/', result.total);

    return {
      data: result.data,
      total: result.total,
      hasMore: offset + result.data.length < result.total,
    };
  } catch (error) {
    console.error('[API Error] fetchConsultationsPaginated:', error);
    return { data: [], total: 0, hasMore: false };
  }
}

// ========================================
// 8. 유사 상담 조회 API (선택)
// ========================================

/**
 * RAG 기반 유사 상담 조회
 * TODO: 백엔드 구현 후 연결
 */
export async function fetchSimilarConsultations(
  category: string,
  query: string
): Promise<ApiResponse> {
  if (USE_MOCK_DATA) {
    console.log('🎭 Mock 유사 상담 조회');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      success: true,
      data: [
        {
          consultationId: 'CS-20241228-1020',
          category,
          summary: '유사 사례 1',
          similarity: 0.92,
        },
      ],
    };
  }

  // ✅ Real: FastAPI + pgvector 조회
  try {
    const response = await fetch('/api/consultations/similar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category, query }),
    });

    const result = await response.json();
    return { success: true, data: result };
  } catch (error) {
    console.error('❌ 유사 상담 조회 실패:', error);
    return { success: false, error: String(error) };
  }
}