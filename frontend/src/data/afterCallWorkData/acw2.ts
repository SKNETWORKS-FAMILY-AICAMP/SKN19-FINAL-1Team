/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * CALL:ACT - ACW 데이터: 시나리오2 (한도증액)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * 고객: 최우식 (PREMIUM)
 * 인입 케이스: 신용카드 한도 증액 신청
 * 
 * @version 1.0
 * @since 2025-02-03
 */

import type { ACWData } from './types';
import { CATEGORY_RAW } from '@/data/categoryRaw';

export const acw2Data: ACWData = {
  aiAnalysis: {
    title: '신용카드 한도 증액 신청 및 심사 처리',
    inboundCategory: '한도',
    handledCategories: [
      CATEGORY_RAW.LIMIT_INQUIRY,      // 한도 조회/안내
      CATEGORY_RAW.LIMIT_INCREASE,     // 한도 증액 신청
    ],
    subcategory: '상향/증액',
    summary: `고객님께서 신용카드 한도 증액을 요청하셨습니다.

[처리 내역]
1. 현재 한도 확인: 5,000,000원 (사용 가능: 3,200,000원)
2. 증액 희망 금액: 10,000,000원
3. 신용 평가 진행 (자동 심사)
4. 심사 결과: 7,000,000원까지 즉시 증액 가능
5. 고객 동의 후 7,000,000원으로 한도 증액 완료
6. 증액 효력: 즉시 발생

[고객 요청사항]
- 한도 증액 신청 (500만원 → 1000만원)
- 신속 처리 희망

[상담사 조치]
- 신용 평가 자동 심사 진행
- 700만원까지 즉시 증액 가능 안내
- 1000만원 증액은 추가 서류 제출 후 재심사 필요 안내
- 고객 동의 하에 700만원으로 증액 완료

[참고사항]
- PREMIUM 등급 고객으로 우수 신용 관리 이력 확인
- 1000만원 증액 희망 시 소득증빙 서류 제출 필요
- 재심사 소요 기간: 영업일 기준 3-5일

[메모]`,
    followUpTasks: '1000만원 증액 재신청 시 필요 서류 안내 SMS 발송',
    handoffDepartment: '없음',
    handoffNotes: '',
  },
  
  processingTimeline: [
    {
      time: '10:15:30',
      action: '고객 본인 확인',
      categoryRaw: null,
    },
    {
      time: '10:16:00',
      action: '현재 한도 조회',
      categoryRaw: CATEGORY_RAW.LIMIT_INQUIRY,
    },
    {
      time: '10:16:45',
      action: '증액 신청 접수',
      categoryRaw: CATEGORY_RAW.LIMIT_INCREASE,
    },
    {
      time: '10:17:20',
      action: '자동 신용 평가 진행',
      categoryRaw: CATEGORY_RAW.LIMIT_INCREASE,
    },
    {
      time: '10:18:00',
      action: '심사 결과 안내 (700만원)',
      categoryRaw: CATEGORY_RAW.LIMIT_INCREASE,
    },
    {
      time: '10:18:30',
      action: '한도 증액 처리 완료',
      categoryRaw: CATEGORY_RAW.LIMIT_INCREASE,
    },
    {
      time: '10:19:00',
      action: '상담 종료 및 확인',
      categoryRaw: null,
    },
  ],
  
  callTranscript: [
    { speaker: 'agent', message: '안녕하세요, 테디카드 상담센터 상담사 최민아입니다. 무엇을 도와드릴까요?', timestamp: '10:15' },
    { speaker: 'customer', message: '안녕하세요, 한도를 올리고 싶은데요.', timestamp: '10:15' },
    { speaker: 'agent', message: '현재 한도와 증액 희망 금액을 확인해보겠습니다.', timestamp: '10:16' },
    { speaker: 'customer', message: '지금 500만원인데, 1000만원으로 올리고 싶어요.', timestamp: '10:16' },
    { speaker: 'agent', message: '신용 평가를 진행한 후 증액 가능 여부를 안내드리겠습니다.', timestamp: '10:17' },
    { speaker: 'customer', message: '네, 알겠습니다.', timestamp: '10:17' },
    { speaker: 'agent', message: '심사 결과 700만원까지 즉시 증액 가능합니다. 1000만원은 서류 제출 후 재심사가 필요합니다.', timestamp: '10:18' },
    { speaker: 'customer', message: '그럼 일단 700만원으로 해주세요.', timestamp: '10:18' },
    { speaker: 'agent', message: '한도 증액이 완료되었습니다. 즉시 사용 가능합니다.', timestamp: '10:18' },
    { speaker: 'customer', message: '감사합니다.', timestamp: '10:19' },
    { speaker: 'agent', message: '추가 문의사항 있으시면 언제든 연락주세요. 좋은 하루 되세요!', timestamp: '10:19' },
  ],
};
