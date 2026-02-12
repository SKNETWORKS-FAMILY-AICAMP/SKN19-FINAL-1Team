/**
 * 타임스탬프 유틸리티
 * 상담 시스템의 모든 시간 관련 변환 함수를 중앙에서 관리
 * 
 * @module timestampUtils
 */

/**
 * 통화 시작 시각 + 경과 초 → 절대 시각 (HH:MM:SS)
 * 
 * @param callStartTime - 통화 시작 시각 (형식: "YYYY-MM-DD HH:MM")
 * @param elapsedSeconds - 통화 시작 후 경과 시간 (초 단위)
 * @returns 절대 시각 (형식: "HH:MM:SS")
 * 
 * @example
 * convertToAbsoluteTime("2025-01-31 14:32", 125)
 * // Returns: "14:34:05"
 */
export function convertToAbsoluteTime(
  callStartTime: string,
  elapsedSeconds: number
): string {
  const [date, time] = callStartTime.split(' ');
  const [hour, minute] = time.split(':').map(Number);
  
  const startTimeSeconds = hour * 3600 + minute * 60;
  const absoluteSeconds = startTimeSeconds + elapsedSeconds;
  
  const newHour = Math.floor(absoluteSeconds / 3600) % 24;
  const newMinute = Math.floor((absoluteSeconds % 3600) / 60);
  const newSecond = absoluteSeconds % 60;
  
  return `${String(newHour).padStart(2, '0')}:${String(newMinute).padStart(2, '0')}:${String(newSecond).padStart(2, '0')}`;
}

/**
 * 절대 시각에서 시:분만 추출 (HH:MM)
 * 
 * @param absoluteTime - 절대 시각 (형식: "HH:MM:SS")
 * @returns 시:분 (형식: "HH:MM")
 * 
 * @example
 * extractHourMinute("14:34:05")
 * // Returns: "14:34"
 */
export function extractHourMinute(absoluteTime: string): string {
  const [hour, minute] = absoluteTime.split(':');
  return `${hour}:${minute}`;
}

/**
 * 현재 시각을 "YYYY-MM-DD HH:MM" 형식으로 반환
 * 
 * @returns 현재 시각 문자열
 * 
 * @example
 * getCurrentDateTime()
 * // Returns: "2025-01-31 14:32"
 */
export function getCurrentDateTime(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hour = String(now.getHours()).padStart(2, '0');
  const minute = String(now.getMinutes()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hour}:${minute}`;
}

/**
 * 경과 시간(초)을 "M분 S초" 형식으로 변환
 * 
 * @param seconds - 경과 시간 (초 단위)
 * @returns 포맷팅된 시간 문자열
 * 
 * @example
 * formatDuration(125)
 * // Returns: "2분 5초"
 */
export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}분 ${remainingSeconds}초`;
}
