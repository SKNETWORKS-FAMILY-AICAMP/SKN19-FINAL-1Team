/**
 * ⭐ Phase A: Mock/Real 데이터 전환 설정
 *
 * localStorage의 'mockMode' 값으로 Mock 데이터와 실제 DB 연결을 전환합니다.
 *
 * - true: Mock 데이터 사용 (현재 Figma Make 개발 환경)
 * - false: 실제 DB 연결 (코드 다운로드 후 로컬/배포 환경)
 */

// ⭐ 개발자 모드: true면 사이드바에 Mock 토글 버튼 표시
export const DEV_MODE = true;

// ⭐ localStorage에서 Mock 모드 읽기 (기본값: false = Real DB)
function getMockModeFromStorage(): boolean {
  if (typeof window === 'undefined') return false;
  const stored = localStorage.getItem('mockMode');
  return stored === 'true';
}

// ⭐ Mock 모드 토글 함수
export function toggleMockMode(): void {
  const current = getMockModeFromStorage();
  localStorage.setItem('mockMode', String(!current));
  window.location.reload(); // 페이지 새로고침으로 전체 적용
}

// ⭐ 현재 Mock 모드 상태
export const USE_MOCK_DATA = getMockModeFromStorage();

/**
 * ⭐ Phase 10-5: 고객 정보 마스킹 on/off 스위치
 *
 * USE_CUSTOMER_MASKING을 true/false로 변경하여 고객 정보 마스킹을 제어합니다.
 *
 * - false: 실명 표시 (현재 기본값, 권한 있는 사용자만 접근)
 * - true: 마스킹 표시 (클릭 시 3초 노출)
 */
export const USE_CUSTOMER_MASKING = false;

/**
 * 개발 가이드:
 *
 * 1. Mock 데이터 모드 (USE_MOCK_DATA = true)
 *    - 화면에 Mock 데이터 표시
 *    - API 호출 시뮬레이션
 *    - 사이드바 하단 토글 버튼으로 전환 가능
 *
 * 2. Real DB 모드 (USE_MOCK_DATA = false)
 *    - FastAPI 백엔드 호출
 *    - PostgreSQL + pgvector 연동
 *
 * ⭐ 테스트 완료 후: DEV_MODE = false 로 변경하면 토글 버튼 숨김
 */
