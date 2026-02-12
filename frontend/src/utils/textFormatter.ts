/**
 * 텍스트 포맷팅 유틸리티
 */

/**
 * 마크다운 스타일 텍스트를 HTML로 변환
 * @param text - 변환할 텍스트
 * @returns HTML 문자열
 */
export function convertToMarkdown(text: string): string {
  if (!text) return '';
  
  let result = text;
  
  // 볼드 처리: **텍스트** -> <strong>텍스트</strong>
  result = result.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // 이탤릭 처리: *텍스트* -> <em>텍스트</em>
  result = result.replace(/\*(.*?)\*/g, '<em>$1</em>');
  
  // 코드 처리: `코드` -> <code>코드</code>
  result = result.replace(/`(.*?)`/g, '<code>$1</code>');
  
  return result;
}

/**
 * 줄바꿈 문자를 실제 줄바꿈으로 변환
 * \\n 또는 \n을 <br/>로 변환
 * @param text - 변환할 텍스트
 * @returns 줄바꿈이 적용된 텍스트
 */
export function normalizeLineBreaks(text: string): string {
  if (!text) return '';
  
  // \\n (이중 백슬래시)을 실제 줄바꿈으로 변환
  let result = text.replace(/\\\\n/g, '\n');
  
  // 이미 변환되지 않은 \n도 처리
  result = result.replace(/\\n/g, '\n');
  
  return result;
}

/**
 * HTML 엔티티를 디코딩
 * @param text - 디코딩할 텍스트
 * @returns 디코딩된 텍스트
 */
export function decodeHTMLEntities(text: string): string {
  if (!text) return '';
  
  const textarea = document.createElement('textarea');
  textarea.innerHTML = text;
  return textarea.value;
}

/**
 * 공지사항 content 전용 포맷터
 * \\n을 실제 줄바꿈으로 변환하고 HTML 엔티티 디코딩
 * @param content - 공지사항 content
 * @returns 포맷팅된 content
 */
export function formatNoticeContent(content: string): string {
  if (!content) return '';
  
  // 1단계: HTML 엔티티 디코딩
  let result = decodeHTMLEntities(content);
  
  // 2단계: \\n을 실제 줄바꿈으로 변환
  result = normalizeLineBreaks(result);
  
  return result;
}
