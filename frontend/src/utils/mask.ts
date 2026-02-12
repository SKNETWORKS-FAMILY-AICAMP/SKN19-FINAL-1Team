/**
 * ⭐ 고객 개인정보 마스킹 유틸리티
 * 
 * Toss CRM 방식: 
 * - DB에는 실제 데이터 저장
 * - Frontend에서 마스킹 처리
 * - 클릭 시 실명 노출 (3-5초)
 * 
 * Phase 10: 고객 DB 연동 준비
 */

/**
 * 이름 마스킹
 * 
 * @param name - 실제 이름 (예: "김민수")
 * @returns 마스킹된 이름 (예: "김*수")
 * 
 * 규칙:
 * - 2글자: 첫 글자만 표시 (예: "홍길" → "홍*")
 * - 3글자 이상: 첫 글자 + 중간 마스킹 + 마지막 글자 (예: "김민수" → "김*수")
 */
export function maskName(name: string): string {
  if (!name) return '';
  
  if (name.length <= 2) {
    return name[0] + '*';
  }
  
  return name[0] + '*'.repeat(name.length - 2) + name.slice(-1);
}

/**
 * 전화번호 마스킹
 * 
 * @param phone - 실제 전화번호 (예: "010-1234-5678")
 * @returns 마스킹된 전화번호 (예: "010-****-5678")
 * 
 * 규칙:
 * - 하이픈 있는 형식: 중간 번호 마스킹 (010-****-5678)
 * - 하이픈 없는 형식: 중간 4자리 마스킹 (010****5678)
 */
export function maskPhone(phone: string): string {
  if (!phone) return '';
  
  // 하이픈이 있는 경우
  if (phone.includes('-')) {
    const parts = phone.split('-');
    if (parts.length === 3) {
      return `${parts[0]}-****-${parts[2]}`;
    }
    return phone; // 형식이 다를 경우 원본 반환
  }
  
  // 하이픈이 없는 경우 (01012345678)
  if (phone.length === 11) {
    return phone.substring(0, 3) + '****' + phone.substring(7);
  } else if (phone.length === 10) {
    return phone.substring(0, 3) + '****' + phone.substring(6);
  }
  
  return phone; // 형식이 다를 경우 원본 반환
}

/**
 * 카드번호 마스킹
 * 
 * @param cardNumber - 카드번호 (예: "1234-5678-9012-3456" 또는 "3456")
 * @returns 마스킹된 카드번호 (예: "****-****-****-3456")
 * 
 * 규칙:
 * - 전체 번호: 마지막 4자리만 표시
 * - 마지막 4자리만 있는 경우: 앞에 마스킹 추가
 */
export function maskCardNumber(cardNumber: string): string {
  if (!cardNumber) return '';
  
  // 이미 마스킹된 경우 (****로 시작)
  if (cardNumber.startsWith('****') || cardNumber.startsWith('*')) {
    return cardNumber;
  }
  
  // 하이픈이 있는 전체 카드번호 (1234-5678-9012-3456)
  if (cardNumber.includes('-')) {
    const parts = cardNumber.split('-');
    if (parts.length === 4) {
      return `****-****-****-${parts[3]}`;
    }
    return cardNumber;
  }
  
  // 마지막 4자리만 제공된 경우
  if (cardNumber.length === 4) {
    return `****-****-****-${cardNumber}`;
  }
  
  // 하이픈 없는 16자리 (1234567890123456)
  if (cardNumber.length === 16) {
    return `****-****-****-${cardNumber.substring(12)}`;
  }
  
  return cardNumber;
}

/**
 * 마스킹된 카드번호의 마지막 4자리 추출
 * 
 * @param maskedCardNumber - 마스킹된 카드번호
 * @returns 마지막 4자리 (예: "3456")
 */
export function extractLast4Digits(maskedCardNumber: string): string {
  if (!maskedCardNumber) return '';
  
  // 하이픈이 있는 경우
  if (maskedCardNumber.includes('-')) {
    const parts = maskedCardNumber.split('-');
    return parts[parts.length - 1];
  }
  
  // 하이픈이 없는 경우
  return maskedCardNumber.slice(-4);
}

/**
 * 실명 노출 타이머 관리 Hook용 유틸
 * 
 * @param duration - 노출 시간 (밀리초, 기본 3초)
 * @returns Promise (타이머 완료 시 resolve)
 */
export function createUnmaskTimer(duration: number = 3000): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, duration);
  });
}

/**
 * 마스킹 상태 토글 헬퍼
 * 
 * @param originalValue - 원본 값
 * @param isMasked - 현재 마스킹 상태
 * @param maskFunction - 마스킹 함수 (maskName, maskPhone, maskCardNumber 중 선택)
 * @returns 마스킹/언마스킹된 값
 */
export function toggleMask(
  originalValue: string,
  isMasked: boolean,
  maskFunction: (value: string) => string
): string {
  return isMasked ? maskFunction(originalValue) : originalValue;
}
