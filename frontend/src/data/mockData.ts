// ==================== 고객 페르소나 타입 데이터 (⭐ Phase 15: 8개 유형) ====================
export const personaTypes = [
  {
    code: 'N1',
    name: '실용주의형',
    description: '빠르고 효율적인 문제 해결을 선호',
    personalityTags: ['practical', 'direct', 'efficient'],
    communicationStyle: { tone: 'direct', speed: 'fast' },
    llmGuidance: '핵심만 간결하게 전달하되, 모든 옵션을 명확히 제시하여 고객이 빠르게 판단할 수 있도록 안내',
    scriptExample: '(간결하고 빠르게) 고객님, 세 가지 방법이 있습니다. 첫째, 즉시 처리 가능한 온라인 신청. 둘째, 방문 신청. 셋째, 전화 처리입니다. 어느 것으로 도와드릴까요?',
    distributionRate: 0.25,
    displayOrder: 1
  },
  {
    code: 'N2',
    name: '친화적 대화형',
    description: '친근하고 공감하는 대화를 선호',
    personalityTags: ['friendly', 'talkative', 'personal'],
    communicationStyle: { tone: 'friendly', speed: 'moderate' },
    llmGuidance: '친근한 톤으로 공감하며 대화하되, 고객의 이야기를 충분히 경청하고 감정을 존중',
    scriptExample: '(친근하고 부드럽게) 고객님~ 정말 불편하셨겠어요. 제가 꼼꼼하게 확인해서 최선의 방법으로 도와드릴게요!',
    distributionRate: 0.2,
    displayOrder: 2
  },
  {
    code: 'N3',
    name: '신중한 보안형',
    description: '신중하고 보안을 중시하며 의심 많음',
    personalityTags: ['cautious', 'security_conscious', 'suspicious'],
    communicationStyle: { tone: 'formal', speed: 'slow' },
    llmGuidance: '보안 절차를 투명하게 설명하고, 고객의 우려를 충분히 이해하며 신뢰를 구축',
    scriptExample: '(차분하고 신중하게) 고객님, 보안을 위해 본인 확인 절차를 거치겠습니다. 모든 과정은 금융감독원 가이드라인을 준수하며, 고객님의 정보는 철저히 보호됩니다.',
    distributionRate: 0.15,
    displayOrder: 3
  },
  {
    code: 'S1',
    name: '빠른 처리 선호형',
    description: '바쁘고 급한 성격',
    personalityTags: ['impatient', 'urgent', 'busy'],
    communicationStyle: { tone: 'direct', speed: 'fast' },
    llmGuidance: '시간을 최소화하고 즉시 해결 가능한 방법을 우선 제시',
    scriptExample: '(빠르고 간결하게) 고객님, 바로 처리해드리겠습니다. 30초만 대기해 주시면 즉시 완료됩니다!',
    distributionRate: 0.15,
    displayOrder: 4
  },
  {
    code: 'S2',
    name: '상세한 설명 요구형',
    description: '꼼꼼하고 상세한 설명을 원함',
    personalityTags: ['detailed', 'analytical', 'thorough'],
    communicationStyle: { tone: 'formal', speed: 'slow' },
    llmGuidance: '모든 단계를 자세히 설명하고, 근거와 이유를 명확히 제시',
    scriptExample: '(천천히 상세하게) 고객님, 이 과정은 세 단계로 진행됩니다. 첫 번째, 본인 확인을 위해 생년월일을 확인합니다. 두 번째, 시스템에서 고객님의 신청 내역을 조회합니다. 세 번째...',
    distributionRate: 0.1,
    displayOrder: 5
  },
  {
    code: 'S3',
    name: '어려움을 겪는 고객',
    description: '설명을 반복 요청, 인내심 필요',
    personalityTags: ['confused', 'needs_repetition', 'patient_required'],
    communicationStyle: { tone: 'patient', speed: 'slow' },
    llmGuidance: '쉬운 용어로 반복 설명하고, 고객의 이해 속도에 맞춰 천천히 안내',
    scriptExample: '(매우 천천히 인내심 있게) 고객님, 천천히 다시 한 번 말씀드릴게요. 먼저 앱을 열어주시고요, 하단의 "더보기" 버튼을 눌러주세요. 보이시나요?',
    distributionRate: 0.07,
    displayOrder: 6
  },
  {
    code: 'S4',
    name: '불만 재문의 고객',
    description: '과거 문제가 미해결되어 재문의',
    personalityTags: ['repeat_caller', 'frustrated', 'unresolved'],
    communicationStyle: { tone: 'solution_focused', speed: 'moderate' },
    llmGuidance: '과거 이력을 먼저 확인하고, 이번에는 확실히 해결하겠다는 의지를 보여줌',
    scriptExample: '(진지하고 해결 중심적으로) 고객님, 이전 상담 내역을 확인했습니다. 이번에는 제가 끝까지 책임지고 확실하게 해결해드리겠습니다.',
    distributionRate: 0.05,
    displayOrder: 7
  },
  {
    code: 'S5',
    name: '불만형',
    description: '화가 나고 불만이 많음',
    personalityTags: ['angry', 'frustrated', 'demanding'],
    communicationStyle: { tone: 'calm_professional', speed: 'moderate' },
    llmGuidance: '고객의 감정을 인정하고 진심으로 사과하며, 즉각적인 해결책을 제시',
    scriptExample: '(최대한 미안해하면서) 고객님, 정말 죄송합니다. 너무 오래 기다리셨고, 불편을 드려 진심으로 사과드립니다. 지금 바로 최우선으로 처리해드리겠습니다.',
    distributionRate: 0.03,
    displayOrder: 8
  }
];

// ==================== 8개 대분류 및 57개 중분류 매핑 ====================
export const categoryMapping = {
  '분실/도난': [
    '도난/분실 신청/해제',
    '긴급 배송 신청',
    '갱신 수령지 변경'
  ],
  '한도': [
    '한도상향 접수/처리',
    '한도 안내',
    '특별한도/임시한도/일시한도 안내/신청'
  ],
  '결제/승인': [
    '선결제/즉시출금',
    '결제대금 안내',
    '승인취소/매출취소 안내',
    '결제계좌 안내/변경',
    '결제일 안내/변경/취소',
    '결제일 안내/변경',
    '매출구분 변경',
    '안심클릭/테디페이/기타페이 안내',
    '결제 대금 안내',
    '승인 취소/매출취소 안내',
    '결제 계좌 안내/변경',
    '안심클릭/테디카드/기타페이 안내',
    '안심클릭/하나페이/기타페이 안내'
  ],
  '이용내역': [
    '이용내역 안내',
    '이용방법 안내',
    '입금내역 안내',
    '신용공여기간 안내'
  ],
  '수수료/연체': [
    '연체대금 즉시출금',
    '일부결제대금이월약정 해지',
    '가상계좌 예약/취소',
    '가상계좌 안내',
    '연체대금 안내',
    '일부결제대금이월약정 안내',
    '연회비 안내',
    '가상 계좌 안내',
    '수기환급 처리',
    '가상 계좌 예약/취소',
    '일부결제 대금이월약정 해지',
    '일부결제 대금이월약정 안내',
    '일부결제대금이월약정 등록',
    '금리인하요구권 안내/신청'
  ],
  '포인트/혜택': [
    '이벤트 안내',
    '오토할부/오토캐쉬백 안내/신청/취소',
    '포인트/마일리지 안내',
    '포인트/마일리지 전환등록',
    '쇼핑케어'
  ],
  '정부지원': [
    '정부지원 바우처 (등유, 임신 등)',
    '교육비',
    '프리미엄 바우처 안내/발급',
    '도시가스',
    '전화요금'
  ],
  '기타': [
    '서비스 이용방법 안내',
    '증명서/확인서 발급',
    '청구지 안내/변경',
    '소득공제 확인서/종합소득세 안내',
    '명세서 재발송',
    '옵션 서비스 안내/변경',
    '단기카드대출 안내/실행',
    '장기카드대출 안내',
    '심사 진행사항 안내',
    '장기카드대출 실행'
  ]
};

// ⭐ 대분류에서 중분류 추출 함수
export const getSubCategories = (mainCategory: string): string[] => {
  return categoryMapping[mainCategory as keyof typeof categoryMapping] || [];
};

// ⭐ 중분류에서 대분류 찾기 함수
export const getMainCategory = (subCategory: string): string => {
  for (const [main, subs] of Object.entries(categoryMapping)) {
    if (subs.includes(subCategory)) {
      return main;
    }
  }
  return '기타';
};

// ==================== 공지사항 데이터 ====================
export const noticesData = [
  { 
    id: 1, 
    tag: '긴급', 
    title: 'KT 화재로 인한 통신망 장애 대응', 
    date: '2025-01-05',
    author: '관리자',
    views: 245,
    pinned: true,
    content: 'KT 아현지사 화재로 인한 통신망 장애가 발생했습니다. 고객 문의 시 다음과 같이 안내해주세요:\n\n1. 현재 일부 지역에서 통신 장애가 발생하고 있습니다.\n2. 복구 작업이 진행 중이며, 예상 복구 시간은 오후 6시입니다.\n3. 긴급한 경우 와이파이를 통한 인터넷 전화를 이용하시기 바랍니다.\n\n고객 불편 최소화를 위해 신속히 대응해주시기 바랍니다.'
  },
  { 
    id: 2, 
    tag: '이벤트', 
    title: '하나카드x메가커피 프로모션 안내', 
    date: '2025-01-05',
    author: '김민수',
    views: 189,
    pinned: true,
    content: '1월 한정 메가커피 프로모션을 안내드립니다.\n\n프로모션 기간: 2025년 1월 1일 ~ 1월 31일\n혜택: 하나카드로 결제 시 메가커피 전 메뉴 50% 할인\n조건: 1일 1회 한정\n\n고객 문의 시 위 내용을 정확히 안내해주시기 바랍니다.'
  },
  { 
    id: 3, 
    tag: '시스템', 
    title: '신규 상담 시스템 업데이트 안내', 
    date: '2025-01-04',
    author: '관리자',
    views: 312,
    pinned: false,
    content: '2025년 1월 15일부터 새로운 상담 시스템이 적용됩니다.\n\n주요 변경 사항:\n1. AI 기반 실시간 상담 지원 기능 추가\n2. 칸반보드 형태의 문서 검색 시스템\n3. 자동 상담 요약 및 후처리 기능\n\n사전 교육은 1월 10일~12일 진행됩니다.'
  },
  { 
    id: 4, 
    tag: '교육', 
    title: '신규 입사자 온보딩 교육 일정', 
    date: '2025-01-03',
    author: '인사팀',
    views: 156,
    pinned: false,
    content: '2025년 1월 신규 입사자 온보딩 교육 일정을 안내드립니다.\n\n일시: 2025년 1월 20일 ~ 1월 24일 (5일간)\n장소: 본사 교육장 (3층)\n대상: 2025년 1월 입사자 전원\n\n참석 필수이며, 불참 시 사전에 인사팀으로 연락 부탁드립니다.'
  },
  { 
    id: 5, 
    tag: '정책', 
    title: '카드 분실 신고 처리 프로세스 변경', 
    date: '2025-01-02',
    author: '운영팀',
    views: 278,
    pinned: false,
    content: '카드 분실 신고 처리 프로세스가 다음과 같이 변경됩니다.\n\n변경 사항:\n1. 본인 확인 절차 강화 (주민번호 뒷자리 → 생년월일 + 휴대폰 인증)\n2. 법인카드 분실 시 담당자 서면 승인 필수\n3. 재발급 수수료 면제 (기존 5,000원)\n\n시행일: 2025년 2월 1일부터'
  },
  { 
    id: 6, 
    tag: '근무', 
    title: '설 연휴 근무 일정 안내', 
    date: '2025-01-02',
    author: '관리팀',
    views: 201,
    pinned: false,
    content: '2025년 설 연휴 근무 일정을 안내드립니다.\n\n연휴 기간: 2025년 1월 28일 ~ 2월 1일 (5일간)\n근무 인원: 각 팀별 2명씩 순환 근무\n\n근무 희망자는 1월 15일까지 팀장님께 신청 부탁드립니다.'
  },
  { 
    id: 7, 
    tag: '복지', 
    title: '직원 건강검진 실시 안내', 
    date: '2024-12-28',
    author: '복지팀',
    views: 189,
    pinned: false,
    content: '2025년 정기 건강검진을 실시합니다.\n\n기간: 2025년 2월 1일 ~ 2월 28일\n장소: 제휴 병원 (강남세브란스, 서울아산병원 등)\n대상: 전 직원\n\n예약은 복지팀으로 연락 주시기 바랍니다.'
  },
  { 
    id: 8, 
    tag: '이벤트', 
    title: '우수 상담사 시상식 개최', 
    date: '2024-12-25',
    author: '관리자',
    views: 245,
    pinned: false,
    content: '2024년 4분기 우수 상담사 시상식을 개최합니다.\n\n일시: 2025년 1월 31일 오후 3시\n장소: 본사 대강당\n수상 대상: FCR 95% 이상 달성자, 고객 만족도 최우수자\n\n많은 참석 부탁드립니다.'
  },
  { 
    id: 9, 
    tag: '시스템', 
    title: '서버 점검으로 인한 일시 중단 안내', 
    date: '2024-12-20',
    author: '기술팀',
    views: 167,
    pinned: false,
    content: '정기 서버 점검으로 인해 시스템이 일시 중단됩니다.\n\n일시: 2025년 1월 10일 오전 2시 ~ 4시\n영향: 상담 시스템, 문서 검색 시스템 일시 중단\n\n점검 시간 동안 상담 불가하오니 양해 부탁드립니다.'
  },
  { 
    id: 10, 
    tag: '교육', 
    title: 'FCR 향상 워크샵 참가 신청', 
    date: '2024-12-18',
    author: '교육팀',
    views: 198,
    pinned: false,
    content: 'FCR 향상을 위한 워크샵을 개최합니다.\n\n일시: 2025년 1월 25일 오후 2시 ~ 5시\n장소: 본사 세미나실\n내용: FCR 향상 기법, 우수 사례 공유, Q&A\n\n참가 희망자는 1월 20일까지 신청 부탁드립니다.'
  },
  { 
    id: 11, 
    tag: '정책', 
    title: '고객 정보 보호 강화 정책 시행', 
    date: '2024-12-15',
    author: '법무팀',
    views: 289,
    pinned: false,
    content: '고객 정보 보호 강화 정책이 시행됩니다.\n\n주요 내용:\n1. 고객 정보 조회 시 2단계 인증 필수\n2. 통화 녹음 파일 보관 기간 단축 (3년 → 1년)\n3. 개인정보 유출 시 즉시 보고 의무화\n\n시행일: 2025년 1월 1일부터'
  },
  { 
    id: 12, 
    tag: '근무', 
    title: '재택근무 확대 시행 안내', 
    date: '2024-12-10',
    author: '인사팀',
    views: 234,
    pinned: false,
    content: '재택근무 제도가 확대 시행됩니다.\n\n변경 사항:\n- 기존: 주 1회 → 변경: 주 2회\n- 신청 방법: 전날 오후 5시까지 팀장 승인\n\n시행일: 2025년 1월 1일부터'
  },
  { 
    id: 13, 
    tag: '복지', 
    title: '사내 카페테리아 메뉴 개편', 
    date: '2024-12-05',
    author: '복지팀',
    views: 145,
    pinned: false,
    content: '사내 카페테리아 메뉴가 개편됩니다.\n\n변경 사항:\n- 건강식 메뉴 추가 (샐러드, 그릭요거트 등)\n- 채식 메뉴 강화\n- 디저트 종류 확대\n\n시행일: 2025년 1월 1일부터'
  },
  { 
    id: 14, 
    tag: '이벤트', 
    title: '연말 송년회 개최 안내', 
    date: '2024-12-01',
    author: '관리팀',
    views: 312,
    pinned: false,
    content: '2024년 연말 송년회를 개최합니다.\n\n일시: 2024년 12월 27일 오후 7시\n장소: 강남 ○○호텔 그랜드볼룸\n드레스코드: 비즈니스 캐주얼\n\n참석 여부는 12월 15일까지 회신 부탁드립니다.'
  },
  { 
    id: 15, 
    tag: '교육', 
    title: 'AI 상담 시스템 활용 교육', 
    date: '2024-11-28',
    author: '교육팀',
    views: 267,
    pinned: false,
    content: 'AI 상담 시스템 활용 교육을 진행합니다.\n\n일시: 2025년 1월 10일 ~ 12일 (3일간)\n시간: 오전 10시 ~ 12시\n대상: 전 상담사\n내용: AI 칸반보드 사용법, AI 어시스턴트 활용법\n\n필수 참석이며, 불참 시 사전 연락 부탁드립니다.'
  }
];

// ==================== 상담 내역 데이터 (⭐ Phase 14: 8개 대분류 - 중분류 구조) ====================
// 카테고리 형식: "대분류 > 중분류" (예: "분실/도난 > 분실신고")
export const consultationsData = [
  { id: 'CS-EMP001-202501051432', agent: '홍길동', customer: '김민수', category: '분실/도난 > 분실신고', status: '완료', content: '카드 분실 신고 접수 및 즉시 정지 처리. 재발급 신청 완료', datetime: '2025-01-05 14:32', duration: '05:12', isBestPractice: true, fcr: true, memo: '카드 분실 신고 및 재발급 처리 완료. 고객 만족도 높음' },
  { id: 'CS-EMP019-202501051315', agent: '이영희', customer: '박철수', category: '결제/승인 > 해외결제', status: '진행중', content: '해외 결제 차단 해제 요청. 본인 확인 및 추가 서류 확인 중', datetime: '2025-01-05 13:15', duration: '07:45', isBestPractice: false, fcr: false, memo: '해외 결제 차단 해제 요청 처리 중. 추가 서류 대기' },
  { id: 'CS-EMP002-202501051205', agent: '김민수', customer: '최영수', category: '수수료/연체 > 연회비문의', status: '완료', content: '연회비 수수료 환불 조건 안내 및 처리 방법 설명', datetime: '2025-01-05 12:05', duration: '04:30', isBestPractice: false, fcr: true, memo: '연회비 수수료 환불 안내 완료' },
  { id: 'CS-EMP001-202501051120', agent: '홍길동', customer: '강민지', category: '분실/도난 > 분실신고', status: '미완료', content: '카드 분실 신고 접수 후 고객 요청으로 보류 상태', datetime: '2025-01-05 11:20', duration: '03:20', isBestPractice: false, fcr: false, memo: '고객 요청으로 보류. 내일 재연락 예정' },
  { id: 'CS-EMP022-202501051045', agent: '김태희', customer: '윤서연', category: '결제/승인 > 해외결제', status: '완료', content: '해외 결제 승인 처리 및 사용 가능 국가 안내', datetime: '2025-01-05 10:45', duration: '06:15', isBestPractice: true, fcr: true, memo: '해외 결제 승인 처리 완료. 우수 상담 사례' },
  { id: 'CS-EMP019-202501050950', agent: '이영희', customer: '정수진', category: '기타 > 일반문의', status: '완료', content: '일반 문의 사항 응대 및 해결', datetime: '2025-01-05 09:50', duration: '05:50', isBestPractice: false, fcr: true, memo: '일반 문의 응대 완료' },
  { id: 'CS-EMP002-202501041650', agent: '김민수', customer: '윤서연', category: '분실/도난 > 카드재발급', status: '완료', content: '카드 재발급 신청 접수 및 배송 주소 확인', datetime: '2025-01-04 16:50', duration: '04:15', isBestPractice: false, fcr: true, memo: '카드 재발급 신청 접수 완료' },
  { id: 'CS-EMP021-202501041520', agent: '강민지', customer: '손흥민', category: '포인트/혜택 > 프로모션', status: '완료', content: '신규 프로모션 혜택 및 참여 방법 상세 안내', datetime: '2025-01-04 15:20', duration: '03:45', isBestPractice: false, fcr: true, memo: '신규 프로모션 상세 안내' },
  { id: 'CS-EMP003-202501041340', agent: '박철수', customer: '이강인', category: '수수료/연체 > 연회비문의', status: '완료', content: '수수료 정책 및 면제 조건 상세 설명', datetime: '2025-01-04 13:40', duration: '05:00', isBestPractice: false, fcr: false, memo: '수수료 정책 상세 설명' },
  { id: 'CS-EMP020-202501041115', agent: '정수진', customer: '박지성', category: '결제/승인 > 해외결제', status: '완료', content: '해외 사용 설정 완료 및 이용 가능 국가 안내', datetime: '2025-01-04 11:15', duration: '04:50', isBestPractice: false, fcr: true, memo: '해외 사용 설정 완료' },
  { id: 'CS-EMP034-202501041020', agent: '최은정', customer: '조현우', category: '포인트/혜택 > 포인트조회', status: '완료', content: '포인트 적립 내역 확인 및 사용 방법 안내', datetime: '2025-01-04 10:20', duration: '03:30', isBestPractice: false, fcr: true, memo: '포인트 적립 및 사용 안내' },
  { id: 'CS-EMP040-202501040935', agent: '문성민', customer: '황희찬', category: '한도 > 한도조회', status: '완료', content: '일시불 한도 조회 및 증액 신청 절차 안내', datetime: '2025-01-04 09:35', duration: '04:10', isBestPractice: false, fcr: true, memo: '일시불 한도 조회 및 증액 안내' },
  { id: 'CS-EMP023-202501031710', agent: '손흥민', customer: '백승호', category: '분실/도난 > 긴급정지', status: '완료', content: '긴급 카드 정지 처리 및 재발급 신청 접수', datetime: '2025-01-03 17:10', duration: '05:20', isBestPractice: false, fcr: true, memo: '긴급 카드 정지 및 재발급 처리' },
  { id: 'CS-EMP036-202501031545', agent: '서지은', customer: '김영권', category: '포인트/혜택 > 이벤트', status: '완료', content: '이벤트 참여 방법 및 혜택 상세 안내', datetime: '2025-01-03 15:45', duration: '03:55', isBestPractice: false, fcr: true, memo: '이벤트 참여 방법 안내' },
  { id: 'CS-EMP026-202501031420', agent: '전지현', customer: '정우영', category: '결제/승인 > 승인오류', status: '진행중', content: '해외 가맹점 결제 오류 원인 조사 중', datetime: '2025-01-03 14:20', duration: '06:30', isBestPractice: false, fcr: false, memo: '해외 가맹점 결제 오류 조사 중' },
  { id: 'CS-EMP008-202501031310', agent: '조현우', customer: '나상호', category: '포인트/혜택 > 포인트사용', status: '완료', content: '적립 포인트 사용 가능 가맹점 및 조건 안내', datetime: '2025-01-03 13:10', duration: '04:22', isBestPractice: false, fcr: true, memo: '적립 포인트 사용 가능 가맹점 안내' },
  { id: 'CS-EMP015-202501031155', agent: '이재성', customer: '김진수', category: '한도 > 한도증액', status: '완료', content: '카드 한도 증액 신청 접수 및 심사 안내', datetime: '2025-01-03 11:55', duration: '03:48', isBestPractice: false, fcr: true, memo: '카드 한도 증액 신청 접수' },
  { id: 'CS-EMP021-202501031030', agent: '강민지', customer: '황인범', category: '수수료/연체 > 수수료환불', status: '완료', content: '해외 사용 수수료 정책 및 면제 조건 설명', datetime: '2025-01-03 10:30', duration: '05:35', isBestPractice: false, fcr: true, memo: '해외 사용 수수료 정책 설명' },
  { id: 'CS-EMP035-202501021725', agent: '정민우', customer: '권경원', category: '기타 > 결제일변경', status: '완료', content: '결제일 변경 요청 처리 및 변경 완료', datetime: '2025-01-02 17:25', duration: '04:05', isBestPractice: false, fcr: true, memo: '결제일 변경 요청 처리 완료' },
  { id: 'CS-EMP037-202501021540', agent: '한동훈', customer: '이영표', category: '포인트/혜택 > 프로모션', status: '완료', content: '신년 이벤트 참여 방법 및 혜택 상세 안내', datetime: '2025-01-02 15:40', duration: '03:28', isBestPractice: false, fcr: true, memo: '신년 이벤트 참여 방법 상세 안내' },
  { id: 'CS-EMP038-202501021435', agent: '안수진', customer: '박서준', category: '분실/도난 > 분실신고', status: '완료', content: '긴급 카드 정지 처리 및 임시 카드 발급 안내', datetime: '2025-01-02 14:35', duration: '05:42', isBestPractice: false, fcr: true, memo: '긴급 카드 정지 및 임시 카드 발급' },
  { id: 'CS-EMP039-202501021320', agent: '배지현', customer: '김수현', category: '결제/승인 > 해외결제', status: '완료', content: '해외 결제 실패 원인 분석 및 해결 방안 제시', datetime: '2025-01-02 13:20', duration: '06:18', isBestPractice: false, fcr: false, memo: '해외 결제 실패 원인 분석 및 해결' },
  { id: 'CS-EMP041-202501021205', agent: '강하늘', customer: '송중기', category: '포인트/혜택 > 포인트조회', status: '완료', content: '포인트 소멸 예정 안내 및 사용 권유', datetime: '2025-01-02 12:05', duration: '04:12', isBestPractice: false, fcr: true, memo: '포인트 소멸 예정 안내 및 사용 권유' },
  { id: 'CS-EMP042-202501021050', agent: '오수아', customer: '이민호', category: '한도 > 한도조회', status: '완료', content: '일시불 한도 확인 및 이용 가능 금액 안내', datetime: '2025-01-02 10:50', duration: '03:55', isBestPractice: false, fcr: true, memo: '일시불 한도 확인 및 안내' },
  { id: 'CS-EMP043-202501020935', agent: '임윤아', customer: '유재석', category: '수수료/연체 > 연체이자', status: '완료', content: '카드 대금 연체 수수료 정책 및 납부 방법 안내', datetime: '2025-01-02 09:35', duration: '05:08', isBestPractice: false, fcr: true, memo: '카드 대금 연체 수수료 안내' },
];

// ==================== 자주 찾는 문의 데이터 ====================
export const frequentInquiriesData = [
  { id: 1, keyword: '카드 분실', question: '카드를 분실했어요. 어떻게 해야 하나요?', count: 45, trend: 'up' as const },
  { id: 2, keyword: '해외 결제', question: '해외에서 카드가 안 됩니다.', count: 38, trend: 'up' as const },
  { id: 3, keyword: '포인트 적립', question: '포인트가 적립 안 됐어요.', count: 32, trend: 'same' as const },
  { id: 4, keyword: '연회비 환불', question: '연회비 환불 받을 수 있나요?', count: 28, trend: 'down' as const },
  { id: 5, keyword: '한도 증액', question: '신용한도를 올리고 싶어요.', count: 25, trend: 'up' as const },
];

// ==================== 사원 데이터 (총 45명: 상담1팀 18명, 상담2팀 15명, 상담3팀 12명) ====================
// 순위 기준: 1) consultations 높은 순, 2) fcr 높은 순, 3) avgTime 빠른 순
export const employeesData = [
  // 🥇 1위: 김민수 (상담1팀) - 145건, FCR 96%, 4:15
  { id: 'EMP-002', name: '김민수', team: '상담1팀', position: '사원', consultations: 145, fcr: 96, avgTime: '4:15', rank: 1, trend: 'up' as const, status: 'active' as const, joinDate: '2024-03-01', email: 'kim@teddycard.com', phone: '010-2345-6789' },
  
  // 🥈 2위: 최은정 (상담3팀) - 140건, FCR 96%, 4:18
  { id: 'EMP-034', name: '최은정', team: '상담3팀', position: '대리', consultations: 140, fcr: 96, avgTime: '4:18', rank: 2, trend: 'up' as const, status: 'active' as const, joinDate: '2023-07-15', email: 'choiej@teddycard.com', phone: '010-2345-6701' },
  
  // 🥉 3위: 이영희 (상담2팀) - 138건, FCR 95%, 4:20
  { id: 'EMP-019', name: '이영희', team: '상담2팀', position: '대리', consultations: 138, fcr: 95, avgTime: '4:20', rank: 3, trend: 'same' as const, status: 'active' as const, joinDate: '2023-11-20', email: 'lee@teddycard.com', phone: '010-3456-7890' },
  
  // 4위: 이영표 (상담1팀) - 135건, FCR 95%, 4:28
  { id: 'EMP-018', name: '이영표', team: '상담1팀', position: '과장', consultations: 135, fcr: 95, avgTime: '4:28', rank: 4, trend: 'up' as const, status: 'active' as const, joinDate: '2023-03-12', email: 'leeyp@teddycard.com', phone: '010-3456-7801' },
  
  // 5위: 강민지 (상담2팀) - 134건, FCR 94%, 4:25
  { id: 'EMP-021', name: '강민지', team: '상담2팀', position: '대리', consultations: 134, fcr: 94, avgTime: '4:25', rank: 5, trend: 'up' as const, status: 'active' as const, joinDate: '2023-09-12', email: 'kang@teddycard.com', phone: '010-7890-1234' },
  
  // 6위: 문성민 (상담3팀) - 133건, FCR 95%, 4:30
  { id: 'EMP-040', name: '문성민', team: '상담3팀', position: '과장', consultations: 133, fcr: 95, avgTime: '4:30', rank: 6, trend: 'up' as const, status: 'active' as const, joinDate: '2023-06-18', email: 'moonsm@teddycard.com', phone: '010-8901-2367' },
  
  // 7위: 손흥민 (상담2팀) - 132건, FCR 93%, 4:35
  { id: 'EMP-023', name: '손흥민', team: '상담2팀', position: '대리', consultations: 132, fcr: 93, avgTime: '4:35', rank: 7, trend: 'up' as const, status: 'active' as const, joinDate: '2023-12-10', email: 'son@teddycard.com', phone: '010-1234-5679' },
  
  // 8위: 서지은 (상담3팀) - 131건, FCR 94%, 4:33
  { id: 'EMP-036', name: '서지은', team: '상담3팀', position: '사원', consultations: 131, fcr: 94, avgTime: '4:33', rank: 8, trend: 'up' as const, status: 'active' as const, joinDate: '2023-12-05', email: 'seoje@teddycard.com', phone: '010-4567-8923' },
  
  // 9위: 조현우 (상담1팀) - 130건, FCR 93%, 4:40
  { id: 'EMP-008', name: '조현우', team: '상담1팀', position: '대리', consultations: 130, fcr: 93, avgTime: '4:40', rank: 9, trend: 'up' as const, status: 'active' as const, joinDate: '2023-10-15', email: 'cho@teddycard.com', phone: '010-3456-7891' },
  
  // 10위: 전지현 (상담2팀) - 129건, FCR 94%, 4:42
  { id: 'EMP-026', name: '전지현', team: '상담2팀', position: '대리', consultations: 129, fcr: 94, avgTime: '4:42', rank: 10, trend: 'up' as const, status: 'active' as const, joinDate: '2023-10-08', email: 'jeon@teddycard.com', phone: '010-4567-8923' },
  
  // 11위: 이재성 (상담1팀) - 128건, FCR 94%, 4:38
  { id: 'EMP-015', name: '이재성', team: '상담1팀', position: '대리', consultations: 128, fcr: 94, avgTime: '4:38', rank: 11, trend: 'up' as const, status: 'active' as const, joinDate: '2023-09-20', email: 'leejs@teddycard.com', phone: '010-0123-4568' },
  
  // 12위: 유진희 (상담3팀) - 128건, FCR 93%, 4:41
  { id: 'EMP-044', name: '유진희', team: '상담3팀', position: '대리', consultations: 128, fcr: 93, avgTime: '4:41', rank: 12, trend: 'up' as const, status: 'active' as const, joinDate: '2023-09-22', email: 'yujh@teddycard.com', phone: '010-2345-6701' },
  
  // 13위: 홍길동 (상담1팀) - 127건, FCR 94%, 4:32
  { id: 'EMP-001', name: '홍길동', team: '상담1팀', position: '대리', consultations: 127, fcr: 94, avgTime: '4:32', rank: 13, trend: 'up' as const, status: 'active' as const, joinDate: '2024-01-15', email: 'hong@teddycard.com', phone: '010-1234-5678' },
  
  // 14위: 한동훈 (상담3팀) - 127건, FCR 93%, 4:44
  { id: 'EMP-037', name: '한동훈', team: '상담3팀', position: '대리', consultations: 127, fcr: 93, avgTime: '4:44', rank: 14, trend: 'same' as const, status: 'active' as const, joinDate: '2023-10-20', email: 'handh@teddycard.com', phone: '010-5678-9034' },
  
  // 15위: 유재석 (상담2팀) - 126건, FCR 93%, 4:46
  { id: 'EMP-029', name: '유재석', team: '상담2팀', position: '대리', consultations: 126, fcr: 93, avgTime: '4:46', rank: 15, trend: 'up' as const, status: 'active' as const, joinDate: '2023-11-25', email: 'yoo@teddycard.com', phone: '010-7890-1256' },
  
  // 16위: 김영권 (상담1팀) - 125건, FCR 93%, 4:45
  { id: 'EMP-011', name: '김영권', team: '상담1팀', position: '대리', consultations: 125, fcr: 93, avgTime: '4:45', rank: 16, trend: 'up' as const, status: 'active' as const, joinDate: '2023-11-05', email: 'kimyk@teddycard.com', phone: '010-6789-0124' },
  
  // 17위: 정수진 (상담2팀) - 125건, FCR 93%, 4:45 (동점이지만 joinDate가 늦음)
  { id: 'EMP-020', name: '정수진', team: '상담2팀', position: '사원', consultations: 125, fcr: 93, avgTime: '4:45', rank: 17, trend: 'up' as const, status: 'vacation' as const, joinDate: '2024-02-15', email: 'jung2@teddycard.com', phone: '010-5678-9012' },
  
  // 18위: 정민우 (상담3팀) - 124건, FCR 92%, 4:47
  { id: 'EMP-035', name: '정민우', team: '상담3팀', position: '사원', consultations: 124, fcr: 92, avgTime: '4:47', rank: 18, trend: 'up' as const, status: 'active' as const, joinDate: '2024-01-25', email: 'jungmw@teddycard.com', phone: '010-3456-7812' },
  
  // 19위: 김수현 (상담2팀) - 123건, FCR 92%, 4:48
  { id: 'EMP-025', name: '김수현', team: '상담2팀', position: '사원', consultations: 123, fcr: 92, avgTime: '4:48', rank: 19, trend: 'up' as const, status: 'active' as const, joinDate: '2024-03-22', email: 'kimsh@teddycard.com', phone: '010-3456-7812' },
  
  // 20위: 강하늘 (상담3팀) - 122건, FCR 92%, 4:49
  { id: 'EMP-041', name: '강하늘', team: '상담3팀', position: '사원', consultations: 122, fcr: 92, avgTime: '4:49', rank: 20, trend: 'up' as const, status: 'active' as const, joinDate: '2024-03-11', email: 'kanghn@teddycard.com', phone: '010-9012-3478' },
  
  // 21위: 김태희 (상담2팀) - 122건, FCR 92%, 4:50
  { id: 'EMP-022', name: '김태희', team: '상담2팀', position: '과장', consultations: 122, fcr: 92, avgTime: '4:50', rank: 21, trend: 'up' as const, status: 'active' as const, joinDate: '2023-08-15', email: 'kimth@teddycard.com', phone: '010-9012-3456' },
  
  // 22위: 김진수 (상담1팀) - 121건, FCR 91%, 4:52
  { id: 'EMP-014', name: '김진수', team: '상담1팀', position: '사원', consultations: 121, fcr: 91, avgTime: '4:52', rank: 22, trend: 'up' as const, status: 'active' as const, joinDate: '2024-01-10', email: 'kimjs@teddycard.com', phone: '010-9012-3457' },
  
  // 23위: 신동엽 (상담2팀) - 120건, FCR 91%, 4:55
  { id: 'EMP-031', name: '신동엽', team: '상담2팀', position: '사원', consultations: 120, fcr: 91, avgTime: '4:55', rank: 23, trend: 'up' as const, status: 'active' as const, joinDate: '2024-03-07', email: 'shin@teddycard.com', phone: '010-9012-3478' },
  
  // 24위: 백승호 (상담1팀) - 119건, FCR 92%, 4:50
  { id: 'EMP-010', name: '백승호', team: '상담1팀', position: '사원', consultations: 119, fcr: 92, avgTime: '4:50', rank: 24, trend: 'up' as const, status: 'active' as const, joinDate: '2024-02-20', email: 'baek@teddycard.com', phone: '010-5678-9013' },
  
  // 25위: 최영수 (상담1팀) - 118건, FCR 91%, 4:55
  { id: 'EMP-004', name: '최영수', team: '상담1팀', position: '사원', consultations: 118, fcr: 91, avgTime: '4:55', rank: 25, trend: 'same' as const, status: 'active' as const, joinDate: '2024-04-01', email: 'choi@teddycard.com', phone: '010-6789-0123' },
  
  // 26위: 안수진 (상담3팀) - 118건, FCR 91%, 4:56
  { id: 'EMP-038', name: '안수진', team: '상담3팀', position: '사원', consultations: 118, fcr: 91, avgTime: '4:56', rank: 26, trend: 'up' as const, status: 'active' as const, joinDate: '2024-02-12', email: 'ansj@teddycard.com', phone: '010-6789-0145' },
  
  // 27위: 박서준 (상담2팀) - 117건, FCR 91%, 4:58
  { id: 'EMP-024', name: '박서준', team: '상담2팀', position: '사원', consultations: 117, fcr: 91, avgTime: '4:58', rank: 27, trend: 'same' as const, status: 'active' as const, joinDate: '2024-01-18', email: 'parksj@teddycard.com', phone: '010-2345-6701' },
  
  // 28위: 오수아 (상담3팀) - 116건, FCR 90%, 5:02
  { id: 'EMP-042', name: '오수아', team: '상담3팀', position: '사원', consultations: 116, fcr: 90, avgTime: '5:02', rank: 28, trend: 'same' as const, status: 'active' as const, joinDate: '2024-01-30', email: 'ohsa@teddycard.com', phone: '010-0123-4589' },
  
  // 29위: 권경원 (상담1팀) - 116건, FCR 90%, 5:08
  { id: 'EMP-017', name: '권경원', team: '상담1팀', position: '사원', consultations: 116, fcr: 90, avgTime: '5:08', rank: 29, trend: 'same' as const, status: 'active' as const, joinDate: '2024-02-28', email: 'kwon@teddycard.com', phone: '010-2345-6790' },
  
  // 30위: 박지성 (상담1팀) - 115건, FCR 91%, 5:05
  { id: 'EMP-006', name: '박지성', team: '상담1팀', position: '사원', consultations: 115, fcr: 91, avgTime: '5:05', rank: 30, trend: 'same' as const, status: 'active' as const, joinDate: '2024-05-20', email: 'parkjs@teddycard.com', phone: '010-0123-4567' },
  
  // 31위: 이수근 (상담2팀) - 115건, FCR 90%, 5:08
  { id: 'EMP-033', name: '이수근', team: '상담2팀', position: '사원', consultations: 115, fcr: 90, avgTime: '5:08', rank: 31, trend: 'same' as const, status: 'active' as const, joinDate: '2024-04-20', email: 'leesg@teddycard.com', phone: '010-1234-5690' },
  
  // 32위: 이민호 (상담2팀) - 114건, FCR 90%, 5:05
  { id: 'EMP-028', name: '이민호', team: '상담2팀', position: '사원', consultations: 114, fcr: 90, avgTime: '5:05', rank: 32, trend: 'same' as const, status: 'active' as const, joinDate: '2024-02-09', email: 'leemh@teddycard.com', phone: '010-6789-0145' },
  
  // 33위: 정우영 (상담1팀) - 113건, FCR 90%, 5:00
  { id: 'EMP-012', name: '정우영', team: '상담1팀', position: '사원', consultations: 113, fcr: 90, avgTime: '5:00', rank: 33, trend: 'same' as const, status: 'active' as const, joinDate: '2024-03-15', email: 'jung@teddycard.com', phone: '010-7890-1235' },
  
  // 34위: 박철수 (상담1팀) - 112건, FCR 92%, 5:10
  { id: 'EMP-003', name: '박철수', team: '상담1팀', position: '과장', consultations: 112, fcr: 92, avgTime: '5:10', rank: 34, trend: 'down' as const, status: 'active' as const, joinDate: '2023-05-10', email: 'park@teddycard.com', phone: '010-4567-8901' },
  
  // 35위: 배지현 (상담3팀) - 112건, FCR 89%, 5:11
  { id: 'EMP-039', name: '배지현', team: '상담3팀', position: '사원', consultations: 112, fcr: 89, avgTime: '5:11', rank: 35, trend: 'down' as const, status: 'active' as const, joinDate: '2024-04-08', email: 'baejh@teddycard.com', phone: '010-7890-1256' },
  
  // 36위: 송중기 (상담2팀) - 111건, FCR 89%, 5:12
  { id: 'EMP-027', name: '송중기', team: '상담2팀', position: '사원', consultations: 111, fcr: 89, avgTime: '5:12', rank: 36, trend: 'down' as const, status: 'active' as const, joinDate: '2024-04-14', email: 'song@teddycard.com', phone: '010-5678-9034' },
  
  // 37위: 김채원 (상담3팀) - 110건, FCR 89%, 5:14
  { id: 'EMP-045', name: '김채원', team: '상담3팀', position: '사원', consultations: 110, fcr: 89, avgTime: '5:14', rank: 37, trend: 'down' as const, status: 'active' as const, joinDate: '2024-06-08', email: 'kimcw@teddycard.com', phone: '010-3456-7812' },
  
  // 38위: 이강인 (상담1팀) - 110건, FCR 89%, 5:15
  { id: 'EMP-007', name: '이강인', team: '상담1팀', position: '사원', consultations: 110, fcr: 89, avgTime: '5:15', rank: 38, trend: 'down' as const, status: 'active' as const, joinDate: '2024-06-01', email: 'leekg@teddycard.com', phone: '010-2345-6780' },
  
  // 39위: 강호동 (상담2팀) - 109건, FCR 88%, 5:22
  { id: 'EMP-030', name: '강호동', team: '상담2팀', position: '사원', consultations: 109, fcr: 88, avgTime: '5:22', rank: 39, trend: 'down' as const, status: 'active' as const, joinDate: '2024-05-30', email: 'kanghd@teddycard.com', phone: '010-8901-2367' },
  
  // 40위: 윤서연 (상담1팀) - 108건, FCR 90%, 5:20
  { id: 'EMP-005', name: '윤서연', team: '상담1팀', position: '사원', consultations: 108, fcr: 90, avgTime: '5:20', rank: 40, trend: 'down' as const, status: 'inactive' as const, joinDate: '2024-01-20', email: 'yoon@teddycard.com', phone: '010-8901-2345' },
  
  // 41위: 임윤아 (상담3팀) - 108건, FCR 88%, 5:20
  { id: 'EMP-043', name: '임윤아', team: '상담3팀', position: '사원', consultations: 108, fcr: 88, avgTime: '5:20', rank: 41, trend: 'down' as const, status: 'active' as const, joinDate: '2024-05-17', email: 'imya@teddycard.com', phone: '010-1234-5690' },
  
  // 42위: 나상호 (상담1팀) - 107건, FCR 89%, 5:18
  { id: 'EMP-013', name: '나상호', team: '상담1팀', position: '사원', consultations: 107, fcr: 89, avgTime: '5:18', rank: 42, trend: 'down' as const, status: 'active' as const, joinDate: '2024-04-25', email: 'na@teddycard.com', phone: '010-8901-2346' },
  
  // 43위: 김희철 (상담2팀) - 106건, FCR 87%, 5:28
  { id: 'EMP-032', name: '김희철', team: '상담2팀', position: '사원', consultations: 106, fcr: 87, avgTime: '5:28', rank: 43, trend: 'down' as const, status: 'active' as const, joinDate: '2024-06-15', email: 'kimhc@teddycard.com', phone: '010-0123-4589' },
  
  // 44위: 황희찬 (상담1팀) - 105건, FCR 88%, 5:25
  { id: 'EMP-009', name: '황희찬', team: '상담1팀', position: '사원', consultations: 105, fcr: 88, avgTime: '5:25', rank: 44, trend: 'down' as const, status: 'active' as const, joinDate: '2024-07-10', email: 'hwang@teddycard.com', phone: '010-4567-8902' },
  
  // 45위: 황인범 (상담1팀) - 102건, FCR 87%, 5:30
  { id: 'EMP-016', name: '황인범', team: '상담1팀', position: '사원', consultations: 102, fcr: 87, avgTime: '5:30', rank: 45, trend: 'down' as const, status: 'active' as const, joinDate: '2024-05-05', email: 'hwangib@teddycard.com', phone: '010-1234-5679' },
  
  // ==================== 🆕 신규 사원 5명 (EMP-046 ~ EMP-050) ====================
  // 46위: 배상준 (상담2팀) - 100건, FCR 87%, 5:32
  { id: 'EMP-046', name: '배상준', team: '상담2팀', position: '사원', consultations: 100, fcr: 87, avgTime: '5:32', rank: 46, trend: 'up' as const, status: 'active' as const, joinDate: '2024-08-01', email: 'baesj@teddycard.com', phone: '010-2468-1357' },
  
  // 47위: 박소희 (상담3팀) - 98건, FCR 86%, 5:35
  { id: 'EMP-047', name: '박소희', team: '상담3팀', position: '사원', consultations: 98, fcr: 86, avgTime: '5:35', rank: 47, trend: 'up' as const, status: 'active' as const, joinDate: '2024-08-15', email: 'parksh@teddycard.com', phone: '010-3579-2468' },
  
  // 48위: 안수이 (상담1팀) - 95건, FCR 85%, 5:38
  { id: 'EMP-048', name: '안수이', team: '상담1팀', position: '사원', consultations: 95, fcr: 85, avgTime: '5:38', rank: 48, trend: 'up' as const, status: 'active' as const, joinDate: '2024-09-01', email: 'ansi@teddycard.com', phone: '010-4680-3579' },
  
  // 49위: 오흥재 (상담2팀) - 92건, FCR 84%, 5:42
  { id: 'EMP-049', name: '오흥재', team: '상담2팀', position: '사원', consultations: 92, fcr: 84, avgTime: '5:42', rank: 49, trend: 'up' as const, status: 'active' as const, joinDate: '2024-09-15', email: 'ohhj@teddycard.com', phone: '010-5791-4680' },
  
  // 50위: 왕혁준 (상담3팀) - 88건, FCR 83%, 5:45
  { id: 'EMP-050', name: '왕혁준', team: '상담3팀', position: '사원', consultations: 88, fcr: 83, avgTime: '5:45', rank: 50, trend: 'up' as const, status: 'active' as const, joinDate: '2024-10-01', email: 'wanghj@teddycard.com', phone: '010-6802-5791' },
];

// ==================== 시뮬레이션 데이터 ====================
export const simulationsData = [
  { id: 1, title: '카드 분실 신고 및 재발급', category: '기본 상담', difficulty: '초급', duration: '5분', icon: 'Target' as const, color: '#34A853' },
  { id: 2, title: '해외 결제 차단 해제 요청', category: '긴급 처리', difficulty: '중급', duration: '7분', icon: 'Shield' as const, color: '#FBBC04' },
  { id: 3, title: '진상 고객 감정 전환 마스터', category: '민원 대응', difficulty: '고급', duration: '12분', icon: 'Users' as const, color: '#EA4335' },
  { id: 4, title: '크로스셀 영업 스킬 실전', category: '영업 스킬', difficulty: '중급', duration: '8분', icon: 'TrendingUp' as const, color: '#0047AB' },
];

// ==================== 시뮬레이션 시나리오 상세 데이터 ====================
export const simulationScenariosData = [
  {
    id: 'SIM-001',
    category: '카드분실',
    title: '카드 분실 신고 및 재발급',
    difficulty: '초급',
    duration: '5분',
    description: '고객의 카드 분실 신고를 접수하고 재발급 절차를 안내하는 시나리오',
    tags: ['카드분실', '재발급', '기본상담'],
    completed: true,
    score: 95,
    locked: false
  },
  {
    id: 'SIM-002',
    category: '해외결제',
    title: '해외 결제 차단 해제 요청',
    difficulty: '중급',
    duration: '7분',
    description: '해외 여행 중 카드 결제가 차단된 고객의 문의를 처리하는 시나리오',
    tags: ['해외결제', '차단해제', '긴급처리'],
    completed: true,
    score: 88,
    locked: false
  },
  {
    id: 'SIM-003',
    category: '수수료문의',
    title: '복잡한 수수료 환불 요청',
    difficulty: '고급',
    duration: '10분',
    description: '여러 건의 수수료 환불을 요청하는 까다로운 고객 응대',
    tags: ['수수료', '환불', '복잡처리'],
    completed: false,
    score: null,
    locked: false
  },
  {
    id: 'SIM-004',
    category: '기타문의',
    title: '진상 고객 감정 전환',
    difficulty: '고급',
    duration: '12분',
    description: '화가 난 고객의 감정을 전환하고 문제를 해결하는 고난이도 시나리오',
    tags: ['감정전환', '진상고객', '위기관리'],
    completed: false,
    score: null,
    locked: true
  },
  {
    id: 'SIM-005',
    category: '포인트/혜택',
    title: '프로모션 크로스셀 실전',
    difficulty: '중급',
    duration: '8분',
    description: '상담 중 적절한 타이밍에 프로모션을 제안하는 영업 스킬 훈련',
    tags: ['크로스셀', '프로모션', '영업'],
    completed: false,
    score: null,
    locked: true
  },
  {
    id: 'SIM-006',
    category: '한도증액',
    title: '다단계 복합 문의 처리',
    difficulty: '고급',
    duration: '15분',
    description: '여러 문제가 얽힌 복잡한 상담을 효율적으로 처리하는 시나리오',
    tags: ['복합문의', '다단계처리', '고급'],
    completed: false,
    score: null,
    locked: true
  },
];

// ==================== 시뮬레이션 최근 시도 기록 ====================
export const recentAttemptsData = [
  { id: 1, scenario: 'SIM-001', title: '카드 분실 신고 및 재발급', score: 95, date: '2025-01-05 14:30', duration: '4분 50초' },
  { id: 2, scenario: 'SIM-002', title: '해외 결제 차단 해제 요청', score: 88, date: '2025-01-04 10:20', duration: '6분 35초' },
  { id: 3, scenario: 'SIM-001', title: '카드 분실 신고 및 재발급', score: 92, date: '2025-01-03 16:10', duration: '5분 10초' },
];

// ==================== 대시보드 통계 데이터 ====================
export const dashboardStatsData = {
  todayCalls: 127,
  completed: 95,
  pending: 12,
  incomplete: 20
};

export const weeklyGoalData = {
  target: 500,
  current: 389,
  percentage: 78
};

export const teamStatsData = [
  { team: 'A팀', calls: 142, fcr: 94, color: '#0047AB' },
  { team: 'B팀', calls: 128, fcr: 89, color: '#34A853' },
  { team: 'C팀', calls: 119, fcr: 91, color: '#FBBC04' },
];

// ==================== 프로필 배지 데이터 ====================
export const badgesData = [
  { id: 1, name: 'FCR 마스터', color: '#FBBC04' },
  { id: 2, name: '스피드 레이서', color: '#0047AB' },
  { id: 3, name: '감정 케어', color: '#34A853' },
  { id: 4, name: '완벽주의자', color: '#9C27B0' },
  { id: 5, name: '시뮬 마니아', color: '#FF6B35' },
];

export const monthlyStatsData = [
  { label: '상담 완료', value: '127건', comparison: '팀 평균 대비 +15%', status: 'good' },
  { label: 'FCR', value: '94%', comparison: '목표: 90%', status: 'good' },
  { label: '평균 통화', value: '4분 32초', comparison: '팀 평균: 5분 10초', status: 'good' },
  { label: '후처리 시간', value: '2분 15초', comparison: '목표: 3분', status: 'good' },
  { label: '감정 전환율', value: '82%', comparison: '목표: 75%', status: 'good' },
];