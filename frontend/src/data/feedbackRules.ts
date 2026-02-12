// ========== 피드백 평가 룰 (총 100점) ==========

export interface ManualCheckItem {
  category: string; // 대분류
  subCategory: string; // 중분류
  score: number; // 점수 (0 또는 마이너스)
  criteria: string; // 기준
}

export interface FeedbackScore {
  manualCompliance: number; // 매뉴얼 준수 (50점)
  customerGratitude: number; // 고객 감사 표현 (10점)
  acwTime: number; // 후처리 시간 (20점)
  emotionTransition: number; // 감정 전환 (20점)
  total: number; // 총점 (100점)
}

export interface EmotionAnalysis {
  early: 'negative' | 'neutral' | 'positive'; // 초반
  middle: 'negative' | 'neutral' | 'positive'; // 중반
  late: 'negative' | 'neutral' | 'positive'; // 후반
}

// ========== 1. 매뉴얼 준수 평가 룰 (50점) - 오각형 모델 ==========

export const manualComplianceRules: ManualCheckItem[] = [
  // 도입부 - 첫/끝인사
  {
    category: '도입부',
    subCategory: '첫/끝인사',
    score: 0,
    criteria: '첫인사: "안녕하세요 테디카드의 OOO 상담원입니다. 무엇을 도와드릴까요?"\n끝인사: "감사합니다 더 필요하신 문의가 있으실까요?"',
  },
  {
    category: '도입부',
    subCategory: '첫/끝인사',
    score: -5,
    criteria: '첫인사나 끝인사 누락',
  },
  
  // 도입부 - 고객확인
  {
    category: '도입부',
    subCategory: '고객확인',
    score: 0,
    criteria: '필수 고객 정보 확인하며 도입부에 2가지 이상 고객께 직접 확인하는 경우 (이름, 전화번호, 생년월일)',
  },
  {
    category: '도입부',
    subCategory: '고객확인',
    score: -5,
    criteria: '필수 고객 정보 확인은 하되 상담원의 입에서 1가지 이상 정보가 누출되는 경우',
  },
  
  // 응대 - 호응어
  {
    category: '응대',
    subCategory: '호응어',
    score: 0,
    criteria: '마음이 담긴 감성 터치와 상황을 공감하는 호응어 사용할 경우',
  },
  {
    category: '응대',
    subCategory: '호응어',
    score: -5,
    criteria: '기운 없이 상담이 진행되거나, 짜증섞인 표현이 고객에게 전달되는 경우',
  },
  
  // 응대 - 사과/대기표현
  {
    category: '응대',
    subCategory: '사과/대기표현',
    score: 0,
    criteria: '대기 및 불편함에 대한 사과 표현 진행되는 경우',
  },
  {
    category: '응대',
    subCategory: '사과/대기표현',
    score: -5,
    criteria: '대기 표현이나 사과 표현 누락',
  },
  
  // 설명 - 커뮤니케이션
  {
    category: '설명',
    subCategory: '커뮤니케이션',
    score: 0,
    criteria: '핵심내용을 적절하게 요약, 정리하며 고객이 이해하기 쉽게 설명하는 경우',
  },
  {
    category: '설명',
    subCategory: '커뮤니케이션',
    score: -5,
    criteria: '전달 내용을 상담원의 입장에서 일방적으로 설명하거나, 과정설명없이 단답형으로 설명하는 경우',
  },
  
  // 설명 - 알기 쉬운 설명
  {
    category: '설명',
    subCategory: '알기 쉬운 설명',
    score: 0,
    criteria: '고객 특성에 맞게 알기 쉽게 설명하며 적극적인 부연설명으로 고객을 잘 이해시키는 경우',
  },
  {
    category: '설명',
    subCategory: '알기 쉬운 설명',
    score: -5,
    criteria: '고객의 눈높이에 맞지 않게 설명함 (복잡하고 장황한 설명, 상담자 입장에서 설명)',
  },
  
  // 적극성 - 적극성
  {
    category: '적극성',
    subCategory: '적극성',
    score: 0,
    criteria: '상담에 적극적으로 대응하는 경우',
  },
  {
    category: '적극성',
    subCategory: '적극성',
    score: -5,
    criteria: '정보제공이 고객의 묻는 말에만 수동적으로 답변하거나, 부정적 설명이나 대안 제시를 하지 않을 경우',
  },
  
  // 적극성 - 언어표현
  {
    category: '적극성',
    subCategory: '언어표현',
    score: 0,
    criteria: '정중함을 유지하며 고객의 입장에서 긍정적인 언어표현으로 설명하는 경우 (경어체 사용)',
  },
  {
    category: '적극성',
    subCategory: '언어표현',
    score: -5,
    criteria: '전문적인 용어 사용 혹은 줄임말 사용하는 경우\n명령조로 상담 혹은 고객을 무시하는 언어표현 사용하는 경우',
  },
  
  // 정확성 - 정확한 업무처리
  {
    category: '정확성',
    subCategory: '정확한 업무처리',
    score: 0,
    criteria: '고객에게 정확한 전달 및 비고란 지시란에 1가지라도 오류 없는 경우 (납부자 및 명의자 본인 확인 정확한 경우)',
  },
  {
    category: '정확성',
    subCategory: '정확한 업무처리',
    score: -10,
    criteria: '상담자 본인이 임의적으로 판단 진행하여 업무오류 발생하였을 경우 (재인입 소지 있는 경우)',
  },
];

// ⭐ 매뉴얼 준수 메시지 함수
export function getManualComplianceMessage(score: number): string {
  const percentage = (score / 50) * 100;
  if (percentage >= 96) return "✨ 완벽해요!";         // 48점 이상
  if (percentage >= 90) return "🌟 우수해요!";         // 45점 이상
  if (percentage >= 80) return "👍 잘했어요!";         // 40점 이상
  if (percentage >= 70) return "💪 양호해요!";         // 35점 이상
  return "📋 매뉴얼 재확인 필요";                      // 35점 미만
}

// ========== 2. 고객 감사 표현 평가 룰 (10점) ==========

export const gratitudeKeywords = [
  '덕분에 해결됐네요',
  '정말 친절하시네요',
  '설명이 명확해요',
  '감사합니다',
  '감사해요',
  '고맙습니다',
  '도움이 됐어요',
  '친절하시네요',
  '잘 알겠습니다',
];

export function calculateGratitudeScore(gratitudeCount: number): number {
  if (gratitudeCount === 0) return 0;
  if (gratitudeCount === 1) return 5;
  return 10; // 2회 이상
}

// ⭐ 고객 감사 표현 메시지 함수
export function getGratitudeMessage(score: number): string {
  if (score >= 10) return "💖 고객이 매우 만족했어요!";
  if (score >= 8) return "😊 좋은 응대였어요!";
  if (score >= 5) return "🙂 만족스러운 상담!";
  return "💬 고객 반응 확인 필요";
}

// ========== 3. 후처리 시간 평가 룰 (20점) ==========

// ⭐ 업계 표준 기준 (카드사 콜센터)
// - 이상적 범위: 45초~90초 (통상 45초~1분 30초)
// - AHT (Average Handle Time): 통화 시간 + 후처리 시간
// - 권장 AHT: 8~15분

export const acwTimeStandard = {
  perfect: 45,      // 45초 이내: 완벽
  excellent: 60,    // 1분 이내: 우수
  good: 90,         // 1분 30초 이내: 좋음
  acceptable: 120,  // 2분 이내: 양호
  needImprovement: 150, // 2분 30초: 개선 필요
  slow: 180,        // 3분: 느림
};

export function calculateAcwTimeScore(acwTimeSeconds: number): number {
  if (acwTimeSeconds <= 45) return 20;   // 45초 이내: 완벽! 🎉
  if (acwTimeSeconds <= 60) return 19;   // 1분 이내: 우수! 👍
  if (acwTimeSeconds <= 90) return 18;   // 1분 30초 이내: 좋아요! ✅
  if (acwTimeSeconds <= 120) return 16;  // 2분 이내: Good! 💪
  if (acwTimeSeconds <= 150) return 14;  // 2분 30초: 조금 더 빠르게! ⏱️
  if (acwTimeSeconds <= 180) return 12;  // 3분: 개선 필요 💡
  return 10;                              // 3분 초과: 효율 개선 필요 ⚠️
}

// ⭐ 후처리 시간 메시지 함수
export function getAcwTimeMessage(acwTimeSeconds: number): string {
  if (acwTimeSeconds <= 45) return "🎉 완벽해요!";
  if (acwTimeSeconds <= 60) return "👍 우수해요!";
  if (acwTimeSeconds <= 90) return "✅ 좋아요!";
  if (acwTimeSeconds <= 120) return "💪 Good!";
  if (acwTimeSeconds <= 150) return "⏱️ 조금 더 빠르게!";
  if (acwTimeSeconds <= 180) return "💡 시간 단축 필요";
  return "⚠️ 효율 개선 필요";
}

// ⭐ AHT (Average Handle Time) 평가 메시지
export function getAhtMessage(ahtSeconds: number): string {
  const ahtMinutes = Math.floor(ahtSeconds / 60);
  if (ahtMinutes <= 8) return "업계 표준 대비: 매우 우수 🌟";
  if (ahtMinutes <= 12) return "업계 표준 대비: 양호 ✅";
  if (ahtMinutes <= 15) return "업계 표준 대비: 보통 💼";
  return "업계 표준 대비: 개선 필요 💡";
}

// ========== 4. 감정 전환 평가 룰 (20점) ==========

export function calculateEmotionTransitionScore(emotion: EmotionAnalysis): number {
  let score = 0;
  
  // 초반 → 중반 감정 변화
  const earlyToMiddle = getEmotionTransitionPoints(emotion.early, emotion.middle);
  score += earlyToMiddle;
  
  // 중반 → 후반 감정 변화
  const middleToLate = getEmotionTransitionPoints(emotion.middle, emotion.late);
  score += middleToLate;
  
  return Math.min(score, 20); // 최대 20점
}

function getEmotionTransitionPoints(from: string, to: string): number {
  // 부정 → 중립: +5점
  if (from === 'negative' && to === 'neutral') return 5;
  
  // 부정 → 긍정: +10점
  if (from === 'negative' && to === 'positive') return 10;
  
  // 중립 → 긍정: +10점
  if (from === 'neutral' && to === 'positive') return 10;
  
  // 중립 → 부정: 0점
  if (from === 'neutral' && to === 'negative') return 0;
  
  // 긍정 → 부정: 0점
  if (from === 'positive' && to === 'negative') return 0;
  
  // 긍정 → 중립: +5점
  if (from === 'positive' && to === 'neutral') return 5;
  
  // 같은 감정 유지: +3점
  if (from === to) return 3;
  
  return 0;
}

// ⭐ 감정 전환 메시지 함수
export function getEmotionTransitionMessage(score: number, emotion: EmotionAnalysis): string {
  // 부정 → 긍정 전환 성공
  if (emotion.early === 'negative' && emotion.late === 'positive') {
    return "🎯 감정 전환 성공!";
  }
  
  // 중립 → 긍정 전환
  if (emotion.early === 'neutral' && emotion.late === 'positive') {
    return "😊 긍정적 마무리!";
  }
  
  // 부정 → 중립 개선
  if (emotion.early === 'negative' && emotion.late === 'neutral') {
    return "📈 개선 중이에요!";
  }
  
  // 점수 기반 메시지
  if (score >= 18) return "🎯 훌륭한 감정 케어!";
  if (score >= 15) return "😊 좋은 감정 전환!";
  if (score >= 12) return "💪 양호한 응대!";
  return "💡 감정 케어 필요";
}

// ========== 오각형 차트 데이터 ==========

export interface RadarChartData {
  category: string;
  score: number;
  maxScore: number;
}

export function getRadarChartData(manualScore: number): RadarChartData[] {
  // 오각형 5개 항목 (각 항목 최대 10점)
  return [
    { category: '도입부', score: 10, maxScore: 10 }, // 임시 데이터
    { category: '응대', score: 10, maxScore: 10 },
    { category: '설명', score: 10, maxScore: 10 },
    { category: '적극성', score: 10, maxScore: 10 },
    { category: '정확성', score: 10, maxScore: 10 },
  ];
}

// ========== Mock 피드백 데이터 ==========

export const mockFeedbackData: FeedbackScore & {
  emotion: EmotionAnalysis;
  gratitudeCount: number;
  acwTimeSeconds: number;
  manualDetails: {
    greeting: number;
    customerCheck: number;
    empathy: number;
    apology: number;
    communication: number;
    explanation: number;
    proactiveness: number;
    language: number;
    accuracy: number;
  };
} = {
  // 총점 데이터
  manualCompliance: 45, // 50점 만점 중 45점
  customerGratitude: 10, // 10점 만점 중 10점
  acwTime: 20, // 20점 만점 중 20점
  emotionTransition: 15, // 20점 만점 중 15점
  total: 90, // 100점 만점 중 90점
  
  // 감정 분석
  emotion: {
    early: 'negative', // 초반: 부정
    middle: 'neutral', // 중반: 중립
    late: 'positive', // 후반: 긍정
  },
  
  // 고객 감사 표현 횟수
  gratitudeCount: 2, // 2회
  
  // 후처리 시간 (초)
  acwTimeSeconds: 65, // 65초 (1분 5초)
  
  // 매뉴얼 준수 상세 점수
  manualDetails: {
    greeting: 0, // 첫/끝인사: 0점 (완벽)
    customerCheck: -5, // 고객확인: -5점 (정보 누출)
    empathy: 0, // 호응어: 0점 (완벽)
    apology: 0, // 사과/대기표현: 0점 (완벽)
    communication: 0, // 커뮤니케이션: 0점 (완벽)
    explanation: 0, // 알기 쉬운 설명: 0점 (완벽)
    proactiveness: 0, // 적극성: 0점 (완벽)
    language: 0, // 언어표현: 0점 (완벽)
    accuracy: 0, // 정확한 업무처리: 0점 (완벽)
  },
};