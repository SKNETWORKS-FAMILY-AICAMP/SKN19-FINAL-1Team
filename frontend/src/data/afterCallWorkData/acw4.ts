/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * CALL:ACT - ACW 데이터: 시나리오4 (결제일 변경)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * 고객: 한지민 (GOLD)
 * 인입 케이스: 이용내역 조회 및 결제일 변경 신청
 * 
 * @version 1.0
 * @since 2025-02-03
 */

import type { ACWData } from './types';
import { CATEGORY_RAW } from '@/data/categoryRaw';

export const acw4Data: ACWData = {
  aiAnalysis: {
    title: '이용내역 조회 및 결제일 변경 신청 처리',
    inboundCategory: '이용내역',
    handledCategories: [
      CATEGORY_RAW.USAGE_INQUIRY,      // 이용내역 조회/안내
      CATEGORY_RAW.PAYMENT_DATE,       // 결제일 변경
    ],
    subcategory: '변경',
    summary: `고객님께서 이용내역을 확인하시고 결제일 변경을 요청하셨습니다.

[처리 내역]
1. 이용내역 조회: 당월 사용 금액 약 500,000원
2. 현재 결제일 확인: 매월 15일
3. 다음 결제 예정일: 2025년 2월 15일
4. 변경 희망일: 매월 27일 (급여일 고려)
5. 결제일 변경 신청 완료: 매월 27일
6. 적용 시점 안내: 다음 달(3월)부터 적용

[고객 요청사항]
- 이용내역 조회
- 결제일을 급여일 이후로 변경 (15일 → 27일)
- 이번 달 결제 일정 확인

[상담사 조치]
- 이용내역 실시간 조회 제공
- 결제일 변경 가능 날짜 안내 (25일, 27일)
- 고객 선택에 따라 27일로 변경 신청 완료
- 변경 적용 시점 명확히 안내 (다음 달부터)
- 이번 달 기존 15일 결제 안내

[참고사항]
- GOLD 등급 고객으로 자동이체 설정 권장
- 결제 알림 SMS 발송 중
- 다음 변경은 3개월 후 가능

[메모]`,
    followUpTasks: '3월 결제일(27일) 정상 처리 여부 모니터링',
    handoffDepartment: '없음',
    handoffNotes: '',
  },
  
  processingTimeline: [
    {
      time: '14:10:20',
      action: '고객 본인 확인',
      categoryRaw: null,
    },
    {
      time: '14:11:00',
      action: '이용내역 조회',
      categoryRaw: CATEGORY_RAW.USAGE_INQUIRY,
    },
    {
      time: '14:11:45',
      action: '현재 결제일 확인',
      categoryRaw: CATEGORY_RAW.PAYMENT_DATE,
    },
    {
      time: '14:12:30',
      action: '변경 가능 날짜 안내',
      categoryRaw: CATEGORY_RAW.PAYMENT_DATE,
    },
    {
      time: '14:13:00',
      action: '결제일 변경 신청 (27일)',
      categoryRaw: CATEGORY_RAW.PAYMENT_DATE,
    },
    {
      time: '14:13:45',
      action: '적용 시점 안내',
      categoryRaw: CATEGORY_RAW.PAYMENT_DATE,
    },
    {
      time: '14:14:30',
      action: '상담 종료 및 확인',
      categoryRaw: null,
    },
  ],
  
  callTranscript: [
    { speaker: 'agent', message: '안녕하세요, 테디카드 상담센터 상담사 강태양입니다. 무엇을 도와드릴까요?', timestamp: '14:10' },
    { speaker: 'customer', message: '안녕하세요, 이번 달 카드 사용 내역을 확인하고 싶어요.', timestamp: '14:10' },
    { speaker: 'agent', message: '이용 내역 조회해드리겠습니다. 현재까지 사용하신 금액은 약 500,000원입니다.', timestamp: '14:11' },
    { speaker: 'customer', message: '다음 결제일이 언제인가요?', timestamp: '14:11' },
    { speaker: 'agent', message: '현재 결제일은 매월 15일입니다. 다음 결제일은 2월 15일이에요.', timestamp: '14:12' },
    { speaker: 'customer', message: '결제일을 변경할 수 있나요? 급여일이 25일이라서요.', timestamp: '14:12' },
    { speaker: 'agent', message: '네, 가능합니다. 25일 또는 27일로 변경 가능한데, 어느 날짜가 좋으실까요?', timestamp: '14:12' },
    { speaker: 'customer', message: '27일로 해주세요.', timestamp: '14:13' },
    { speaker: 'agent', message: '매월 27일로 변경 신청되었습니다. 다음 달부터 적용됩니다.', timestamp: '14:13' },
    { speaker: 'customer', message: '이번 달은 어떻게 되나요?', timestamp: '14:14' },
    { speaker: 'agent', message: '이번 달은 기존 15일에 결제되고, 다음 달부터 27일로 변경됩니다.', timestamp: '14:14' },
    { speaker: 'customer', message: '알겠습니다. 감사합니다.', timestamp: '14:14' },
    { speaker: 'agent', message: '추가 문의사항 있으시면 언제든 연락주세요. 좋은 하루 되세요!', timestamp: '14:14' },
  ],
};
