/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * CALL:ACT - ACW 데이터 오케스트라
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * 시나리오별 ACW 데이터 매핑
 * 
 * @version 1.0
 * @since 2025-02-02
 */

import type { ACWData } from './types';
import { acw1Data } from './acw1';
import { acw2Data } from './acw2';
import { acw3Data } from './acw3';
import { acw4Data } from './acw4';
import { acw5Data } from './acw5';
import { acw6Data } from './acw6';
import { acw7Data } from './acw7';
import { acw8Data } from './acw8';

/**
 * ⭐ [향후 개선] AI 참조 문서 자동 필터링
 * 
 * 현재: 상담 중 클릭한 모든 문서를 referencedDocuments에 저장
 * 개선안: 로딩 페이지에서 AI가 상담 전문(STT) 분석 후 우선순위 3개만 선별
 * 
 * 구현 방향:
 * 1. STT 전문 + 참조 문서 목록을 AI에 전달
 * 2. AI가 상담 내용과 관련도가 높은 문서 3개 선별
 * 3. 나머지 문서는 자동 제외 (삭제)
 * 
 * 예시 API 호출:
 * const filteredDocs = await aiService.filterReferencedDocuments({
 *   transcript: sttDialogue,
 *   documents: referencedDocuments,
 *   topK: 3
 * });
 * 
 * localStorage.setItem('referencedDocuments', JSON.stringify(filteredDocs));
 */

/**
 * 시나리오별 ACW 데이터 매핑 (8개)
 */
const ACW_DATA_MAP: Record<string, ACWData> = {
  // 1. 카드 분실
  '분실/도난': acw1Data,
  '카드분실': acw1Data,
  
  // 2. 한도 증액
  '한도': acw2Data,
  '한도증액': acw2Data,
  
  // 3. 해외 결제
  '결제/승인': acw3Data,
  '해외결제': acw3Data,
  
  // 4. 이용내역 (결제일 변경)
  '이용내역': acw4Data,
  
  // 5. 연체 문의
  '수수료/연체': acw5Data,
  '연체문의': acw5Data,
  
  // 6. 포인트/혜택
  '포인트/혜택': acw6Data,
  '포인트': acw6Data,
  
  // 7. 정부지원
  '정부지원': acw7Data,
  
  // 8. 기타문의
  '기타': acw8Data,
  '기타문의': acw8Data,
};

/**
 * 시나리오 카테고리로 ACW 데이터 조회
 */
export function getACWDataByCategory(category: string): ACWData | null {
  return ACW_DATA_MAP[category] || null;
}

/**
 * ACW 데이터 전체 목록 조회
 */
export function getAllACWData(): Record<string, ACWData> {
  return ACW_DATA_MAP;
}