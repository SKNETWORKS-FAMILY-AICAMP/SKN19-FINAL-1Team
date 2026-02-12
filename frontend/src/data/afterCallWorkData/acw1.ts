/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * CALL:ACT - ACW 데이터: 시나리오1 (카드 분실)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * 고객: 김민지 (VIP)
 * 인입 케이스: 카드 분실 신고 및 임시 카드 발급
 * 
 * @version 1.0
 * @since 2025-02-02
 */

import type { ACWData } from './types';
import { CATEGORY_RAW } from '@/data/categoryRaw';

export const acw1Data: ACWData = {
  aiAnalysis: {
    title: '카드 분실 신고 및 임시 카드 발급 처리',
    inboundCategory: '분실/도난',
    handledCategories: [
      CATEGORY_RAW.LOSS_THEFT,        // 도난/분실 신청/해제
      CATEGORY_RAW.URGENT_DELIVERY,   // 긴급 배송 신청
    ],
    subcategory: '신청/등록',
    summary: `고객님께서 카드 분실 신고 및 임시 카드 발급을 요청하셨습니다.

[처리 내역]
1. 카드 사용 즉시 정지 처리 완료 (14:33)
2. 분실 신고 접수 완료 (신고번호: LOSS-2025-00123)
3. 임시 카드 발급 신청 완료 (공항 라운지 수령)
4. 배송 정보: 인천공항 제1터미널 3층 테디라운지
5. 출국 일정: 2025년 2월 10일 (월) 오전 10시
6. VIP 고객으로 우선 처리 완료

[고객 요청사항]
- 긴급 재발급 요청 (해외 출장 예정)
- 임시 카드 공항 라운지 수령 희망
- VIP 우대 서비스 제공

[상담사 조치]
- VIP 우대 서비스로 임시 카드 발급 처리
- 공항 라운지 수령 안내 완료
- 재발급 카드는 등록 주소로 3-5일 내 배송 예정

[메모]`,
    followUpTasks: '출국일 전일 SMS 발송 확인 필요',
    handoffDepartment: '카드발급팀',
    handoffNotes: 'VIP 고객 임시 카드 발급 건. 공항 라운지 수령 예정. 출국 일정: 2025-02-10 (월) 10:00',
  },
  
  processingTimeline: [
    {
      time: '14:32:15',
      action: '고객 본인 확인',
      categoryRaw: null,
    },
    {
      time: '14:33:20',
      action: '카드 사용 즉시 정지',
      categoryRaw: CATEGORY_RAW.LOSS_THEFT,
    },
    {
      time: '14:33:45',
      action: '분실 신고 접수',
      categoryRaw: CATEGORY_RAW.LOSS_THEFT,
    },
    {
      time: '14:35:10',
      action: '임시 카드 발급 신청',
      categoryRaw: CATEGORY_RAW.URGENT_DELIVERY,
    },
    {
      time: '14:36:30',
      action: '공항 라운지 수령 안내',
      categoryRaw: CATEGORY_RAW.URGENT_DELIVERY,
    },
    {
      time: '14:37:00',
      action: '상담 종료 및 확인',
      categoryRaw: null,
    },
  ],
  
  callTranscript: [
    { speaker: 'agent', message: '안녕하세요, 테디카드 상담센터 상담사 김현우입니다. 무엇을 도와드릴까요?', timestamp: '14:32' },
    { speaker: 'customer', message: '안녕하세요, 급한 일인데요. 카드를 잃어버렸어요!', timestamp: '14:32' },
    { speaker: 'agent', message: '고객님, 우선 카드 사용을 즉시 정지하겠습니다. 본인 확인을 위해 생년월일을 말씀해주시겠어요?', timestamp: '14:32' },
    { speaker: 'customer', message: '네, 1990년 3월 15일입니다.', timestamp: '14:33' },
    { speaker: 'agent', message: '확인되었습니다. 카드 사용이 정지되었습니다. 분실 신고 접수 완료했습니다.', timestamp: '14:33' },
    { speaker: 'customer', message: '재발급은 어떻게 받나요? 해외 출장이 다음주라서 급한데...', timestamp: '14:34' },
    { speaker: 'agent', message: '재발급 카드는 등록된 주소로 3-5일 내 배송됩니다. 급하시다면 공항 라운지에서 임시 카드 수령도 가능합니다.', timestamp: '14:34' },
    { speaker: 'customer', message: '아, 그럼 임시 카드로 받고 싶어요. 어떻게 하면 되나요?', timestamp: '14:35' },
    { speaker: 'agent', message: '공항 라운지 임시 카드 발급 신청을 도와드리겠습니다. 출국 일정을 말씀해주시겠어요?', timestamp: '14:35' },
    { speaker: 'customer', message: '다음주 월요일 오전 10시 인천공항 출발입니다.', timestamp: '14:36' },
    { speaker: 'agent', message: '신청 완료했습니다. 출국 당일 인천공항 제1터미널 3층 테디라운지에서 수령하실 수 있습니다.', timestamp: '14:36' },
    { speaker: 'customer', message: '감사합니다!', timestamp: '14:37' },
    { speaker: 'agent', message: '추가 문의사항 있으시면 언제든 연락주세요. 좋은 하루 되세요!', timestamp: '14:37' },
  ],
};