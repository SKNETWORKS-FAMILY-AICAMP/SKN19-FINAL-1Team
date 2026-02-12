/**
 * 상담 ID 생성 유틸리티
 * 형식: CS-[employeeId(대시제거)]-[YYYYMMDDHHMM]
 * 예시: CS-EMP002-202601211430
 */

export function generateConsultationId(employeeId: string): string {
  // 1. employeeId 검증
  if (!employeeId || !employeeId.match(/^(EMP|ADMIN)-\d{3}$/)) {
    throw new Error(`Invalid employeeId format: ${employeeId}`);
  }
  
  // 2. 대시 제거 (EMP-002 → EMP002, ADMIN-001 → ADMIN001)
  const cleanId = employeeId.replace(/-/g, '');
  
  // 3. 현재 시간 (YYYYMMDDHHMM 형식)
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hour = String(now.getHours()).padStart(2, '0');
  const minute = String(now.getMinutes()).padStart(2, '0');
  const timestamp = `${year}${month}${day}${hour}${minute}`;
  
  // 4. 상담 ID 생성: CS-EMP002-202601211430
  return `CS-${cleanId}-${timestamp}`;
}

/**
 * 상담 ID 검증 (선택적 사용)
 */
export function validateConsultationId(consultationId: string): boolean {
  // 형식: CS-[EMP/ADMIN][숫자3자리]-[YYYYMMDDHHMM]
  const regex = /^CS-(EMP|ADMIN)\d{3}-\d{12}$/;
  return regex.test(consultationId);
}
