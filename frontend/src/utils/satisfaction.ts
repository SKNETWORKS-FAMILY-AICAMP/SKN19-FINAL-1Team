/**
 * ⭐ Phase 10-5: 고객 만족도 환산 로직
 * 
 * 후처리 페이지의 피드백 점수(100점 만점)를 5점 만점으로 환산합니다.
 */

/**
 * 100점 만점 피드백 점수를 5점 만점 만족도로 환산
 * @param feedbackScore - 100점 만점 피드백 점수 (0-100)
 * @returns 5점 만점 만족도 (1-5)
 */
export function convertFeedbackToSatisfaction(feedbackScore: number): number {
  // 입력 검증
  if (feedbackScore < 0 || feedbackScore > 100) {
    console.warn(`Invalid feedback score: ${feedbackScore}. Using default value 0.`);
    return 0;
  }

  // 100점 → 5점 환산 (반올림)
  // 100점 = 5점, 80점 = 4점, 60점 = 3점, 40점 = 2점, 20점 = 1점
  const satisfaction = Math.round(feedbackScore / 20);

  // 최소값 1점 보장 (0점 방지)
  return Math.max(1, Math.min(5, satisfaction));
}

/**
 * 5점 만점 만족도를 100점 만점 피드백 점수로 역산
 * @param satisfactionScore - 5점 만점 만족도 (1-5)
 * @returns 100점 만점 피드백 점수 (20-100)
 */
export function convertSatisfactionToFeedback(satisfactionScore: number): number {
  // 입력 검증
  if (satisfactionScore < 1 || satisfactionScore > 5) {
    console.warn(`Invalid satisfaction score: ${satisfactionScore}. Using default value 1.`);
    return 20;
  }

  // 5점 → 100점 환산
  return satisfactionScore * 20;
}

/**
 * 만족도 점수 예시:
 * - 100점 → 5점 (★★★★★)
 * - 90점 → 5점 (★★★★★)
 * - 85점 → 4점 (★★★★☆)
 * - 70점 → 4점 (★★★★☆)
 * - 60점 → 3점 (★★★☆☆)
 * - 50점 → 3점 (★★★☆☆)
 * - 40점 → 2점 (★★☆☆☆)
 * - 20점 → 1점 (★☆☆☆☆)
 */
