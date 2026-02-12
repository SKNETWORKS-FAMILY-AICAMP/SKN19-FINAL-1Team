/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * CALL:ACT - ACW 데이터: 시나리오3 (해외결제)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * 고객: 박서준 (일반)
 * 인입 케이스: 일본 여행 중 카드 결제 불가 문의
 * 
 * @version 1.0
 * @since 2025-02-03
 */

import type { ACWData } from './types';
import { CATEGORY_RAW } from '@/data/categoryRaw';

export const acw3Data: ACWData = {
  aiAnalysis: {
    title: '해외 사용 설정 만료로 인한 결제 불가 해결',
    inboundCategory: '결제/승인',
    handledCategories: [
      CATEGORY_RAW.OVERSEAS_SETTING,   // 해외 사용 설정
      CATEGORY_RAW.SMS_SERVICE,        // SMS 알림 서비스
    ],
    subcategory: '처리/실행',
    summary: `일본 여행 중인 고객님의 카드 결제 불가 문제를 해결하였습니다.

[처리 내역]
1. 현재 위치 확인: 일본 도쿄
2. 문제 원인 파악: 해외 사용 설정 만료 (전일 자정)
3. 일본 사용 설정 즉시 재활성화 (오늘부터 7일간)
4. 활성화 완료 후 5분 대기 시간 안내
5. 추가 보안 강화: SMS 승인 알림 서비스 활성화
6. 해외 사용 안전 주의사항 안내 완료

[고객 요청사항]
- 일본에서 카드 결제 안 되는 문제 긴급 해결
- 호텔 체크아웃 전 신속 처리 필요
- 추가 보안 서비스 설정

[상담사 조치]
- 해외 사용 설정 즉시 재활성화 (일본, 7일간)
- 활성화 반영 시간 안내 (5분)
- SMS 승인 알림 서비스 추가 설정
- 부정 사용 방지 가이드 제공

[참고사항]
- 해외 사용 설정은 기본 3일 자동 연장
- 고객이 앱에서 직접 연장 가능
- SMS 승인 서비스로 실시간 거래 모니터링 가능

[메모]`,
    followUpTasks: '귀국 후 해외 사용 설정 자동 해제 확인',
    handoffDepartment: '없음',
    handoffNotes: '',
  },
  
  processingTimeline: [
    {
      time: '09:20:15',
      action: '고객 본인 확인',
      categoryRaw: null,
    },
    {
      time: '09:21:00',
      action: '현재 위치 확인 (일본)',
      categoryRaw: CATEGORY_RAW.OVERSEAS_SETTING,
    },
    {
      time: '09:21:30',
      action: '해외 사용 설정 조회',
      categoryRaw: CATEGORY_RAW.OVERSEAS_SETTING,
    },
    {
      time: '09:22:00',
      action: '일본 사용 설정 재활성화',
      categoryRaw: CATEGORY_RAW.OVERSEAS_SETTING,
    },
    {
      time: '09:22:45',
      action: 'SMS 승인 알림 활성화',
      categoryRaw: CATEGORY_RAW.SMS_SERVICE,
    },
    {
      time: '09:23:30',
      action: '상담 종료 및 확인',
      categoryRaw: null,
    },
  ],
  
  callTranscript: [
    { speaker: 'agent', message: '안녕하세요, 테디카드 상담센터 상담사 이서연입니다. 무엇을 도와드릴까요?', timestamp: '09:20' },
    { speaker: 'customer', message: '안녕하세요, 일본 여행 중인데 카드가 안 되네요.', timestamp: '09:20' },
    { speaker: 'agent', message: '현재 일본에 계시는군요. 해외 사용 설정을 확인해보겠습니다.', timestamp: '09:21' },
    { speaker: 'customer', message: '네, 도쿄에 있어요. 어제까지는 잘 됐는데 오늘 갑자기 안 돼요.', timestamp: '09:21' },
    { speaker: 'agent', message: '확인해보니 일본 사용 설정이 오늘 자정에 만료되었네요. 즉시 재설정해드리겠습니다.', timestamp: '09:22' },
    { speaker: 'customer', message: '아, 그렇군요. 빨리 해주세요. 호텔 체크아웃해야 해서요.', timestamp: '09:22' },
    { speaker: 'agent', message: '일본 사용 설정을 활성화했습니다. 5분 후부터 사용 가능합니다.', timestamp: '09:22' },
    { speaker: 'customer', message: '감사합니다. 다른 주의사항 있나요?', timestamp: '09:23' },
    { speaker: 'agent', message: '해외 결제 시 SMS 승인 알림을 받으시면 부정 사용 방지에 도움이 됩니다. 활성화해드릴까요?', timestamp: '09:23' },
    { speaker: 'customer', message: '네, 그렇게 해주세요.', timestamp: '09:23' },
    { speaker: 'agent', message: 'SMS 승인 서비스가 활성화되었습니다. 안전한 여행 되세요!', timestamp: '09:23' },
  ],
};
