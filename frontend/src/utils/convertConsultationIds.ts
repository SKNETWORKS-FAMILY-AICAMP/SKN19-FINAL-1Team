/**
 * ⭐ Phase 10-5: 상담 ID 형식 변환 유틸리티
 * 
 * 구 형식: CS-20250105-1432
 * 신 형식: CS-EMP002-202501051432
 */

// 이름 → employeeId 매핑 (mockData.ts 참조)
const NAME_TO_EMPLOYEE_ID: Record<string, string> = {
  '홍길동': 'EMP001',
  '김민수': 'EMP002',
  '이영희': 'EMP019',
  '김태희': 'EMP003',
  '강민지': 'EMP021',
  '박철수': 'EMP004',
  '정수진': 'EMP005',
  '최은정': 'EMP034',
  '문성민': 'EMP006',
  '손흥민': 'EMP007',
  '서지은': 'EMP008',
};

/**
 * 구 형식 상담 ID를 신 형식으로 변환
 * 
 * @param oldId - 구 형식 ID (예: 'CS-20250105-1432')
 * @param agentName - 상담사 이름 (예: '김민수')
 * @returns 신 형식 ID (예: 'CS-EMP002-202501051432')
 */
export function convertToNewConsultationId(oldId: string, agentName: string): string {
  // CS-20250105-1432 → ['CS', '20250105', '1432']
  const parts = oldId.split('-');
  
  if (parts.length !== 3) {
    console.warn(`Invalid old ID format: ${oldId}`);
    return oldId;
  }
  
  const prefix = parts[0]; // 'CS'
  const date = parts[1]; // '20250105'
  const time = parts[2]; // '1432'
  
  // 상담사 ID 가져오기
  const employeeId = NAME_TO_EMPLOYEE_ID[agentName] || 'EMP999';
  
  // 신 형식: CS-EMP002-202501051432
  return `${prefix}-${employeeId}-${date}${time}`;
}

/**
 * 대량 변환 헬퍼 (배열 처리)
 */
export function convertConsultationIds<T extends { id: string; agent: string }>(
  consultations: T[]
): T[] {
  return consultations.map(consultation => ({
    ...consultation,
    id: convertToNewConsultationId(consultation.id, consultation.agent),
  }));
}
