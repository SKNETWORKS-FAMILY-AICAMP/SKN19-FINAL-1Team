/**
 * 녹취 다운로드 로그 관리 유틸리티
 * 
 * 현재: localStorage 기반 (프론트엔드)
 * 향후: 백엔드 API 연동 시 이 파일만 수정하면 됨
 */

export interface RecordingDownloadLog {
  id: string;
  consultation_id: string;
  downloaded_by: string;              // 사용자 ID
  downloaded_by_name: string;         // 사용자 이름
  download_type: 'wav' | 'txt';       // 파일 타입
  download_ip: string;                // IP 주소 (프론트에서는 'localhost')
  download_user_agent: string;        // 브라우저 정보
  file_name: string;                  // 다운로드한 파일명
  downloaded_at: string;              // ISO 날짜 문자열
}

/**
 * ⭐ 다운로드 로그 기록
 * 
 * 현재: localStorage에 저장
 * 향후: fetch('/api/recordings/download-log', {...})로 변경
 */
export async function logRecordingDownload(params: {
  consultation_id: string;
  download_type: 'wav' | 'txt';
  file_name: string;
}): Promise<void> {
  // 현재 사용자 정보 (실제로는 AuthContext에서 가져와야 함)
  const currentUser = {
    id: 'EMP001',  // TODO: AuthContext에서 가져오기
    name: '홍길동'
  };

  const log: RecordingDownloadLog = {
    id: crypto.randomUUID(),
    consultation_id: params.consultation_id,
    downloaded_by: currentUser.id,
    downloaded_by_name: currentUser.name,
    download_type: params.download_type,
    download_ip: 'localhost', // 프론트엔드에서는 실제 IP를 알 수 없음
    download_user_agent: navigator.userAgent,
    file_name: params.file_name,
    downloaded_at: new Date().toISOString()
  };

  // ⭐ 현재: localStorage에 저장
  try {
    const existingLogs = getDownloadLogs();
    existingLogs.push(log);
    
    // 최대 1000개만 유지 (메모리 절약)
    const logsToSave = existingLogs.slice(-1000);
    localStorage.setItem('recordingDownloadLogs', JSON.stringify(logsToSave));
    
    console.log('✅ 다운로드 로그 기록 완료 (localStorage):', log);
  } catch (error) {
    console.error('❌ 다운로드 로그 기록 실패:', error);
  }

  // 🔄 향후: 백엔드 API 호출
  /*
  try {
    const response = await fetch('/api/recordings/download-log', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        consultation_id: params.consultation_id,
        download_type: params.download_type,
        file_name: params.file_name
      })
    });

    if (!response.ok) {
      throw new Error('로그 기록 실패');
    }

    const result = await response.json();
    console.log('✅ 다운로드 로그 기록 완료 (서버):', result);
  } catch (error) {
    console.error('❌ 다운로드 로그 기록 실패:', error);
    // 로그 기록 실패해도 다운로드는 완료된 상태
  }
  */
}

/**
 * 다운로드 로그 조회
 */
export function getDownloadLogs(): RecordingDownloadLog[] {
  try {
    const logs = localStorage.getItem('recordingDownloadLogs');
    return logs ? JSON.parse(logs) : [];
  } catch (error) {
    console.error('❌ 다운로드 로그 조회 실패:', error);
    return [];
  }

  // 🔄 향후: 백엔드 API 호출
  /*
  try {
    const response = await fetch('/api/recordings/download-logs', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    if (!response.ok) {
      throw new Error('로그 조회 실패');
    }
    
    const data = await response.json();
    return data.logs;
  } catch (error) {
    console.error('❌ 다운로드 로그 조회 실패:', error);
    return [];
  }
  */
}

/**
 * 특정 상담의 다운로드 로그 조회
 */
export function getDownloadLogsByConsultation(consultation_id: string): RecordingDownloadLog[] {
  const allLogs = getDownloadLogs();
  return allLogs.filter(log => log.consultation_id === consultation_id);
}

/**
 * 특정 사용자의 다운로드 로그 조회
 */
export function getDownloadLogsByUser(employee_id: string): RecordingDownloadLog[] {
  const allLogs = getDownloadLogs();
  return allLogs.filter(log => log.downloaded_by === employee_id);
}

/**
 * 다운로드 로그 초기화 (관리자 전용)
 */
export function clearDownloadLogs(): void {
  try {
    localStorage.removeItem('recordingDownloadLogs');
    console.log('✅ 다운로드 로그 초기화 완료');
  } catch (error) {
    console.error('❌ 다운로드 로그 초기화 실패:', error);
  }
}
