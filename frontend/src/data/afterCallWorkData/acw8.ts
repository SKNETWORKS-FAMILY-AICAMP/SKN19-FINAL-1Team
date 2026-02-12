/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * CALL:ACT - ACW 데이터: 시나리오8 (기타문의)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * 고객: 이정재 (STANDARD)
 * 인입 케이스: 명세서 수령 방법 및 청구지 주소 변경
 * 
 * @version 1.0
 * @since 2025-02-03
 */

import type { ACWData } from './types';
import { CATEGORY_RAW } from '@/data/categoryRaw';

export const acw8Data: ACWData = {
  aiAnalysis: {
    title: '명세서 수령 방법 및 청구지 주소 변경 처리',
    inboundCategory: '기타',
    handledCategories: [
      CATEGORY_RAW.STATEMENT_METHOD,   // 명세서 수령 방법 변경
      CATEGORY_RAW.ADDRESS_CHANGE,     // 청구지 주소 변경
    ],
    subcategory: '변경',
    summary: `고객님께서 명세서 수령 방법과 청구지 주소를 변경하셨습니다.

[처리 내역]
1. 명세서 수령 방법 변경:
   - 변경 전: 우편 발송
   - 변경 후: 이메일 발송
   - 등록 이메일: jungjae.lee@email.com
   - 적용 시점: 다음 청구분부터 (매월 5일 발송)
2. 청구지 주소 변경:
   - 변경 전: 미확인
   - 변경 후: 서울시 마포구 월드컵로 456
   - 적용 시점: 즉시 적용
3. 변경 내역 SMS 발송 완료

[고객 요청사항]
- 명세서 우편 → 이메일 변경
- 청구지 주소 변경
- 적용 시점 확인

[상담사 조치]
- 등록된 이메일 주소 확인 후 변경
- 명세서 발송 일정 안내 (매월 5일)
- 청구지 주소 정확히 입력 및 확인
- 변경 적용 시점 명확히 안내:
  * 명세서: 다음 달부터
  * 청구지: 즉시 적용
- 변경 내역 SMS 자동 발송

[참고사항]
- 이전 상담 이력 확인 (2025-01-25 명세서 관련 문의)
- 온라인 서비스 선호 고객
- 변경 사항 이메일로도 재안내 필요

[메모]`,
    followUpTasks: '다음 달 명세서 이메일 발송 정상 여부 확인',
    handoffDepartment: '없음',
    handoffNotes: '',
  },
  
  processingTimeline: [
    {
      time: '16:10:30',
      action: '고객 본인 확인',
      categoryRaw: null,
    },
    {
      time: '16:11:15',
      action: '등록 이메일 확인',
      categoryRaw: CATEGORY_RAW.STATEMENT_METHOD,
    },
    {
      time: '16:11:45',
      action: '명세서 수령 방법 변경',
      categoryRaw: CATEGORY_RAW.STATEMENT_METHOD,
    },
    {
      time: '16:12:30',
      action: '새 주소 확인',
      categoryRaw: CATEGORY_RAW.ADDRESS_CHANGE,
    },
    {
      time: '16:13:00',
      action: '청구지 주소 변경',
      categoryRaw: CATEGORY_RAW.ADDRESS_CHANGE,
    },
    {
      time: '16:13:45',
      action: '적용 시점 안내',
      categoryRaw: null,
    },
    {
      time: '16:14:15',
      action: '상담 종료 및 확인',
      categoryRaw: null,
    },
  ],
  
  callTranscript: [
    { speaker: 'agent', message: '안녕하세요, 테디카드 상담센터 상담사 강태양입니다. 무엇을 도와드릴까요?', timestamp: '16:10' },
    { speaker: 'customer', message: '안녕하세요, 명세서를 우편으로 받고 있는데 이메일로 변경하고 싶어요.', timestamp: '16:11' },
    { speaker: 'agent', message: '명세서 수령 방법 변경해드리겠습니다. 등록된 이메일 주소를 확인해보니 jungjae.lee@email.com 맞으신가요?', timestamp: '16:11' },
    { speaker: 'customer', message: '네, 맞습니다.', timestamp: '16:11' },
    { speaker: 'agent', message: '이메일로 변경 처리했습니다. 다음 청구분부터 매월 5일 이메일로 발송됩니다.', timestamp: '16:12' },
    { speaker: 'customer', message: '그리고 청구지 주소도 변경하고 싶은데요.', timestamp: '16:12' },
    { speaker: 'agent', message: '청구지 주소 변경도 도와드리겠습니다. 새로운 주소를 말씀해주시겠어요?', timestamp: '16:12' },
    { speaker: 'customer', message: '서울시 마포구 월드컵로 456입니다.', timestamp: '16:13' },
    { speaker: 'agent', message: '서울시 마포구 월드컵로 456으로 변경 완료했습니다.', timestamp: '16:13' },
    { speaker: 'customer', message: '바로 적용되나요?', timestamp: '16:13' },
    { speaker: 'agent', message: '네, 명세서는 다음 달부터, 청구지는 즉시 적용됩니다. 변경 내역은 SMS로도 발송해드렸습니다.', timestamp: '16:14' },
  ],
};
