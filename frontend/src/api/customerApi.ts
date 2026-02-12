/**
 * ⭐ Phase 10: 고객 API
 * 
 * Feature Flag (mockConfig.ts의 USE_MOCK_DATA)에 따라:
 * - true: Mock 고객 DB 사용
 * - false: 실제 FastAPI 백엔드 호출
 */

import { USE_MOCK_DATA } from '@/config/mockConfig';
import { getCustomerById, MOCK_CUSTOMER_DB, type CustomerInfo } from '@/data/mockCustomerDB';

/**
 * 고객 정보 조회
 * 
 * @param customerId - 고객 ID (예: 'CUST-TEDDY-00001')
 * @returns 고객 정보
 */
export async function fetchCustomerInfo(customerId: string): Promise<CustomerInfo | null> {
  if (USE_MOCK_DATA) {
    // ⭐ Mock 모드: mockCustomerDB에서 조회
    console.log('[Mock] Fetching customer info:', customerId);
    return new Promise((resolve) => {
      setTimeout(() => {
        const customer = getCustomerById(customerId);
        resolve(customer);
      }, 500); // 네트워크 지연 시뮬레이션
    });
  } else {
    // ⭐ Real 모드: FastAPI 백엔드 호출
    try {
      const response = await fetch(`/api/v1/customers/${customerId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.error('[API Error] Failed to fetch customer:', response.status);
        return null;
      }

      const data = await response.json();
      console.log('[API] Customer info fetched:', data);
      return data;
    } catch (error) {
      console.error('[API Error] fetchCustomerInfo:', error);
      return null;
    }
  }
}

/**
 * 고객 목록 조회 (페이지네이션)
 * 
 * @param page - 페이지 번호 (1부터 시작)
 * @param limit - 페이지 당 개수
 * @returns 고객 목록 + 전체 개수
 */
export async function fetchCustomerList(page: number = 1, limit: number = 20): Promise<{
  customers: CustomerInfo[];
  total: number;
  page: number;
  limit: number;
}> {
  if (USE_MOCK_DATA) {
    // ⭐ Mock 모드
    console.log('[Mock] Fetching customer list:', { page, limit });
    return new Promise((resolve) => {
      setTimeout(() => {
        const start = (page - 1) * limit;
        const end = start + limit;
        const customers = MOCK_CUSTOMER_DB.slice(start, end);
        resolve({
          customers,
          total: MOCK_CUSTOMER_DB.length,
          page,
          limit,
        });
      }, 500);
    });
  } else {
    // ⭐ Real 모드
    try {
      const response = await fetch(`/api/v1/customers?page=${page}&limit=${limit}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.error('[API Error] Failed to fetch customer list:', response.status);
        return { customers: [], total: 0, page, limit };
      }

      const data = await response.json();
      console.log('[API] Customer list fetched:', data);
      return data;
    } catch (error) {
      console.error('[API Error] fetchCustomerList:', error);
      return { customers: [], total: 0, page, limit };
    }
  }
}

/**
 * 고객 정보 업데이트 (총 상담 횟수, 마지막 상담 일자 등)
 * 
 * @param customerId - 고객 ID
 * @param updates - 업데이트할 필드
 */
export async function updateCustomerInfo(
  customerId: string,
  updates: Partial<CustomerInfo>
): Promise<boolean> {
  if (USE_MOCK_DATA) {
    // ⭐ Mock 모드: 실제 업데이트 없음 (시뮬레이션만)
    console.log('[Mock] Updating customer info:', customerId, updates);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 300);
    });
  } else {
    // ⭐ Real 모드
    try {
      const response = await fetch(`/api/v1/customers/${customerId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        console.error('[API Error] Failed to update customer:', response.status);
        return false;
      }

      console.log('[API] Customer info updated:', customerId);
      return true;
    } catch (error) {
      console.error('[API Error] updateCustomerInfo:', error);
      return false;
    }
  }
}

/**
 * 고객 특성 태그 기반 LLM 가이드 생성 요청
 * 
 * @param customerId - 고객 ID
 * @returns LLM이 생성한 상담 가이드 텍스트
 */
export async function fetchCustomerLLMGuide(customerId: string): Promise<string | null> {
  if (USE_MOCK_DATA) {
    // ⭐ Mock 모드: preferredStyle 반환 (이미 Mock 데이터에 포함됨)
    console.log('[Mock] Fetching LLM guide for customer:', customerId);
    const customer = getCustomerById(customerId);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(customer?.preferredStyle || '표준 응대 매뉴얼에 따라 진행하세요.');
      }, 800); // LLM 응답 시뮬레이션
    });
  } else {
    // ⭐ Real 모드: 백엔드 LLM 엔드포인트 호출
    try {
      const response = await fetch(`/api/v1/customers/${customerId}/llm-guide`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.error('[API Error] Failed to fetch LLM guide:', response.status);
        return null;
      }

      const data = await response.json();
      console.log('[API] LLM guide fetched:', data);
      return data.guide;
    } catch (error) {
      console.error('[API Error] fetchCustomerLLMGuide:', error);
      return null;
    }
  }
}
