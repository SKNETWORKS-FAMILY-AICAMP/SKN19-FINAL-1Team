/**
 * 연령대 기반 생년월일 생성 유틸리티
 */

export function generateBirthDateByAgeGroup(ageGroup: string): string {
  const currentYear = 2025;
  let birthYear: number;

  switch (ageGroup) {
    case '10대':
      birthYear = currentYear - (Math.floor(Math.random() * 10) + 10); // 2015-2005
      break;
    case '20대':
      birthYear = currentYear - (Math.floor(Math.random() * 10) + 20); // 2005-1995
      break;
    case '30대':
      birthYear = currentYear - (Math.floor(Math.random() * 10) + 30); // 1995-1985
      break;
    case '40대':
      birthYear = currentYear - (Math.floor(Math.random() * 10) + 40); // 1985-1975
      break;
    case '50대':
      birthYear = currentYear - (Math.floor(Math.random() * 10) + 50); // 1975-1965
      break;
    case '60대':
      birthYear = currentYear - (Math.floor(Math.random() * 10) + 60); // 1965-1955
      break;
    case '70대':
      birthYear = currentYear - (Math.floor(Math.random() * 10) + 70); // 1955-1945
      break;
    default:
      birthYear = currentYear - 35; // 기본값
  }

  const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
  const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');

  return `${birthYear}-${month}-${day}`;
}

/**
 * 서울시 주요 구 목록
 */
const SEOUL_DISTRICTS = [
  '강남구', '강동구', '강북구', '강서구', '관악구',
  '광진구', '구로구', '금천구', '노원구', '도봉구',
  '동대문구', '동작구', '마포구', '서대문구', '서초구',
  '성동구', '성북구', '송파구', '양천구', '영등포구',
  '용산구', '은평구', '종로구', '중구', '중랑구',
];

/**
 * 랜덤 주소 생성
 */
export function generateRandomAddress(): string {
  const district = SEOUL_DISTRICTS[Math.floor(Math.random() * SEOUL_DISTRICTS.length)];
  const streetNumber = Math.floor(Math.random() * 500) + 1;
  const detailAddress = Math.floor(Math.random() * 20) + 1 + '동 ' + Math.floor(Math.random() * 30) + 1 + '호';
  
  return `서울시 ${district} 테헤란로 ${streetNumber}, ${detailAddress}`;
}
