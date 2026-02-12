/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * CALL:ACT - ACW 데이터: 시나리오7 (정부지원)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * 고객: 김영희 (신규)
 * 인입 케이스: 국민행복카드(임신/출산 바우처) 신규 발급
 * 
 * @version 1.0
 * @since 2025-02-03
 */

import type { ACWData } from './types';
import { CATEGORY_RAW } from '@/data/categoryRaw';

export const acw7Data: ACWData = {
  aiAnalysis: {
    title: '국민행복카드 임신/출산 바우처 신규 발급',
    inboundCategory: '정부지원',
    handledCategories: [
      CATEGORY_RAW.GOVT_VOUCHER,       // 정부 바우처 안내
      CATEGORY_RAW.NEW_CARD_ISSUE,     // 신규 카드 발급
    ],
    subcategory: '신청/등록',
    summary: `임신 중인 고객님께 국민행복카드 신규 발급 및 바우처 지원 안내를 완료했습니다.

[처리 내역]
1. 고객 상황 확인: 임신 중 (단태아)
2. 국민행복카드 안내:
   - 임신/출산 진료비 지원 바우처
   - 지원 금액: 1,000,000원 (단태아 기준)
   - 사용처: 산부인과 진료비, 약제비
   - 사용 기한: 분만 예정일 + 60일
3. 카드 혜택 안내:
   - 연회비 평생 무료
   - 후불 교통카드 기능 추가 가능
   - 전국 대중교통 이용 가능
4. 신청 완료: 교통카드 기능 포함
5. 배송 안내: 영업일 기준 5-7일 (방문 수령 가능)

[고객 요청사항]
- 임신 중 국민행복카드 발급
- 지원 금액 및 사용처 확인
- 교통카드 기능 추가
- 발급 소요 기간 확인

[상담사 조치]
- 임신 축하 인사로 친근한 분위기 조성
- 정부 지원 제도 상세 안내 (단태아 100만원)
- 바우처 사용 기한 명확히 전달 (분만일+60일)
- 연회비 무료 강조
- 교통카드 기능 추가 옵션 제안
- 신청 접수 완료 및 배송 일정 안내

[참고사항]
- 신규 고객 (카드 미보유)
- 정부 지원 제도로 신용 심사 불필요
- 바우처 미사용 금액 자동 소멸
- 출산 후 아동수당 카드로 전환 가능

[메모]`,
    followUpTasks: '카드 발급 완료 후 바우처 사용 가이드 SMS 발송',
    handoffDepartment: '카드발급팀',
    handoffNotes: '국민행복카드 신규 발급. 임신/출산 바우처 100만원 자동 충전. 교통카드 기능 포함.',
  },
  
  processingTimeline: [
    {
      time: '13:20:30',
      action: '고객 본인 확인',
      categoryRaw: null,
    },
    {
      time: '13:21:15',
      action: '임신 상황 확인',
      categoryRaw: CATEGORY_RAW.GOVT_VOUCHER,
    },
    {
      time: '13:22:00',
      action: '바우처 지원 금액 안내',
      categoryRaw: CATEGORY_RAW.GOVT_VOUCHER,
    },
    {
      time: '13:23:30',
      action: '사용처 및 기한 안내',
      categoryRaw: CATEGORY_RAW.GOVT_VOUCHER,
    },
    {
      time: '13:24:45',
      action: '교통카드 기능 추가',
      categoryRaw: CATEGORY_RAW.NEW_CARD_ISSUE,
    },
    {
      time: '13:25:30',
      action: '신규 카드 발급 신청',
      categoryRaw: CATEGORY_RAW.NEW_CARD_ISSUE,
    },
    {
      time: '13:26:15',
      action: '상담 종료 및 확인',
      categoryRaw: null,
    },
  ],
  
  callTranscript: [
    { speaker: 'agent', message: '안녕하세요, 테디카드 상담센터 상담사 이지은입니다. 무엇을 도와드릴까요?', timestamp: '13:20' },
    { speaker: 'customer', message: '안녕하세요, 국민행복카드를 만들려고 하는데요. 임신 중이라서요.', timestamp: '13:21' },
    { speaker: 'agent', message: '네, 축하드립니다! 임신/출산 진료비 지원 바우처 신청이신가요?', timestamp: '13:21' },
    { speaker: 'customer', message: '네 맞아요. 혹시 지원금이 얼마나 되나요?', timestamp: '13:22' },
    { speaker: 'agent', message: '단태아는 100만원, 다태아는 140만원이 지원됩니다. 고객님은 단태아이신가요?', timestamp: '13:22' },
    { speaker: 'customer', message: '네, 단태아예요. 그럼 100만원 받는 거죠?', timestamp: '13:23' },
    { speaker: 'agent', message: '네 맞습니다. 100만원이 바우처로 충전되며, 산부인과 진료비와 약제비로 사용 가능합니다.', timestamp: '13:23' },
    { speaker: 'customer', message: '사용 기간은 언제까지인가요?', timestamp: '13:24' },
    { speaker: 'agent', message: '분만 예정일로부터 60일까지 사용 가능합니다. 미사용 금액은 자동 소멸되니 기간 내 사용하셔야 합니다.', timestamp: '13:24' },
    { speaker: 'customer', message: '아, 그렇군요. 그리고 이 카드 연회비 있나요?', timestamp: '13:25' },
    { speaker: 'agent', message: '아니요, 국민행복카드는 연회비가 전혀 없습니다. 평생 무료로 사용하실 수 있어요.', timestamp: '13:25' },
    { speaker: 'customer', message: '좋네요! 혹시 교통카드 기능도 되나요? 출퇴근할 때 쓰려고요.', timestamp: '13:25' },
    { speaker: 'agent', message: '네, 후불 교통카드 기능을 추가하실 수 있습니다. 신청 시 선택 가능하며, 전국 대중교통에서 사용 가능합니다.', timestamp: '13:26' },
    { speaker: 'customer', message: '그럼 교통카드 기능 넣어서 신청해주세요. 발급은 언제쯤 되나요?', timestamp: '13:26' },
    { speaker: 'agent', message: '네, 알겠습니다. 온라인 신청 후 영업일 기준 5~7일 정도 소요됩니다. 빠른 배송 원하시면 방문 수령도 가능합니다.', timestamp: '13:26' },
  ],
};
