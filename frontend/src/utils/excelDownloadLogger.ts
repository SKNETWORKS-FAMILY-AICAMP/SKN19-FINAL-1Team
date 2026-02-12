// ⭐ Phase 14: 엑셀 다운로드 로그 기록 시스템
import { format } from 'date-fns';

export interface ExcelDownloadLog {
  timestamp: string;
  user: string;
  role: string;
  downloadType: 'consultation_excel' | 'recording_excel';
  filter: {
    dateRange?: string;
    team?: string;
    category?: string;
    agent?: string;
    status?: string;
  };
  recordCount: number;
  ipAddress?: string;
}

export function logExcelDownload(log: Omit<ExcelDownloadLog, 'timestamp'>): void {
  const logs = getExcelDownloadLogs();
  const newLog: ExcelDownloadLog = {
    ...log,
    timestamp: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
  };
  logs.push(newLog);
  localStorage.setItem('excelDownloadLogs', JSON.stringify(logs));
  console.log('📥 엑셀 다운로드 로그 저장:', newLog);
}

export function getExcelDownloadLogs(): ExcelDownloadLog[] {
  try {
    const logs = localStorage.getItem('excelDownloadLogs');
    return logs ? JSON.parse(logs) : [];
  } catch (error) {
    console.error('엑셀 다운로드 로그 로드 실패:', error);
    return [];
  }
}

export function clearExcelDownloadLogs(): void {
  localStorage.removeItem('excelDownloadLogs');
  console.log('🗑️ 엑셀 다운로드 로그 삭제 완료');
}
