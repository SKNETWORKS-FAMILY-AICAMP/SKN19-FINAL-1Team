/**
 * 후처리(ACW) Mock 데이터 생성 모듈
 * 
 * 각 시나리오의 STT 대화를 분석하여 AI 상담 요약본과 처리 내역 타임라인을 자동 생성합니다.
 * 
 * @module mockAfterCallWork
 */

import { scenarios, ScenarioSTT } from './scenarios';
import { convertToAbsoluteTime } from '@/utils/timestampUtils';

/**
 * 처리 내역 타임라인 항목
 */
export interface TimelineItem {
  time: string; // HH:MM:SS 형식
  action: string; // 처리 내역 설명
  actor: 'system' | 'agent' | 'customer'; // 주체
}

/**
 * 후처리 데이터 구조
 */
export interface AfterCallWorkData {
  scenarioId: string;
  category: string;
  aiSummary: string; // AI 생성 상담 요약본
  timeline: TimelineItem[]; // 처리 내역 타임라인
  suggestedTitle: string; // 제안 제목
  suggestedCategory: string; // 제안 대분류
  suggestedSubcategory: string; // 제안 중분류
}

/**
 * STT 대화에서 핵심 키워드와 액션을 추출하여 AI 요약본 생성
 */
function generateAISummary(
  sttDialogue: ScenarioSTT[],
  category: string,
  customerName: string
): string {
  // 고객 메시지만 추출
  const customerMessages = sttDialogue
    .filter(msg => msg.speaker === 'customer')
    .map(msg => msg.message);
  
  // 상담사 메시지만 추출
  const agentMessages = sttDialogue
    .filter(msg => msg.speaker === 'agent')
    .map(msg => msg.message);

  // 카테고리별 요약 템플릿
  const summaryTemplates: Record<string, (customer: string, messages: string[]) => string> = {
    '카드분실': (customer, messages) => {
      const hasOverseas = messages.some(m => m.includes('해외') || m.includes('출장') || m.includes('공항'));
      const hasTemporaryCard = messages.some(m => m.includes('임시') || m.includes('라운지'));
      
      return `[고객 요청 사항]
${customer} 고객님께서 카드 분실 신고를 요청하셨습니다.${hasOverseas ? ' 해외 출장이 예정되어 긴급 대응이 필요한 상황입니다.' : ''}

[처리 내용]
1. 본인 확인 절차 완료 (생년월일 확인)
2. 카드 즉시 사용 정지 처리 완료
3. 분실 신고 접수 완료 및 신고 번호 발급
4. 재발급 카드 신청 (등록 주소로 3-5일 내 배송)${hasTemporaryCard ? '\n5. 공항 라운지 임시 카드 발급 신청 완료' : ''}
${hasTemporaryCard ? '6. 인천공항 테디라운지 수령 안내 (출국 당일)' : '5. 자동이체 재등록 안내'}

[고객 안내 사항]
- 분실 신고 번호를 통해 처리 현황 조회 가능
- 부정 사용 모니터링 48시간 진행
- 재발급 카드 수령 후 자동이체 재등록 필요${hasTemporaryCard ? '\n- 공항 라운지 방문 시 신분증 지참 필수' : ''}`;
    },

    '해외결제': (customer, messages) => {
      const country = messages.find(m => m.includes('일본') || m.includes('미국') || m.includes('중국') || m.includes('유럽'))?.match(/(일본|미국|중국|유럽|도쿄|뉴욕|베이징|파리)/)?.[0] || '해외';
      const hasSMS = agentMessages.some(m => m.includes('SMS') || m.includes('알림'));
      
      return `[고객 요청 사항]
${customer} 고객님께서 ${country} 체류 중 카드 결제가 거절되어 긴급 해결을 요청하셨습니다.

[원인 분석]
해외 사용 설정이 만료되어 자동 차단된 상태입니다.

[처리 내용]
1. 본인 확인 절차 완료
2. 현재 위치 확인 (${country})
3. 해외 사용 설정 즉시 재활성화
4. ${country} 사용 승인 완료 (5분 후부터 사용 가능)${hasSMS ? '\n5. SMS 승인 알림 서비스 활성화' : ''}

[고객 안내 사항]
- 재설정 후 약 5분 뒤부터 결제 가능
- 해외 체류 기간 만료 1일 전 SMS 알림 발송${hasSMS ? '\n- 해외 결제 발생 시 실시간 SMS 알림 제공' : ''}
- 귀국 후 자동 차단으로 부정 사용 방지`;
    },

    '수수료문의': (customer, messages) => {
      const feeType = messages.find(m => m.includes('연회비') || m.includes('해외') || m.includes('이자'))?.match(/(연회비|해외.*?수수료|이자)/)?.[0] || '수수료';
      const hasRefund = agentMessages.some(m => m.includes('환급') || m.includes('면제') || m.includes('돌려'));
      
      return `[고객 요청 사항]
${customer} 고객님께서 ${feeType} 관련 문의를 하셨습니다.

[처리 내용]
1. ${feeType} 정책 상세 안내
2. 고객 카드 등급 및 사용 실적 확인
3. 면제 조건 및 혜택 안내${hasRefund ? '\n4. 환급/면제 가능 여부 확인 및 처리' : '\n4. 우대 조건 충족 방법 안내'}

[고객 안내 사항]
- ${feeType} 부과 기준 및 일정 안내
- 면제 조건 충족 시 자동 적용
- 추가 문의사항 발생 시 고객센터 연락 요청`;
    },

    '한도증액': (customer, messages) => {
      const isUrgent = messages.some(m => m.includes('급') || m.includes('빨리') || m.includes('즉시'));
      const hasInstant = agentMessages.some(m => m.includes('즉시') || m.includes('바로'));
      
      return `[고객 요청 사항]
${customer} 고객님께서 신용카드 한도 증액을 요청하셨습니다.${isUrgent ? ' 긴급한 사용 건이 있어 빠른 처리가 필요한 상황입니다.' : ''}

[처리 내용]
1. 고객 신용도 및 사용 실적 확인
2. 한도 증액 가능 여부 심사${hasInstant ? '\n3. 즉시 증액 승인 (임시 한도 상향)' : '\n3. 정식 심사 진행 (1-2영업일 소요)'}
4. 증액 한도 및 적용 시점 안내

[고객 안내 사항]
- ${hasInstant ? '즉시 증액 적용 완료 (승인 후 바로 사용 가능)' : '심사 결과는 1-2영업일 내 SMS로 안내'}
- 증액 승인 시 SMS 및 앱 푸시 알림 발송
- 한도 관리 및 연체 주의사항 안내`;
    },

    '연체문의': (customer, messages) => {
      const hasPayment = agentMessages.some(m => m.includes('납부') || m.includes('결제'));
      const hasInstallment = messages.some(m => m.includes('분할') || m.includes('할부'));
      
      return `[고객 요청 사항]
${customer} 고객님께서 연체 관련 문의 및 해결 방법을 요청하셨습니다.

[처리 내용]
1. 연체 내역 상세 확인
2. 연체 이자 및 연체료 계산
3. 납부 방법 안내 (계좌이체, 가상계좌, 앱 결제)${hasInstallment ? '\n4. 분할 납부 옵션 안내 및 신청' : '\n4. 즉시 납부 안내'}
${hasPayment ? '5. 납부 처리 확인 및 카드 사용 재개 안내' : '5. 연체 해소 시 혜택 복구 안내'}

[고객 안내 사항]
- 연체 해소 후 신용등급 회복 기간 안내
- 향후 연체 방지를 위한 자동이체 설정 권장
- 납부 완료 시 즉시 카드 사용 재개`;
    },

    '기타문의': (customer, messages) => {
      const topic = messages.find(m => m.includes('이용') || m.includes('혜택') || m.includes('서비스'))?.match(/(이용.*?내역|혜택|서비스)/)?.[0] || '카드 사용';
      
      return `[고객 요청 사항]
${customer} 고객님께서 ${topic} 관련 문의를 하셨습니다.

[처리 내용]
1. 고객 문의 사항 정확히 파악
2. 관련 정책 및 이용 가이드 안내
3. 추가 혜택 및 서비스 소개
4. 고객 맞춤 솔루션 제공

[고객 안내 사항]
- 문의하신 내용에 대한 상세 안내 완료
- 추가 문의사항 발생 시 고객센터 연락 요청
- 관련 서비스 이용 방법 안내`;
    },

    '포인트/혜택': (customer, messages) => {
      const isPoint = messages.some(m => m.includes('포인트'));
      const isBenefit = messages.some(m => m.includes('혜택') || m.includes('이벤트') || m.includes('프로모션'));
      
      return `[고객 요청 사항]
${customer} 고객님께서 ${isPoint ? '포인트 적립 및 사용' : '카드 혜택'} 관련 문의를 하셨습니다.

[처리 내용]
1. ${isPoint ? '현재 포인트 적립 내역 확인' : '카드 등급별 혜택 안내'}
2. ${isPoint ? '포인트 사용 가능 가맹점 안내' : '진행 중인 프로모션 안내'}
3. ${isPoint ? '포인트 유효기간 및 소멸 예정 포인트 확인' : '혜택 이용 방법 상세 안내'}
4. ${isBenefit ? '추가 이벤트 및 특별 혜택 안내' : '포인트 최대 적립 방법 제안'}

[고객 안내 사항]
- ${isPoint ? '포인트 사용 시 앱 또는 가맹점에서 즉시 차감' : '혜택 이용 시 사전 등록 필요 여부 확인'}
- ${isPoint ? '포인트 소멸 예정일 30일 전 SMS 알림' : '프로모션 참여 방법 및 기간 안내'}
- 추가 혜택 관련 정보는 앱에서 확인 가능`;
    },

    '부정사용': (customer, messages) => {
      const hasRefund = agentMessages.some(m => m.includes('환급') || m.includes('보상'));
      const hasReport = messages.some(m => m.includes('신고') || m.includes('경찰'));
      
      return `[고객 요청 사항]
${customer} 고객님께서 부정 사용 의심 거래를 신고하셨습니다.

[처리 내용]
1. 의심 거래 내역 상세 확인
2. 고객 본인 사용 여부 확인
3. 카드 즉시 정지 처리
4. 부정 사용 조사 절차 시작${hasRefund ? '\n5. 부정 거래 금액 환급 처리' : '\n5. 조사 결과 안내 예정일 통보'}
${hasReport ? '6. 경찰 신고 접수 지원' : '6. 재발급 카드 신청 안내'}

[고객 안내 사항]
- 부정 사용 조사 기간: 7-14일
- 조사 완료 시 SMS 및 전화 안내
- 부정 거래 확정 시 전액 환급 보장${hasReport ? '\n- 경찰 조사 협조 필요 시 별도 연락' : ''}`;
    }
  };

  // 기본 템플릿
  const defaultTemplate = (customer: string) => {
    return `[고객 요청 사항]
${customer} 고객님께서 ${category} 관련 문의를 하셨습니다.

[처리 내용]
1. 고객 요청 사항 정확히 파악
2. 관련 정책 및 절차 안내
3. 고객 맞춤 솔루션 제공
4. 처리 결과 확인 및 안내

[고객 안내 사항]
- 문의하신 내용에 대한 상세 안내 완료
- 추가 문의사항 발생 시 고객센터 연락 요청`;
  };

  const template = summaryTemplates[category] || defaultTemplate;
  return template(customerName, [...customerMessages, ...agentMessages]);
}

/**
 * STT 대화에서 타임라인 생성
 * 주요 액션을 추출하여 HH:MM:SS 형식의 타임라인 생성
 */
function generateTimeline(
  sttDialogue: ScenarioSTT[],
  category: string,
  callStartTime: string
): TimelineItem[] {
  const timeline: TimelineItem[] = [];

  // 통화 시작
  timeline.push({
    time: convertToAbsoluteTime(callStartTime, 0),
    action: '통화 시작 - 고객 응대 개시',
    actor: 'system'
  });

  // 카테고리별 핵심 액션 매핑
  const actionKeywords: Record<string, { keywords: string[], action: string, actor: 'system' | 'agent' }[]> = {
    '카드분실': [
      { keywords: ['본인', '확인', '생년월일'], action: '본인 확인 절차 완료', actor: 'agent' },
      { keywords: ['정지', '사용정지', '차단'], action: '카드 즉시 사용 정지 처리', actor: 'system' },
      { keywords: ['분실', '신고', '접수'], action: '분실 신고 접수 및 신고번호 발급', actor: 'system' },
      { keywords: ['재발급', '발급'], action: '재발급 카드 신청 완료', actor: 'agent' },
      { keywords: ['공항', '라운지', '임시'], action: '공항 라운지 임시 카드 발급 신청', actor: 'agent' },
      { keywords: ['주소', '배송'], action: '배송 주소 확인 완료', actor: 'agent' },
    ],
    '해외결제': [
      { keywords: ['본인', '확인'], action: '본인 확인 절차 완료', actor: 'agent' },
      { keywords: ['위치', '국가', '일본', '미국'], action: '현재 위치 확인', actor: 'agent' },
      { keywords: ['설정', '활성화', '승인'], action: '해외 사용 설정 재활성화', actor: 'system' },
      { keywords: ['SMS', '알림'], action: 'SMS 승인 알림 서비스 활성화', actor: 'system' },
      { keywords: ['기간', '만료'], action: '사용 기간 설정 완료', actor: 'agent' },
    ],
    '수수료문의': [
      { keywords: ['수수료', '연회비', '정책'], action: '수수료 정책 상세 안내', actor: 'agent' },
      { keywords: ['등급', '실적', '확인'], action: '고객 등급 및 사용 실적 확인', actor: 'agent' },
      { keywords: ['면제', '환급', '조건'], action: '면제 조건 안내 및 처리', actor: 'agent' },
    ],
    '한도증액': [
      { keywords: ['신용', '심사', '확인'], action: '신용도 및 사용 실적 확인', actor: 'system' },
      { keywords: ['증액', '승인', '즉시'], action: '한도 증액 승인 처리', actor: 'system' },
      { keywords: ['한도', '적용'], action: '증액 한도 적용 완료', actor: 'system' },
    ],
    '연체문의': [
      { keywords: ['연체', '내역', '확인'], action: '연체 내역 상세 확인', actor: 'agent' },
      { keywords: ['이자', '연체료', '계산'], action: '연체 이자 및 연체료 계산', actor: 'system' },
      { keywords: ['납부', '결제', '방법'], action: '납부 방법 안내', actor: 'agent' },
      { keywords: ['분할', '할부'], action: '분할 납부 옵션 안내', actor: 'agent' },
    ],
    '기타문의': [
      { keywords: ['이용', '내역', '조회'], action: '이용 내역 조회', actor: 'agent' },
      { keywords: ['정책', '안내'], action: '관련 정책 안내', actor: 'agent' },
      { keywords: ['혜택', '서비스'], action: '추가 혜택 안내', actor: 'agent' },
    ],
    '포인트/혜택': [
      { keywords: ['포인트', '적립', '확인'], action: '포인트 적립 내역 확인', actor: 'agent' },
      { keywords: ['사용', '가맹점'], action: '포인트 사용처 안내', actor: 'agent' },
      { keywords: ['혜택', '이벤트'], action: '진행 중인 프로모션 안내', actor: 'agent' },
      { keywords: ['유효', '소멸'], action: '포인트 유효기간 확인', actor: 'agent' },
    ],
    '부정사용': [
      { keywords: ['의심', '거래', '확인'], action: '의심 거래 내역 확인', actor: 'agent' },
      { keywords: ['정지', '차단'], action: '카드 즉시 정지 처리', actor: 'system' },
      { keywords: ['조사', '신고'], action: '부정 사용 조사 절차 시작', actor: 'system' },
      { keywords: ['환급', '보상'], action: '부정 거래 환급 처리', actor: 'system' },
    ]
  };

  const categoryActions = actionKeywords[category] || actionKeywords['기타문의'];
  const usedActions = new Set<string>();

  // STT 대화에서 액션 추출
  for (const msg of sttDialogue) {
    for (const actionDef of categoryActions) {
      // 이미 사용된 액션은 스킵
      if (usedActions.has(actionDef.action)) continue;

      // 키워드가 메시지에 포함되어 있는지 확인
      const hasKeyword = actionDef.keywords.some(keyword => 
        msg.message.includes(keyword)
      );

      if (hasKeyword) {
        timeline.push({
          time: convertToAbsoluteTime(callStartTime, msg.timestamp),
          action: actionDef.action,
          actor: actionDef.actor
        });
        usedActions.add(actionDef.action);
        break;
      }
    }
  }

  // 통화 종료
  const lastMsg = sttDialogue[sttDialogue.length - 1];
  timeline.push({
    time: convertToAbsoluteTime(callStartTime, lastMsg.timestamp + 2),
    action: '통화 종료 - 상담 완료',
    actor: 'system'
  });

  return timeline;
}

/**
 * 카테고리별 제목/중분류 제안
 */
function suggestCategoryAndTitle(category: string, sttDialogue: ScenarioSTT[]): {
  title: string;
  category: string;
  subcategory: string;
} {
  const customerMessages = sttDialogue
    .filter(msg => msg.speaker === 'customer')
    .map(msg => msg.message)
    .join(' ');

  const suggestions: Record<string, { title: string, category: string, subcategory: string }> = {
    '카드분실': {
      title: customerMessages.includes('해외') || customerMessages.includes('출장') 
        ? '카드 분실 신고 및 공항 임시 카드 발급'
        : '카드 분실 신고 및 재발급',
      category: '분실/도난',
      subcategory: '긴급정지'
    },
    '해외결제': {
      title: '해외 결제 차단 해제 및 사용 설정',
      category: '결제/승인',
      subcategory: '조회/안내'
    },
    '수수료문의': {
      title: customerMessages.includes('연회비') ? '연회비 면제 조건 안내' : '수수료 정책 안내',
      category: '수수료/연체',
      subcategory: '조회/안내'
    },
    '한도증액': {
      title: customerMessages.includes('즉시') || customerMessages.includes('급')
        ? '긴급 한도 증액 신청'
        : '신용한도 증액 신청',
      category: '한도',
      subcategory: '신청/등록'
    },
    '연체문의': {
      title: customerMessages.includes('분할') 
        ? '연체금 분할 납부 신청'
        : '연체 내역 확인 및 납부 안내',
      category: '수수료/연체',
      subcategory: '조회/안내'
    },
    '기타문의': {
      title: '카드 이용 관련 문의',
      category: '이용내역',
      subcategory: '조회/안내'
    },
    '포인트/혜택': {
      title: customerMessages.includes('포인트')
        ? '포인트 적립 및 사용 안내'
        : '카드 혜택 및 프로모션 안내',
      category: '포인트/혜택',
      subcategory: '조회/안내'
    },
    '부정사용': {
      title: '부정 사용 신고 및 조사 신청',
      category: '분실/도난',
      subcategory: '긴급정지'
    }
  };

  return suggestions[category] || suggestions['기타문의'];
}

/**
 * 모든 시나리오의 후처리 데이터 생성
 */
export function generateAllAfterCallWorkData(): Map<string, AfterCallWorkData> {
  const acwDataMap = new Map<string, AfterCallWorkData>();

  for (const scenario of scenarios) {
    const callStartTime = '2025-01-31 14:32'; // 예시 통화 시작 시각
    
    const aiSummary = generateAISummary(
      scenario.sttDialogue,
      scenario.category,
      scenario.customer.name
    );

    const timeline = generateTimeline(
      scenario.sttDialogue,
      scenario.category,
      callStartTime
    );

    const { title, category, subcategory } = suggestCategoryAndTitle(
      scenario.category,
      scenario.sttDialogue
    );

    const acwData: AfterCallWorkData = {
      scenarioId: scenario.id,
      category: scenario.category,
      aiSummary,
      timeline,
      suggestedTitle: title,
      suggestedCategory: category,
      suggestedSubcategory: subcategory
    };

    acwDataMap.set(scenario.id, acwData);
  }

  return acwDataMap;
}

/**
 * 특정 시나리오의 후처리 데이터 조회
 */
export function getAfterCallWorkData(scenarioId: string): AfterCallWorkData | null {
  const allData = generateAllAfterCallWorkData();
  return allData.get(scenarioId) || null;
}

// ⭐ Export: 전체 후처리 데이터 맵 (미리 생성)
export const afterCallWorkDataMap = generateAllAfterCallWorkData();
