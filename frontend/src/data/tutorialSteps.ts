import type { TutorialStep } from "@/app/components/tutorial/TutorialGuide";

// ⭐ Phase 1: 대기 중 (통화 시작 전) - 🔥 가이드 모드 전용 버전
export const tutorialStepsPhase1: TutorialStep[] = [
  {
    id: "welcome",
    title: "교육 시뮬레이션 가이드 모드",
    description: `안전한 학습 환경에서 실전과 같은 상담 흐름을 체험해보세요!
이 가이드는 전체 상담 프로세스를 단계별로 안내합니다.

준비되셨으면 "다음"을 눌러 시작하세요!`,
  },
  {
    id: "step-direct-call-info",
    targetId: "call-action-button",
    title: "다이렉트 콜 안내",
    description: `우측 상단 통화 버튼은 "다이렉트 콜"로 실시간 데이터와 연동됩니다.
⚠️ 가이드 모드에서는 아래 대기콜 목록에서 하나를 선택해주세요.
다이렉트 콜은 실제 STT와 백엔드 연동으로 가이드가 제공되지 않습니다`,
    position: "left",
  },
  {
    id: "step-select-case",
    targetId: "waiting-call-list",
    title: "대기콜 선택하기",
    description: `우측 상단의 8개 대기콜 중 하나를 클릭하여 상담을 시작해보세요!
선택하면 해당 카테고리의 시나리오 기반 상담이 시작됩니다.`,
    position: "left",
  },
];

// ⭐ Phase 2: 통화 중
export const tutorialStepsPhase2: TutorialStep[] = [
  {
    id: "phase2-welcome",
    title: "통화가 시작되었습니다!",
    description: `이제 실제 상담 화면의 주요 기능들을 알아보겠습니다.
통화 중 사용할 수 있는 편리한 기능들을 하나씩 살펴볼까요?`,
  },
  {
    id: "step-customer-info",
    targetId: "customer-info-card",
    title: "고객 정보 카드",
    description: `고객의 기본 정보와 최근 상담 이력이 표시됩니다.
과거 문의 내용을 확인하여 맥락을 파악하세요.
고객 특성 태그를 통해 맞춤형 상담 안내 멘트를 제공합니다.`,
    position: "right",
  },
  {
    id: "step-stt",
    targetId: "stt-area",
    title: "실시간 음성 텍스트 (STT)",
    description: `고객과의 대화가 실시간으로 텍스트로 변환됩니다.
중요한 키워드는 자동으로 강조되며 AI가 문의 유형을 분석합니다.`,
    position: "bottom",
  },
  {
    id: "step-keyword",
    targetId: "keyword-area",
    title: "키워드 자동 추출",
    description: `대화에서 추출된 핵심 키워드가 표시됩니다.
고객의 문의 유형과 상황을 빠르게 파악할 수 있습니다.`,
    position: "bottom",
  },
  {
    id: "step-current-cards",
    targetId: "current-cards-area",
    title: "현재 상황 정보 (위 2개)",
    description: `키워드 분석 결과를 바탕으로 현재 고객 상황과 관련된 정보가 자동으로 표시됩니다.
• 상품 정보, 약관, 처리 절차 등
• "자세히 보기"를 클릭해 상세 내용 확인
• 실시간으로 내용이 업데이트됩니다`,
    position: "bottom",
  },
  {
    id: "step-next-cards",
    targetId: "next-cards-area",
    title: "다음 예상 정보 (아래 2개)",
    description: `AI가 상담 흐름을 예측하여 다음 단계에서 필요할 정보를 미리 준비합니다.
• 예: 해지 절차 → 위약금 안내
• 예: 상품 문의 → 관련 프로모션 정보
• 선제적 정보 제공으로 상담 시간 단축`,
    position: "top",
  },
  {
    id: "step-ai-search",
    targetId: "ai-search-area",
    title: "AI 검색 어시스턴트",
    description: `궁금한 내용을 질문하면 AI가 관련 문서를 찾아 답변해줍니다.
업무 메뉴얼, 약관 등을 빠르게 검색할 수 있습니다.`,
    position: "left",
  },
  {
    id: "step-memo",
    targetId: "memo-area",
    title: "상담 메모",
    description: `상담 중 중요한 내용을 메모하세요.
메모는 5초마다 자동 저장되며 통화 종료 후 후처리 페이지에서 활용됩니다.`,
    position: "left",
  },
  {
    id: "step-end-call",
    targetId: "end-call-button",
    title: "통화 종료",
    description: `상담이 완료되면 통화 종료 버튼을 클릭하세요.
자동으로 후처리 페이지로 이동합니다. 지금 통화를 종료해보세요!`,
    position: "left",
  },
];

// ⭐ Phase 3: 후처리 (AfterCallWorkPage용)
export const tutorialStepsPhase3: TutorialStep[] = [
  {
    id: "phase3-welcome",
    title: "후처리 페이지입니다!",
    description: `통화가 종료되고 자동으로 후처리 페이지로 이동했습니다.
AI가 상담 내용을 분석하여 요약본을 생성해줍니다.`,
  },
  {
    id: "step-transcript",
    targetId: "acw-transcript",
    title: "상담 전문",
    description: `통화 중 나눈 대화 내용이 전문으로 저장되어 있습니다.
참고가 필요할 때 언제든 확인할 수 있습니다.`,
    position: "right",
  },
  {
    id: "step-referenced-docs",
    targetId: "acw-docs",
    title: "참조 문서",
    description: `상담 중 "자세히 보기"를 클릭한 문서들이 자동으로 저장됩니다.
불필요한 문서는 제외할 수 있습니다.`,
    position: "right",
  },
  {
    id: "step-acw-document",
    targetId: "acw-document-area",
    title: "상담 후처리 문서",
    description: `AI가 상담 내용을 분석하여 제목, 상태, 분류 카테고리를 자동 생성합니다.
AI 상담 요약본, 후속 일정, 이관 부서 등을 확인하고 수정이 필요한 경우 직접 편집할 수 있습니다.`,
    position: "left",
  },
  {
    id: "step-memo-copy",
    targetId: "acw-memo-area",
    title: "상담 메모 복사",
    description: `통화 중 작성한 메모가 자동으로 저장되어 있습니다.
"복사" 버튼을 누르면 AI 상담 요약본 영역으로 자동 붙여넣기되어 필요한 내용을 추가로 저장할 수 있습니다.`,
    position: "top",
  },
  {
    id: "step-save",
    targetId: "acw-save-button",
    title: "후처리 완료 및 저장",
    description: `AI가 요약하고 분석한 후처리 내용을 확인 후 수정할 부분은 수정하고 문제가 없다면 저장하세요.
단축키 Ctrl + Enter를 통해 빠르게 저장할 수 있습니다.

튜토리얼을 완료하셨습니다! 🎉`,
    position: "top",
  },
];