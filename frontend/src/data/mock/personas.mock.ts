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
