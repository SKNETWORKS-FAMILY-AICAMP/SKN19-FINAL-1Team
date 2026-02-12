/**
 * ⭐ 자주 찾는 문의 API
 *
 * Feature Flag (mockConfig.ts의 USE_MOCK_DATA)에 따라:
 * - true: Mock 데이터 사용
 * - false: 실제 FastAPI 백엔드 호출
 */

import { USE_MOCK_DATA } from '@/config/mockConfig';
import { frequentInquiriesData } from '@/data/mock';
import { frequentInquiriesDetailData } from '@/data/frequentInquiriesDetail';
import { API_BASE_URL } from '../config/apiConfig';

// API 기본 URL
export interface FrequentInquiry {
  id: number;
  keyword: string;
  question: string;
  count: number;
  trend: 'up' | 'down' | 'same';
  content?: string;
  relatedDocument?: {
    document_id: string;
    title: string;
    regulation?: string;
    summary?: string;
  };
}

interface FrequentInquiryListResponse {
  success: boolean;
  data: FrequentInquiry[];
  total: number;
  message: string;
}

/**
 * 자주 찾는 문의 목록 조회
 *
 * @param limit - 조회 개수 (기본 5)
 * @param offset - 오프셋 (페이지네이션용)
 * @returns 자주 찾는 문의 목록
 */
export async function fetchFrequentInquiries(
  limit: number = 5,
  offset: number = 0
): Promise<FrequentInquiry[]> {
  if (USE_MOCK_DATA) {
    // ⭐ Mock 모드: Mock 데이터 반환
    console.log('[Mock] Fetching frequent inquiries:', { limit, offset });
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(frequentInquiriesData.slice(offset, offset + limit));
      }, 300);
    });
  } else {
    // ⭐ Real 모드: FastAPI 백엔드 호출
    try {
      console.log('[API] Fetching frequent inquiries from backend...');
      const response = await fetch(
        `${API_BASE_URL}/frequent-inquiries?limit=${limit}&offset=${offset}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        console.error('[API Error] Failed to fetch frequent inquiries:', response.status);
        // 실패 시 Mock 데이터로 폴백
        return frequentInquiriesData.slice(offset, offset + limit);
      }

      const result: FrequentInquiryListResponse = await response.json();
      console.log('[API] Frequent inquiries fetched:', result.data.length, '건');
      return result.data;
    } catch (error) {
      console.error('[API Error] fetchFrequentInquiries:', error);
      // 에러 시 Mock 데이터로 폴백
      return frequentInquiriesData.slice(offset, offset + limit);
    }
  }
}

/**
 * 특정 자주 찾는 문의 상세 조회
 *
 * @param inquiryId - 문의 ID
 * @returns 문의 상세 정보
 */
export async function fetchFrequentInquiryById(
  inquiryId: number
): Promise<FrequentInquiry | null> {
  if (USE_MOCK_DATA) {
    // ⭐ Mock 모드
    console.log('[Mock] Fetching frequent inquiry by ID:', inquiryId);
    return new Promise((resolve) => {
      setTimeout(() => {
        const inquiry = frequentInquiriesDetailData.find((i) => i.id === inquiryId) || null;
        resolve(inquiry);
      }, 200);
    });
  } else {
    // ⭐ Real 모드
    try {
      console.log('[API] Fetching frequent inquiry:', inquiryId);
      const response = await fetch(
        `${API_BASE_URL}/frequent-inquiries/${inquiryId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        console.error('[API Error] Failed to fetch frequent inquiry:', response.status);
        // 폴백: Mock detail 데이터에서 찾기
        return frequentInquiriesDetailData.find((i) => i.id === inquiryId) || null;
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('[API Error] fetchFrequentInquiryById:', error);
      return frequentInquiriesDetailData.find((i) => i.id === inquiryId) || null;
    }
  }
}
