/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * CALL:ACT - 타이핑 애니메이션 유틸리티
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * 로딩 페이지 후 후처리 페이지 진입 시 "기다림의 미학" 제공
 * - 사용자 체감 "빠르다"는 느낌
 * - 동시에 여러 요소가 조금씩 텀을 두고 채워짐
 * 
 * @version 1.0
 * @since 2025-02-02
 */

/**
 * 타이핑 애니메이션 (한 글자씩)
 * 
 * @param text 전체 텍스트
 * @param callback 부분 텍스트 업데이트 콜백
 * @param speed 글자당 속도 (ms)
 * @returns Promise (완료 시 resolve)
 */
export function typewriterEffect(
  text: string,
  callback: (partial: string) => void,
  speed: number = 10 // 빠른 속도 (사용자 체감 빠름)
): Promise<void> {
  return new Promise((resolve) => {
    let index = 0;
    const interval = setInterval(() => {
      callback(text.slice(0, index + 1));
      index++;
      if (index >= text.length) {
        clearInterval(interval);
        resolve();
      }
    }, speed);
  });
}

/**
 * 즉시 표시 (애니메이션 없음)
 * 
 * @param text 전체 텍스트
 * @param callback 텍스트 업데이트 콜백
 * @returns Promise (즉시 resolve)
 */
export function instantDisplay(
  text: string,
  callback: (text: string) => void
): Promise<void> {
  return new Promise((resolve) => {
    callback(text);
    resolve();
  });
}

/**
 * 딜레이 함수
 * 
 * @param ms 밀리초
 * @returns Promise
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
