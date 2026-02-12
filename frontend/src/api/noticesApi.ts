/**
 * ⭐ 공지사항 API
 *
 * Feature Flag (mockConfig.ts의 USE_MOCK_DATA)에 따라:
 * - true: Mock 데이터 사용
 * - false: 실제 FastAPI 백엔드 호출
 */

import { USE_MOCK_DATA } from '@/config/mockConfig';
import { noticesData } from '@/data/mock';
import { API_BASE_URL } from '../config/apiConfig';

// API 기본 URL
export interface Notice {
  id: number;
  tag: string;
  title: string;
  date: string;
  author: string;
  views: number;
  pinned: boolean;
  content: string;
}

interface NoticeListResponse {
  success: boolean;
  data: Notice[];
  total: number;
  message: string;
}

/**
 * 공지사항 목록 조회
 *
 * @param limit - 조회 개수 (기본 10)
 * @param offset - 오프셋 (페이지네이션용)
 * @param sortBy - 정렬 방식: 'pinned_first'(고정우선+최신순), 'date_only'(최신순만)
 * @returns 공지사항 목록
 */
export async function fetchNotices(
  limit: number = 10,
  offset: number = 0,
  sortBy: 'pinned_first' | 'date_only' = 'pinned_first'
): Promise<Notice[]> {
  if (USE_MOCK_DATA) {
    // ⭐ Mock 모드: Mock 데이터 반환
    console.log('[Mock] Fetching notices:', { limit, offset, sortBy });
    return new Promise((resolve) => {
      setTimeout(() => {
        let notices = [...noticesData];
        // Mock에서도 정렬 적용
        if (sortBy === 'date_only') {
          notices.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        } else {
          // pinned first, then by date
          notices.sort((a, b) => {
            if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
            return new Date(b.date).getTime() - new Date(a.date).getTime();
          });
        }
        resolve(notices.slice(offset, offset + limit));
      }, 300);
    });
  } else {
    // ⭐ Real 모드: FastAPI 백엔드 호출
    try {
      console.log('[API] Fetching notices from backend...');
      const response = await fetch(
        `${API_BASE_URL}/notices?limit=${limit}&offset=${offset}&sort_by=${sortBy}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        console.error('[API Error] Failed to fetch notices:', response.status);
        // 실패 시 Mock 데이터로 폴백
        return noticesData.slice(offset, offset + limit);
      }

      const result: NoticeListResponse = await response.json();
      console.log('[API] Notices fetched:', result.data.length, '건');
      return result.data;
    } catch (error) {
      console.error('[API Error] fetchNotices:', error);
      // 에러 시 Mock 데이터로 폴백
      return noticesData.slice(offset, offset + limit);
    }
  }
}

/**
 * 특정 공지사항 조회
 *
 * @param noticeId - 공지사항 ID
 * @returns 공지사항 상세 정보
 */
export async function fetchNoticeById(noticeId: number): Promise<Notice | null> {
  if (USE_MOCK_DATA) {
    // ⭐ Mock 모드
    console.log('[Mock] Fetching notice by ID:', noticeId);
    return new Promise((resolve) => {
      setTimeout(() => {
        const notice = noticesData.find((n) => n.id === noticeId) || null;
        resolve(notice);
      }, 200);
    });
  } else {
    // ⭐ Real 모드
    try {
      const response = await fetch(`${API_BASE_URL}/notices/${noticeId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.error('[API Error] Failed to fetch notice:', response.status);
        return null;
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('[API Error] fetchNoticeById:', error);
      return null;
    }
  }
}

/**
 * 공지사항 생성
 */
export interface NoticeCreateRequest {
  tag: string;
  title: string;
  content: string;
  author?: string;
  pinned?: boolean;
}

export async function createNotice(data: NoticeCreateRequest): Promise<Notice | null> {
  if (USE_MOCK_DATA) {
    console.log('[Mock] Creating notice:', data);
    return new Promise((resolve) => {
      setTimeout(() => {
        const newNotice: Notice = {
          id: Date.now(),
          tag: data.tag,
          title: data.title,
          content: data.content,
          author: data.author || '관리자',
          date: new Date().toISOString().split('T')[0],
          views: 0,
          pinned: data.pinned || false,
        };
        resolve(newNotice);
      }, 300);
    });
  } else {
    try {
      console.log('[API] Creating notice...');
      const response = await fetch(`${API_BASE_URL}/notices`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        console.error('[API Error] Failed to create notice:', response.status);
        return null;
      }

      const result = await response.json();
      console.log('[API] Notice created:', result.data);
      return result.data;
    } catch (error) {
      console.error('[API Error] createNotice:', error);
      return null;
    }
  }
}

/**
 * 공지사항 수정
 */
export interface NoticeUpdateRequest {
  tag?: string;
  title?: string;
  content?: string;
  pinned?: boolean;
}

export async function updateNotice(noticeId: number, data: NoticeUpdateRequest): Promise<Notice | null> {
  if (USE_MOCK_DATA) {
    console.log('[Mock] Updating notice:', noticeId, data);
    return new Promise((resolve) => {
      setTimeout(() => {
        const notice = noticesData.find((n) => n.id === noticeId);
        if (notice) {
          const updated = { ...notice, ...data };
          resolve(updated);
        } else {
          resolve(null);
        }
      }, 300);
    });
  } else {
    try {
      console.log('[API] Updating notice:', noticeId);
      const response = await fetch(`${API_BASE_URL}/notices/${noticeId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        console.error('[API Error] Failed to update notice:', response.status);
        return null;
      }

      const result = await response.json();
      console.log('[API] Notice updated:', result.data);
      return result.data;
    } catch (error) {
      console.error('[API Error] updateNotice:', error);
      return null;
    }
  }
}

/**
 * 공지사항 삭제
 */
export async function deleteNotice(noticeId: number): Promise<boolean> {
  if (USE_MOCK_DATA) {
    console.log('[Mock] Deleting notice:', noticeId);
    return new Promise((resolve) => {
      setTimeout(() => resolve(true), 300);
    });
  } else {
    try {
      console.log('[API] Deleting notice:', noticeId);
      const response = await fetch(`${API_BASE_URL}/notices/${noticeId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        console.error('[API Error] Failed to delete notice:', response.status);
        return false;
      }

      console.log('[API] Notice deleted:', noticeId);
      return true;
    } catch (error) {
      console.error('[API Error] deleteNotice:', error);
      return false;
    }
  }
}

/**
 * 공지사항 핀 토글
 */
export async function togglePinNotice(noticeId: number): Promise<{ pinned: boolean } | null> {
  if (USE_MOCK_DATA) {
    console.log('[Mock] Toggling pin for notice:', noticeId);
    return new Promise((resolve) => {
      setTimeout(() => {
        const notice = noticesData.find((n) => n.id === noticeId);
        resolve(notice ? { pinned: !notice.pinned } : null);
      }, 300);
    });
  } else {
    try {
      console.log('[API] Toggling pin for notice:', noticeId);
      const response = await fetch(`${API_BASE_URL}/notices/${noticeId}/pin`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        console.error('[API Error] Failed to toggle pin:', response.status);
        return null;
      }

      const result = await response.json();
      console.log('[API] Pin toggled:', result.data);
      return result.data;
    } catch (error) {
      console.error('[API Error] togglePinNotice:', error);
      return null;
    }
  }
}

/**
 * 공지사항 조회수 증가
 *
 * @param noticeId - 공지사항 ID
 * @returns 업데이트된 조회수 또는 null
 */
export async function incrementViewCount(noticeId: number): Promise<{ viewCount: number } | null> {
  if (USE_MOCK_DATA) {
    console.log('[Mock] Incrementing view count for notice:', noticeId);
    return new Promise((resolve) => {
      setTimeout(() => {
        const notice = noticesData.find((n) => n.id === noticeId);
        if (notice) {
          notice.views = (notice.views || 0) + 1;
          resolve({ viewCount: notice.views });
        } else {
          resolve(null);
        }
      }, 100);
    });
  } else {
    try {
      console.log('[API] Incrementing view count for notice:', noticeId);
      const response = await fetch(`${API_BASE_URL}/notices/${noticeId}/view`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        console.error('[API Error] Failed to increment view count:', response.status);
        return null;
      }

      const result = await response.json();
      console.log('[API] View count incremented:', result.data);
      // 백엔드는 { id, views }를 반환하지만, 프론트엔드는 { viewCount }를 기대
      return { viewCount: result.data.views };
    } catch (error) {
      console.error('[API Error] incrementViewCount:', error);
      return null;
    }
  }
}
