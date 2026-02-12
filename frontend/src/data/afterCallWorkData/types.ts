/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * CALL:ACT - 후처리 데이터 타입 정의
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * AI 분석 결과 + STT 전문 + 처리 내역
 * 
 * @version 1.0
 * @since 2025-02-02
 */

import type { CategoryRaw } from '@/data/categoryRaw';

/**
 * 처리 내역 타임라인 아이템
 */
export interface ProcessingTimelineItem {
  time: string;                   // HH:MM:SS 형식
  action: string;                 // 처리 내용
  categoryRaw: CategoryRaw | null; // 57개 케이스 중 하나 (선택적)
}

/**
 * STT 대화 아이템
 */
export interface CallTranscriptItem {
  speaker: 'customer' | 'agent';
  message: string;
  timestamp: string;              // HH:MM 형식
}

/**
 * AI 분석 결과
 */
export interface AIAnalysis {
  title: string;                  // 상담 제목
  inboundCategory: string;        // 인입 대분류 (예: 분실/도난)
  handledCategories: CategoryRaw[]; // 처리 분류 배열 (멀티 레이어)
  subcategory: string;            // 중분류 (예: 분실신고)
  summary: string;                // AI 요약 (마크다운 형식)
  followUpTasks?: string;         // 후속 일정 (선택적)
  handoffDepartment?: string;     // 이관 부서 (선택적)
  handoffNotes?: string;          // 이관 전달사항 (선택적)
}

/**
 * 후처리 데이터 (ACW Data)
 */
export interface ACWData {
  aiAnalysis: AIAnalysis;
  processingTimeline: ProcessingTimelineItem[];
  callTranscript: CallTranscriptItem[];
}
