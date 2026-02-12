/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * CALL:ACT - ACW 데이터: 시나리오6 (포인트/혜택)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * 고객: 강민지 (VIP)
 * 인입 케이스: 포인트 조회 및 여행 특화 카드 신규 발급
 * 
 * @version 1.0
 * @since 2025-02-03
 */

import type { ACWData } from './types';
import { CATEGORY_RAW } from '@/data/categoryRaw';

export const acw6Data: ACWData = {
  aiAnalysis: {
    title: '포인트 조회 및 트래블로그 카드 신규 발급',
    inboundCategory: '포인트/혜택',
    handledCategories: [
      CATEGORY_RAW.POINT_INQUIRY,      // 포인트 조회
      CATEGORY_RAW.BENEFIT_COMPARE,    // 카드 혜택 비교
      CATEGORY_RAW.NEW_CARD_ISSUE,     // 신규 카드 발급
    ],
    subcategory: '발급',
    summary: `고객님께서 포인트 조회 후 여행 특화 카드 추가 발급을 신청하셨습니다.

[처리 내역]
1. 보유 포인트 조회: 38,500포인트
2. 포인트 사용 방법 안내:
   - 가맹점에서 현금처럼 사용
   - 항공 마일리지 전환 (10,000P → 5,000마일)
3. 여행 카드 문의 대응: 테디 트래블로그 추천
4. 카드 혜택 비교 상담:
   - 현재 카드: 국내 사용 1.0% 포인트 적립
   - 트래블로그: 해외 사용 1.5% 마일리지 + 라운지 무료
   - 연간 예상 추가 혜택: 약 150,000원
5. 신규 카드 발급 신청 완료 (테디 트래블로그)
6. 일본 여행 전 수령 가능하도록 빠른 배송 처리

[고객 요청사항]
- 보유 포인트 확인
- 일본 여행 관련 카드 추천
- 기존 카드와 혜택 비교
- 여행 전 신속 발급

[상담사 조치]
- 포인트 현황 실시간 조회
- 고객 패턴 분석 (잦은 여행, 높은 사용액)
- 트래블로그 카드 맞춤 추천
- 구체적 수치로 혜택 비교 (연 15만원 차이)
- 신규 카드 신청 즉시 처리
- VIP 고객 빠른 배송 지원

[참고사항]
- VIP 등급으로 복수 카드 발급 가능
- 기존 포인트 카드 유지 (해지 안 함)
- 트래블로그 카드 배송 예정: 영업일 기준 3일
- 일본 여행 일정 고려한 신속 처리

[메모]`,
    followUpTasks: '일본 여행 전 카드 도착 여부 확인 SMS 발송',
    handoffDepartment: '카드발급팀',
    handoffNotes: 'VIP 고객 신규 카드 발급 건. 일본 여행 일정(다음 달) 고려하여 빠른 배송 요청',
  },
  
  processingTimeline: [
    {
      time: '15:40:30',
      action: '고객 본인 확인',
      categoryRaw: null,
    },
    {
      time: '15:41:15',
      action: '포인트 조회',
      categoryRaw: CATEGORY_RAW.POINT_INQUIRY,
    },
    {
      time: '15:42:00',
      action: '포인트 사용 방법 안내',
      categoryRaw: CATEGORY_RAW.POINT_INQUIRY,
    },
    {
      time: '15:43:30',
      action: '여행 카드 추천',
      categoryRaw: CATEGORY_RAW.BENEFIT_COMPARE,
    },
    {
      time: '15:44:45',
      action: '카드 혜택 비교 상담',
      categoryRaw: CATEGORY_RAW.BENEFIT_COMPARE,
    },
    {
      time: '15:46:00',
      action: '신규 카드 발급 신청',
      categoryRaw: CATEGORY_RAW.NEW_CARD_ISSUE,
    },
    {
      time: '15:47:00',
      action: '상담 종료 및 확인',
      categoryRaw: null,
    },
  ],
  
  callTranscript: [
    { speaker: 'agent', message: '안녕하세요, 테디카드 상담센터 상담사 김서연입니다. 무엇을 도와드릴까요?', timestamp: '15:40' },
    { speaker: 'customer', message: '안녕하세요, 제 포인트 얼마나 있는지 확인 부탁드려요.', timestamp: '15:41' },
    { speaker: 'agent', message: '네, 확인해드리겠습니다. 현재 38,500포인트 보유하고 계십니다.', timestamp: '15:41' },
    { speaker: 'customer', message: '이 포인트로 뭐 할 수 있나요?', timestamp: '15:42' },
    { speaker: 'agent', message: '가맹점에서 현금처럼 사용하시거나, 항공 마일리지로 전환 가능합니다. 10,000포인트당 5,000마일로 전환됩니다.', timestamp: '15:42' },
    { speaker: 'customer', message: '다음 달에 일본 여행 가는데, 마일리지 적립 잘 되는 카드 없나요?', timestamp: '15:43' },
    { speaker: 'agent', message: '여행 특화 카드인 "테디 트래블로그" 카드를 추천드립니다. 해외 사용 시 1.5% 마일리지 적립되고, 공항라운지도 무료입니다.', timestamp: '15:44' },
    { speaker: 'customer', message: '지금 쓰는 포인트 카드랑 비교하면 어떤가요?', timestamp: '15:44' },
    { speaker: 'agent', message: '포인트 카드는 국내 사용에 유리하고, 고객님처럼 여행이 잦으시다면 트래블로그가 연간 15만원 정도 더 혜택을 보실 수 있습니다.', timestamp: '15:45' },
    { speaker: 'customer', message: '그럼 트래블로그로 추가 발급해주세요.', timestamp: '15:46' },
    { speaker: 'agent', message: '네, 알겠습니다. 바로 신청 도와드리겠습니다. 일본 여행 전에 받으실 수 있도록 빠르게 처리해드릴게요.', timestamp: '15:46' },
    { speaker: 'customer', message: '감사합니다.', timestamp: '15:46' },
    { speaker: 'agent', message: '감사합니다, 고객님. 추가 문의사항 있으시면 언제든 연락주세요. 좋은 하루 되세요!', timestamp: '15:47' },
  ],
};