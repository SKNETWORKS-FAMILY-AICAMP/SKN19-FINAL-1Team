/**
 * ⭐ Phase 10-2: Toast 알림 헬퍼 함수
 * 
 * alert() 대체용 Toast 래퍼
 * - 성공, 경고, 에러, 정보 알림
 * - CALL:ACT 디자인 시스템 통합
 */

import { toast as sonnerToast } from 'sonner';

/**
 * 성공 알림
 */
export function showSuccess(message: string, description?: string) {
  sonnerToast.success(message, {
    description,
    duration: 2500,
  });
}

/**
 * 경고 알림
 */
export function showWarning(message: string, description?: string) {
  sonnerToast.warning(message, {
    description,
    duration: 3000,
  });
}

/**
 * 에러 알림
 */
export function showError(message: string, description?: string) {
  sonnerToast.error(message, {
    description,
    duration: 3500,
  });
}

/**
 * 정보 알림
 */
export function showInfo(message: string, description?: string) {
  sonnerToast.info(message, {
    description,
    duration: 3000,
  });
}

/**
 * 일반 알림 (기본)
 */
export function showToast(message: string, description?: string) {
  sonnerToast(message, {
    description,
    duration: 3000,
  });
}

/**
 * 로딩 알림 (Promise 기반)
 */
export function showPromiseToast<T>(
  promise: Promise<T>,
  messages: {
    loading: string;
    success: string;
    error: string;
  }
) {
  return sonnerToast.promise(promise, {
    loading: messages.loading,
    success: messages.success,
    error: messages.error,
  });
}
