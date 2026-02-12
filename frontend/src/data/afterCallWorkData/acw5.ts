/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * CALL:ACT - ACW 데이터: 시나리오5 (연체문의)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * 고객: 강동원 (일반)
 * 인입 케이스: 결제 연체 문의 및 납부 안내
 * 
 * @version 1.0
 * @since 2025-02-03
 */

import type { ACWData } from './types';
import { CATEGORY_RAW } from '@/data/categoryRaw';

export const acw5Data: ACWData = {
  aiAnalysis: {
    title: '결제 연체 확인 및 즉시 납부 안내',
    inboundCategory: '수수료/연체',
    handledCategories: [
      CATEGORY_RAW.OVERDUE_INQUIRY,    // 연체 조회/안내
      CATEGORY_RAW.PAYMENT_GUIDE,      // 납부 방법 안내
    ],
    subcategory: '조회/안내',
    summary: `고객님께서 결제 연체 상황을 확인하시고 즉시 납부 안내를 받으셨습니다.

[처리 내역]
1. 연체 상황 조회: 5일 경과
2. 연체 금액 확인:
   - 원금: 500,000원
   - 연체 이자: 2,500원
   - 합계: 502,500원
3. 즉시 납부 가능 가상계좌 안내
4. 입금 반영 시간 안내: 30분 이내
5. 신용등급 영향 안내: 30일 이상 연체 시
6. 납부 의사 확인 완료

[고객 요청사항]
- 연체 금액 및 기간 확인
- 즉시 납부 방법 안내
- 신용등급 영향 여부 확인

[상담사 조치]
- 연체 상황 정확히 안내
- 가상계좌 즉시 발급 및 안내
- 입금 반영 시간 명확히 전달
- 장기 연체 시 신용등급 영향 주의사항 안내
- 공감 표현으로 고객 심리적 부담 경감

[참고사항]
- 반복 연체 이력 확인 (2024년 11월)
- 30일 이상 연체 시 신용정보 등록
- 분할 납부 옵션 제공 가능

[메모]`,
    followUpTasks: '입금 확인 후 카드 정지 해제 모니터링',
    handoffDepartment: '없음',
    handoffNotes: '',
  },
  
  processingTimeline: [
    {
      time: '11:30:20',
      action: '고객 본인 확인',
      categoryRaw: null,
    },
    {
      time: '11:31:00',
      action: '연체 상황 조회',
      categoryRaw: CATEGORY_RAW.OVERDUE_INQUIRY,
    },
    {
      time: '11:31:45',
      action: '연체 금액 안내',
      categoryRaw: CATEGORY_RAW.OVERDUE_INQUIRY,
    },
    {
      time: '11:32:30',
      action: '가상계좌 발급',
      categoryRaw: CATEGORY_RAW.PAYMENT_GUIDE,
    },
    {
      time: '11:33:00',
      action: '납부 방법 안내',
      categoryRaw: CATEGORY_RAW.PAYMENT_GUIDE,
    },
    {
      time: '11:33:45',
      action: '신용등급 영향 안내',
      categoryRaw: CATEGORY_RAW.OVERDUE_INQUIRY,
    },
    {
      time: '11:34:15',
      action: '상담 종료 및 확인',
      categoryRaw: null,
    },
  ],
  
  callTranscript: [
    { speaker: 'agent', message: '안녕하세요, 테디카드 상담센터 상담사 정수민입니다. 무엇을 도와드릴까요?', timestamp: '11:30' },
    { speaker: 'customer', message: '안녕하세요, 이번 달 결제를 못했는데 어떻게 하나요?', timestamp: '11:30' },
    { speaker: 'agent', message: '연체 상황을 확인해드리겠습니다.', timestamp: '11:31' },
    { speaker: 'customer', message: '얼마나 연체됐나요?', timestamp: '11:31' },
    { speaker: 'agent', message: '현재 5일 연체 중이시며, 연체 금액은 원금 50만원에 연체 이자 2,500원입니다.', timestamp: '11:31' },
    { speaker: 'customer', message: '지금 바로 납부할 수 있나요?', timestamp: '11:32' },
    { speaker: 'agent', message: '네, 가상계좌로 즉시 납부 가능합니다. 계좌번호를 안내드리겠습니다.', timestamp: '11:32' },
    { speaker: 'customer', message: '알겠습니다. 지금 바로 입금하겠습니다.', timestamp: '11:33' },
    { speaker: 'agent', message: '입금 후 30분 내 반영됩니다. 30일 이상 연체 시 신용등급에 영향이 있으니 가급적 빨리 납부해주세요.', timestamp: '11:33' },
    { speaker: 'customer', message: '네, 알겠습니다. 감사합니다.', timestamp: '11:34' },
    { speaker: 'agent', message: '추가 문의사항 있으시면 언제든 연락주세요. 좋은 하루 되세요!', timestamp: '11:34' },
  ],
};
