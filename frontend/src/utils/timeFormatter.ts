// 타임스탬프 포맷팅 유틸리티
// 카드 표시 시간을 "HH:MM (N분 전)" 형식으로 변환

import { ScenarioCard } from '@/data/scenarios';

/**
 * 날짜를 "HH:MM (N분 전)" 형식으로 포맷
 * @param date - Date 객체 또는 ISO 8601 문자열
 * @returns 포맷된 타임스탬프 문자열
 */
export const formatTimestamp = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  
  // 방금 전 (1분 미만)
  if (diffMins < 1) {
    return `${hours}:${minutes} (방금 전)`;
  }
  
  // N분 전 (1시간 미만)
  if (diffMins < 60) {
    return `${hours}:${minutes} (${diffMins}분 전)`;
  }
  
  // N시간 전 (24시간 미만)
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) {
    return `${hours}:${minutes} (${diffHours}시간 전)`;
  }
  
  // N일 전 (24시간 이상)
  const diffDays = Math.floor(diffHours / 24);
  return `${hours}:${minutes} (${diffDays}일 전)`;
};

/**
 * 카드에 현재 시간 기준 타임스탬프 추가
 * @param card - ScenarioCard 객체
 * @returns 타임스탬프가 추가된 카드
 */
export const addTimestampToCard = (card: ScenarioCard): ScenarioCard => {
  const now = new Date();
  return {
    ...card,
    timestamp: now.toISOString(),
    displayTime: formatTimestamp(now),
  };
};

/**
 * 카드 배열에 타임스탬프 일괄 추가
 * @param cards - ScenarioCard 배열
 * @returns 타임스탬프가 추가된 카드 배열
 */
export const addTimestampsToCards = (cards: ScenarioCard[]): ScenarioCard[] => {
  return cards.map(card => addTimestampToCard(card));
};

/**
 * localStorage에 저장된 카드의 타임스탬프 업데이트
 * @param card - localStorage에서 복원된 카드
 * @returns displayTime이 갱신된 카드
 */
export const updateCardDisplayTime = (card: ScenarioCard): ScenarioCard => {
  if (!card.timestamp) return card;
  
  return {
    ...card,
    displayTime: formatTimestamp(card.timestamp),
  };
};
