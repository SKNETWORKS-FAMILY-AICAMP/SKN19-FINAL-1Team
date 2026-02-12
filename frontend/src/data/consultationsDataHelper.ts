// ⭐ Phase 15: category 필드를 categoryMain/categorySub로 변환하는 내부 헬퍼 함수

function parseCategoryToSeparate(category: string): { categoryMain: string; categorySub: string } {
  const parts = category.split(' > ');
  
  if (parts.length === 2) {
    return {
      categoryMain: parts[0].trim(),
      categorySub: parts[1].trim()
    };
  }
  
  // 기본값
  console.warn(`⚠️ 잘못된 카테고리 형식: "${category}". 올바른 형식: "대분류 > 중분류"`);
  return {
    categoryMain: '기타',
    categorySub: '서비스 이용방법 안내'
  };
}

export function combineCategoryFields(categoryMain: string, categorySub: string): string {
  return `${categoryMain} > ${categorySub}`;
}

// ⭐ Phase 15-5: agent 이름으로 team 찾기
const agentTeamMap: Record<string, string> = {
  '홍길동': '상담1팀',
  '김민수': '상담1팀',
  '박철수': '상담1팀',
  '조현우': '상담1팀',
  '이재성': '상담1팀',
  '이영표': '상담1팀',
  '김영권': '상담1팀',
  '정우영': '상담1팀',
  '김진수': '상담1팀',
  '백승호': '상담1팀',
  '최영수': '상담1팀',
  '박지성': '상담1팀',
  '권경원': '상담1팀',
  
  '이영희': '상담2팀',
  '김태희': '상담2팀',
  '강민지': '상담2팀',
  '정수진': '상담2팀',
  '손흥민': '상담2팀',
  '전지현': '상담2팀',
  '김수현': '상담2팀',
  '유재석': '상담2팀',
  '이민호': '상담2팀',
  '이수근': '상담2팀',
  '신동엽': '상담2팀',
  '박서준': '상담2팀',
  '송중기': '상담2팀',
  
  '최은정': '상담3팀',
  '문성민': '상담3팀',
  '서지은': '상담3팀',
  '정민우': '상담3팀',
  '한동훈': '상담3팀',
  '안수진': '상담3팀',
  '배지현': '상담3팀',
  '강하늘': '상담3팀',
  '오수아': '상담3팀',
  '임윤아': '상담3팀',
  '유진희': '상담3팀',
  '김채원': '상담3팀',
};

export function getTeamByAgent(agent: string): string {
  return agentTeamMap[agent] || '상담1팀';
}

// ⭐ Phase 15-5: consultation 데이터에 team, categoryMain, categorySub 추가
export function enrichConsultationData(consultation: any) {
  // ⭐ Phase 16-2: category 필드가 없는 경우 처리
  if (!consultation.category || typeof consultation.category !== 'string') {
    console.error('❌ [enrichConsultationData] category 필드 없음:', consultation);
    return {
      ...consultation,
      team: getTeamByAgent(consultation.agent),
      categoryMain: '기타',
      categorySub: '서비스 이용방법 안내',
    };
  }
  
  const { categoryMain, categorySub } = parseCategoryToSeparate(consultation.category);
  const team = getTeamByAgent(consultation.agent);
  
  return {
    ...consultation,
    team,
    categoryMain,
    categorySub,
  };
}