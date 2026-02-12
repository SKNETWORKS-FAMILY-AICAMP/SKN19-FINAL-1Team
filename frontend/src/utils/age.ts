/**
 * ⭐ Phase 10-5: 생년월일에서 나이 계산 유틸
 */

/**
 * 생년월일(YYYY-MM-DD)에서 만 나이 계산
 * @param birthDate - 생년월일 (예: '1982-05-15')
 * @returns 만 나이 (예: 42)
 */
export function calculateAge(birthDate: string): number {
  if (!birthDate) return 0;

  const birth = new Date(birthDate);
  const today = new Date();

  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  // 생일이 아직 안 지났으면 나이 -1
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
}

/**
 * 생년월일 + 나이 표시 형식
 * @param birthDate - 생년월일 (예: '1982-05-15')
 * @returns '1982-05-15 (42세)'
 */
export function formatBirthDateWithAge(birthDate: string): string {
  if (!birthDate) return '-';
  
  const age = calculateAge(birthDate);
  return `${birthDate} (${age}세)`;
}
