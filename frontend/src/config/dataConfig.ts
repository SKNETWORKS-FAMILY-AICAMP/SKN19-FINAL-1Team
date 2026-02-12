/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * CALL:ACT - 통합 데이터 관리 설정 (Orchestrator Config)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * 모든 Mock 데이터를 한번에 on/off 하거나 개별 제어 가능
 * 
 * - MASTER_MOCK_SWITCH: 전체 Mock/DB 전환 마스터 스위치
 * - 개별 Feature Flag: 모듈별 세부 제어
 * 
 * @version 1.0
 * @since 2025-02-03
 */

export interface DataSourceConfig {
  useMock: boolean;           // true = Mock, false = DB
  enabled: boolean;           // 기능 활성화 여부
  description: string;        // 설명
}

export interface DataConfigSchema {
  // ========== 마스터 스위치 ==========
  MASTER_MOCK_SWITCH: boolean;
  
  // ========== DB 연동 대상 (MVP 이후) ==========
  employees: DataSourceConfig;
  consultations: DataSourceConfig;
  notices: DataSourceConfig;
  frequentInquiries: DataSourceConfig;
  frequentInquiriesDetail: DataSourceConfig;
  simulations: DataSourceConfig;
  search: DataSourceConfig;
  
  // ========== MVP 예외 항목 (나중에 DB 연동 가능하도록 구조 준비) ==========
  scenarios: DataSourceConfig;         // 대기콜 8개 시나리오 (STT 포함)
  customer: DataSourceConfig;          // 고객 정보 (시나리오 연결)
  afterCallWork: DataSourceConfig;     // 후처리 데이터 (시나리오 연결)
  
  // ========== 비즈니스 로직 (항상 유지) ==========
  personas: DataSourceConfig;          // 고객 페르소나 8개 유형
  categoryMapping: DataSourceConfig;   // 8개 대분류 & 57개 중분류
  
  // ========== UI 설정 ==========
  USE_CUSTOMER_MASKING: boolean;
}

/**
 * ⭐ 기본 설정: 전체 Mock ON
 * 
 * DB 연동 시 MASTER_MOCK_SWITCH만 false로 변경하면
 * 모든 데이터가 DB 연동으로 전환됩니다 (예외 항목 제외)
 */
export const DATA_CONFIG: DataConfigSchema = {
  // ========== 마스터 스위치 ==========
  MASTER_MOCK_SWITCH: true,  // ⭐ true = 전체 Mock, false = 전체 DB
  
  // ========== DB 연동 대상 ==========
  employees: {
    useMock: true,
    enabled: true,
    description: '사원 데이터 (45명: 상담1팀 18명, 상담2팀 15명, 상담3팀 12명)',
  },
  
  consultations: {
    useMock: true,
    enabled: true,
    description: '상담 이력 데이터 (8개 대분류 - 중분류 구조)',
  },
  
  notices: {
    useMock: true,
    enabled: true,
    description: '공지사항 (15개)',
  },
  
  frequentInquiries: {
    useMock: true,
    enabled: true,
    description: '자주 찾는 문의 (5개)',
  },
  
  frequentInquiriesDetail: {
    useMock: true,
    enabled: true,
    description: '자주 찾는 문의 상세 데이터',
  },
  
  simulations: {
    useMock: true,
    enabled: true,
    description: '시뮬레이션 데이터 (4개)',
  },
  
  search: {
    useMock: true,
    enabled: true,
    description: '검색 레이어 결과 (AI 검색 어시스턴트)',
  },
  
  // ========== MVP 예외 항목 ==========
  scenarios: {
    useMock: true,      // ⭐ MVP에서는 항상 true, 나중에 off 가능
    enabled: true,
    description: '대기콜 8개 시나리오 (분실/도난, 한도, 결제/승인, 이용내역, 수수료/연체, 포인트/혜택, 정부지원, 기타) + STT 데이터',
  },
  
  customer: {
    useMock: true,      // ⭐ MVP에서는 항상 true, 나중에 off 가능
    enabled: true,
    description: '고객 DB (12개 페르소나, 시나리오 연결)',
  },
  
  afterCallWork: {
    useMock: true,      // ⭐ MVP에서는 항상 true, 나중에 off 가능
    enabled: true,
    description: '후처리 데이터 (ACW 8개, 시나리오 연결)',
  },
  
  // ========== 비즈니스 로직 ==========
  personas: {
    useMock: true,      // ⭐ 항상 true 고정
    enabled: true,
    description: '고객 페르소나 8개 유형 (비즈니스 로직)',
  },
  
  categoryMapping: {
    useMock: true,      // ⭐ 항상 true 고정
    enabled: true,
    description: '8개 대분류 & 57개 중분류 매핑 (비즈니스 로직)',
  },
  
  // ========== UI 설정 ==========
  USE_CUSTOMER_MASKING: false,
};

/**
 * ⭐ 헬퍼 함수: Mock 사용 여부 확인
 * 
 * @param feature - 확인할 기능 이름
 * @returns true = Mock 사용, false = DB 사용
 * 
 * @example
 * if (shouldUseMock('employees')) {
 *   return employeesDataMock;
 * } else {
 *   return await fetchEmployeesFromDB();
 * }
 */
export const shouldUseMock = (
  feature: keyof Omit<DataConfigSchema, 'MASTER_MOCK_SWITCH' | 'USE_CUSTOMER_MASKING'>
): boolean => {
  // 비즈니스 로직은 항상 Mock 유지
  const alwaysMock = ['personas', 'categoryMapping'];
  if (alwaysMock.includes(feature)) {
    return true;
  }
  
  // 마스터 스위치 OFF면 무조건 DB (단, MVP 예외 항목 제외)
  const mvpExceptions = ['scenarios', 'customer', 'afterCallWork'];
  
  if (!DATA_CONFIG.MASTER_MOCK_SWITCH && !mvpExceptions.includes(feature)) {
    return false;  // 마스터 OFF면 DB 사용
  }
  
  // 개별 설정 따름
  return DATA_CONFIG[feature].useMock && DATA_CONFIG[feature].enabled;
};

/**
 * ⭐ 사용 가이드
 * 
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 시나리오 1: 전체 Mock 모드 (현재 개발 환경)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * MASTER_MOCK_SWITCH = true
 * 
 * → 모든 데이터 Mock 사용
 * 
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 시나리오 2: 전체 DB 모드 (배포 환경)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * MASTER_MOCK_SWITCH = false
 * 
 * → 모든 데이터 DB 사용
 *   (단, scenarios/customer/afterCallWork는 MVP에서는 Mock 유지)
 * 
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 시나리오 3: 혼합 모드 (부분 DB 연동 테스트)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * MASTER_MOCK_SWITCH = true  // 기본은 Mock
 * 
 * employees: {
 *   useMock: false,  // ⭐ employees만 DB 연동
 *   enabled: true,
 * }
 * 
 * consultations: {
 *   useMock: true,   // ⭐ 나머지는 Mock 유지
 *   enabled: true,
 * }
 * 
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * MVP 이후: scenarios/customer/afterCallWork DB 연동
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * scenarios: {
 *   useMock: false,  // ⭐ DB 연동으로 전환
 *   enabled: true,
 * }
 * 
 * customer: {
 *   useMock: false,
 *   enabled: true,
 * }
 * 
 * afterCallWork: {
 *   useMock: false,
 *   enabled: true,
 * }
 */
