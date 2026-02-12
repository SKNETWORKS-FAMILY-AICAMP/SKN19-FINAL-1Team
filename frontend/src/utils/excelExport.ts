// ⭐ Phase 14: 엑셀 내보내기 유틸리티
import { format } from 'date-fns';

export interface ConsultationExcelData {
  id: string;
  agent: string;
  customer: string;
  category: string;
  status: string;
  content: string;
  datetime: string;
  duration: string;
  fcr: boolean;
  memo: string;
}

/**
 * 상담 데이터를 CSV 형식으로 변환 (엑셀용)
 */
export function exportConsultationsToCSV(data: ConsultationExcelData[]): string {
  // CSV 헤더
  const headers = [
    '상담 ID',
    '상담사',
    '고객명',
    '카테고리',
    '상태',
    '상담 내용',
    '일시',
    '통화시간',
    'FCR',
    '메모'
  ];

  // CSV 데이터 행
  const rows = data.map(item => [
    item.id,
    item.agent,
    item.customer,
    item.category,
    item.status,
    `"${item.content.replace(/"/g, '""')}"`, // 쌍따옴표 이스케이프
    item.datetime,
    item.duration,
    item.fcr ? 'O' : 'X',
    `"${(item.memo || '').replace(/"/g, '""')}"` // 쌍따옴표 이스케이프
  ]);

  // CSV 문자열 생성
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  // UTF-8 BOM 추가 (엑셀 한글 깨짐 방지)
  return '\uFEFF' + csvContent;
}

/**
 * CSV 문자열을 파일로 다운로드
 */
export function downloadCSV(csvContent: string, filename: string): void {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // 메모리 해제
  URL.revokeObjectURL(url);
}

/**
 * 상담 데이터를 엑셀 파일로 다운로드
 */
export function downloadConsultationsExcel(
  data: ConsultationExcelData[],
  filterInfo?: string
): void {
  const csvContent = exportConsultationsToCSV(data);
  const timestamp = format(new Date(), 'yyyyMMdd_HHmmss');
  const filterSuffix = filterInfo ? `_${filterInfo}` : '';
  const filename = `상담내역_${timestamp}${filterSuffix}.csv`;
  
  downloadCSV(csvContent, filename);
}
