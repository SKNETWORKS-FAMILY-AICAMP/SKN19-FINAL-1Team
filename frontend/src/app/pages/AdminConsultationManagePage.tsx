import MainLayout from '../components/layout/MainLayout';
import { Search, Play, Pause, Download, Eye, Star, StarOff, FileSpreadsheet, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import ConsultationDetailModal from '../components/modals/ConsultationDetailModal';
import InlineRecordingDownloadWarningModal from '../components/modals/InlineRecordingDownloadWarningModal';
import ExcelDownloadWarningModal from '../components/modals/ExcelDownloadWarningModal';
import React from 'react';
import { consultationsData as initialConsultationsData, categoryMapping } from '@/data/mock';
import { enrichConsultationData } from '../../data/consultationsDataHelper';
import { fetchConsultationsPaginated, type ConsultationItem } from '@/api/consultationApi';
import { showSuccess, showInfo } from '@/utils/toast';
import { DateRangePicker } from '../components/ui/date-range-picker';
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { logRecordingDownload } from '@/utils/recordingDownloadLogger';
import { logExcelDownload } from '@/utils/excelDownloadLogger';
import { downloadConsultationsExcel } from '@/utils/excelExport';

const PAGE_SIZE = 50; // 한 번에 로드할 개수

export default function AdminConsultationManagePage() {
  const navigate = useNavigate();

  const [consultations, setConsultations] = useState<any[]>([]);
  const [isLoadingConsultations, setIsLoadingConsultations] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const tableContainerRef = useRef<HTMLDivElement>(null);

  // ⭐ 페이지네이션: 데이터 로드
  const loadConsultations = useCallback(async (reset = false) => {
    try {
      if (reset) {
        setIsLoadingConsultations(true);
        setConsultations([]);
      } else {
        setIsLoadingMore(true);
      }

      const offset = reset ? 0 : consultations.length;
      const result = await fetchConsultationsPaginated({ limit: PAGE_SIZE, offset });

      // 데이터 가공 (enrichConsultationData 적용)
      const enrichedData = result.data.map((c: ConsultationItem) => enrichConsultationData(c));

      if (reset) {
        setConsultations(enrichedData);
      } else {
        setConsultations(prev => [...prev, ...enrichedData]);
      }

      setTotalCount(result.total);
      setHasMore(result.hasMore);

      // localStorage에도 저장 (다른 기능과의 호환성)
      if (reset) {
        localStorage.setItem('consultations', JSON.stringify(enrichedData));
      }
    } catch (e) {
      console.error('Failed to load consultations from API', e);
      // fallback to localStorage or mock
      if (consultations.length === 0) {
        const saved = localStorage.getItem('consultations');
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            setConsultations(parsed.map(enrichConsultationData));
            setTotalCount(parsed.length);
            setHasMore(false);
            return;
          } catch {
            // ignore
          }
        }
        const fallbackData = initialConsultationsData.slice(0, PAGE_SIZE).map(enrichConsultationData);
        setConsultations(fallbackData);
        setTotalCount(initialConsultationsData.length);
        setHasMore(initialConsultationsData.length > PAGE_SIZE);
      }
    } finally {
      setIsLoadingConsultations(false);
      setIsLoadingMore(false);
    }
  }, [consultations.length]);

  // ⭐ 초기 로드
  useEffect(() => {
    loadConsultations(true);
  }, []);

  // ⭐ 무한 스크롤 감지
  const handleScroll = useCallback(() => {
    const container = tableContainerRef.current;
    if (!container || isLoadingMore || !hasMore) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    if (scrollHeight - scrollTop - clientHeight < 200) {
      loadConsultations(false);
    }
  }, [isLoadingMore, hasMore, loadConsultations]);

  useEffect(() => {
    const container = tableContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [playingRow, setPlayingRow] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(312); // 5:12 in seconds
  const [selectedConsultation, setSelectedConsultation] = useState<any>(null);
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [pendingDownloadConsultation, setPendingDownloadConsultation] = useState<any>(null); // ⭐ 다운로드 대기 상담
  const [isExcelDownloadModalOpen, setIsExcelDownloadModalOpen] = useState(false); // ⭐ Phase 14: 엑셀 다운로드 모달
  
  const audioRef = useRef<HTMLAudioElement>(null);

  const [filters, setFilters] = useState({
    dateRange: { from: undefined, to: undefined } as DateRange,
    agent: '전체',
    categoryMain: '전체', // ⭐ Phase 15: 대분류 필터
    categorySub: '전체', // ⭐ Phase 15: 중분류 필터
    status: '전체',
    team: '전체',
    searchTerm: '',
  });

  // ⭐ Phase 11-2: consultations 변경 시 localStorage에 저장
  useEffect(() => {
    localStorage.setItem('consultations', JSON.stringify(consultations));
  }, [consultations]);

  // 오디오 재생/정지 관리
  useEffect(() => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  // 오디오 시간 업데이트
  useEffect(() => {
    if (!audioRef.current) return;
    
    const audio = audioRef.current;
    
    const updateTime = () => {
      setCurrentTime(Math.floor(audio.currentTime));
    };
    
    const updateDuration = () => {
      setDuration(Math.floor(audio.duration));
    };
    
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };
    
    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);
    
    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [playingRow]);

  const handleRowSelect = (id: string) => {
    setSelectedRows(prev => 
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedRows.length === filteredConsultations.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filteredConsultations.map(c => c.id));
    }
  };

  const handlePlayClick = (id: string) => {
    if (playingRow === id) {
      setPlayingRow(null);
      setIsPlaying(false);
    } else {
      setPlayingRow(id);
      setIsPlaying(false);
      setCurrentTime(0);
    }
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseInt(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  // 재생 속도 변경
  const handlePlaybackRateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const rate = parseFloat(e.target.value);
    setPlaybackRate(rate);
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
  };

  // ⭐ Phase 11-2: 인라인 플레이어 녹취 다운로드
  const handleInlineDownloadClick = (consultation: any) => {
    // 경고 모달 열기
    setPendingDownloadConsultation(consultation);
  };

  const confirmInlineDownload = () => {
    if (!pendingDownloadConsultation) return;

    // Mock 녹취 텍스트 생성
    const recordingText = `
[CALL:ACT 녹취록]
========================================
상담 ID: ${pendingDownloadConsultation.id}
상담사: ${pendingDownloadConsultation.agent}
고객: ${pendingDownloadConsultation.customer}
카테고리: ${pendingDownloadConsultation.category}
일시: ${pendingDownloadConsultation.datetime}
통화 시간: ${pendingDownloadConsultation.duration}
========================================

[상담 내용]
${pendingDownloadConsultation.content}

[메모]
${pendingDownloadConsultation.memo || '메모 없음'}

========================================
FCR 달성: ${pendingDownloadConsultation.fcr ? '예' : '아니오'}
우수사례: ${pendingDownloadConsultation.isBestPractice ? '예' : '아니오'}
========================================

⚠️ 보안 주의사항:
본 녹취록은 개인정보 및 금융거래정보를 포함하고 있습니다.
- 법적 의무 보관 기간: 5년
- 개인정보 보호법 및 금융실명법 준수 필수
- 무단 유출 시 법적 처벌 대상
- 업무 목적 외 사용 절대 금지

본 녹취록은 CALL:ACT 시스템에서 자동 생성되었습니다.
생성 일시: ${new Date().toLocaleString('ko-KR')}
다운로드 사용자: [시스템에 자동 기록됨]
    `.trim();

    // Blob 생성 및 다운로드
    const blob = new Blob([recordingText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const fileName = `녹취록_${pendingDownloadConsultation.id}_${new Date().toISOString().split('T')[0]}.txt`;
    link.download = fileName;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // ⭐ Phase 12-1: 다운로드 이력 기록 (localStorage)
    // TODO: 백엔드 구현 시 API 호출로 변경 (/api/recordings/download-log)
    try {
      const downloadLog = {
        id: crypto.randomUUID(),
        consultation_id: pendingDownloadConsultation.id,
        consultation_category: pendingDownloadConsultation.category,
        customer_name: pendingDownloadConsultation.customer,
        downloaded_by: 'EMP001', // TODO: 실제 로그인 사용자 ID로 변경
        downloaded_by_name: '홍길동', // TODO: 실제 로그인 사용자 이름으로 변경
        download_type: 'txt',
        file_name: fileName,
        file_size: blob.size,
        download_ip: 'localhost', // 프론트엔드에서는 실제 IP 알 수 없음 (백엔드에서 처리)
        user_agent: navigator.userAgent,
        downloaded_at: new Date().toISOString()
      };

      // 기존 로그 가져오기
      const existingLogs = JSON.parse(localStorage.getItem('downloadLogs') || '[]');
      
      // 새 로그 추가 (최신 로그가 앞에 오도록)
      existingLogs.unshift(downloadLog);
      
      // 저장 (최대 500개만 유지)
      localStorage.setItem('downloadLogs', JSON.stringify(existingLogs.slice(0, 500)));

      console.log('✅ 다운로드 이력 기록 완료:', downloadLog);
      
      // Toast 메시지 제거 - 브라우저 다운로드 동작으로 충분
      // showSuccess('녹취 파일이 다운로드되었습니다. 이력이 기록되었습니다.');
    } catch (error) {
      console.error(' 다운로드 이력 기록 실패:', error);
      // 로그 기록 실패해도 다운로드는 완료됨
    }

    // 상태 초기화
    setPendingDownloadConsultation(null);
  };

  // 우수사례 토글 기능
  const toggleBestPractice = (id: string) => {
    setConsultations(prev => 
      prev.map(c => 
        c.id === id ? { ...c, isBestPractice: !c.isBestPractice } : c
      )
    );
    // 교육 시뮬레이션 자료로 등록되었다는 알림 표시
    const consultation = consultations.find(c => c.id === id);
    if (consultation?.isBestPractice) {
      showInfo('우수사례에서 제외되었습니다.');
    } else {
      showSuccess('교육 시뮬레이션 자료로 등록되었습니다!');
    }
  };

  // 일괄 우수사례 등록
  const handleBulkBestPractice = () => {
    setConsultations(prev =>
      prev.map(c =>
        selectedRows.includes(c.id) ? { ...c, isBestPractice: true } : c
      )
    );
    showSuccess(`${selectedRows.length}개의 상담이 교육 시뮬레이션 자료로 등록되었습니다!`);
    setSelectedRows([]);
  };

  // ⭐ Phase 14: 엑셀 다운로드 요청
  const handleExcelDownloadRequest = () => {
    setIsExcelDownloadModalOpen(true);
  };

  // ⭐ Phase 14: 엑셀 다운로드 확인
  const handleExcelDownloadConfirm = () => {
    const filterInfo = [];
    if (filters.team !== '전체') filterInfo.push(filters.team);
    if (filters.categoryMain !== '전체') filterInfo.push(filters.categoryMain);
    if (filters.categorySub !== '전체') filterInfo.push(filters.categorySub);
    if (filters.status !== '전체') filterInfo.push(filters.status);
    const filterString = filterInfo.length > 0 ? filterInfo.join('_') : undefined;

    // 엑셀 다운로드 실행
    downloadConsultationsExcel(
      filteredConsultations.map(item => ({
        id: item.id,
        agent: item.agent,
        customer: item.customer,
        category: item.category,
        status: item.status,
        content: item.content,
        datetime: item.datetime,
        duration: item.duration,
        fcr: item.fcr,
        memo: item.memo || ''
      })),
      filterString
    );

    // 로그 기록
    logExcelDownload({
      user: '관리자', // TODO: 실제 사용자 정보로 교체
      role: 'admin',
      downloadType: 'consultation_excel',
      filter: {
        dateRange: filters.dateRange?.from && filters.dateRange?.to 
          ? `${format(filters.dateRange.from, 'yyyy-MM-dd')} ~ ${format(filters.dateRange.to, 'yyyy-MM-dd')}`
          : undefined,
        team: filters.team !== '전체' ? filters.team : undefined,
        category: filters.categoryMain !== '전체' ? filters.categoryMain : undefined,
        agent: filters.agent !== '전체' ? filters.agent : undefined,
        status: filters.status !== '전체' ? filters.status : undefined,
      },
      recordCount: filteredConsultations.length
    });

    showSuccess(`${filteredConsultations.length}건의 상담 내역이 다운로드되었습니다.`);
    setIsExcelDownloadModalOpen(false);
  };

  // 필터 적용
  const filteredConsultations = useMemo(() => {
    return consultations.filter(item => {
      const matchesAgent = filters.agent === '전체' || item.agent === filters.agent;
      const matchesCategoryMain = filters.categoryMain === '전체' || item.categoryMain === filters.categoryMain;
      const matchesCategorySub = filters.categorySub === '전체' || item.categorySub === filters.categorySub;
      const matchesStatus = filters.status === '전체' || item.status === filters.status;
      const matchesDateFrom = !filters.dateRange?.from || item.datetime >= format(filters.dateRange.from, 'yyyy-MM-dd');
      const matchesDateTo = !filters.dateRange?.to || item.datetime <= format(filters.dateRange.to, 'yyyy-MM-dd') + ' 23:59';
      const matchesTeam = filters.team === '전체' || item.team === filters.team;
      const matchesSearchTerm = filters.searchTerm === '' || item.content.toLowerCase().includes(filters.searchTerm.toLowerCase());
      
      return matchesAgent && matchesCategoryMain && matchesCategorySub && matchesStatus && matchesDateFrom && matchesDateTo && matchesTeam && matchesSearchTerm;
    });
  }, [consultations, filters]);

  // ⭐ Phase 16-3: 동적 필터 옵션 생성 (실제 데이터에서 추출)
  const dynamicFilterOptions = useMemo(() => {
    // 팀 목록 (중복 제거 및 정렬)
    const teams = Array.from(new Set(consultations.map(c => c.team))).sort();
    
    // 상담사 목록 (중복 제거 및 정렬)
    const agents = Array.from(new Set(consultations.map(c => c.agent))).sort();
    
    // 대분류 목록 (중복 제거 및 정렬)
    const categoryMains = Array.from(new Set(consultations.map(c => c.categoryMain))).sort();
    
    // 중분류 목록 (선택된 대분류에 따라 필터링)
    const categorySubs = filters.categoryMain === '전체'
      ? []
      : Array.from(
          new Set(
            consultations
              .filter(c => c.categoryMain === filters.categoryMain)
              .map(c => c.categorySub)
          )
        ).sort();
    
    return { teams, agents, categoryMains, categorySubs };
  }, [consultations, filters.categoryMain]);

  return (
    <MainLayout>
      <div className="h-[calc(100vh-60px)] flex flex-col p-3 gap-3 bg-[#F5F5F5] overflow-hidden">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-[#E0E0E0] p-3 flex-shrink-0">
          <h1 className="text-lg font-bold text-[#333333]">상담 관리</h1>
        </div>

        {/* 필터 바 */}
        <div className="bg-white rounded-lg shadow-sm border border-[#E0E0E0] p-3 flex-shrink-0">
          <div className="flex flex-col gap-2">
            {/* ⭐ 검색창 + 기간 선택 (1행으로 통합) */}
            <div className="flex items-center gap-2">
              <div className="relative flex-[2]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#999999]" />
                <input
                  type="text"
                  placeholder="상담 ID, 고객명, 상담 내용 검색..."
                  value={filters.searchTerm}
                  onChange={(e) => setFilters({...filters, searchTerm: e.target.value})}
                  className="w-full h-8 pl-10 pr-3 border border-[#E0E0E0] rounded text-xs placeholder:text-[#999999]"
                />
              </div>
              <div className="flex-[3] flex justify-end">
                <DateRangePicker
                  value={filters.dateRange}
                  onChange={(dateRange) => setFilters({...filters, dateRange: dateRange || { from: undefined, to: undefined }})}
                />
              </div>
            </div>
            
            {/* ⭐ 팀/상담사/카테고리/상태 + 결과 건수 (1행으로 통합) */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 flex-[2]">
                <select 
                  className="h-8 px-3 border border-[#E0E0E0] rounded text-xs min-w-[120px]"
                  value={filters.team}
                  onChange={(e) => setFilters({...filters, team: e.target.value})}
                >
                  <option value="전체">전체 팀</option>
                  {dynamicFilterOptions.teams.map(team => (
                    <option key={team}>{team}</option>
                  ))}
                </select>

                <select 
                  className="h-8 px-3 border border-[#E0E0E0] rounded text-xs min-w-[120px]"
                  value={filters.agent}
                  onChange={(e) => setFilters({...filters, agent: e.target.value})}
                >
                  <option value="전체">전체 상담사</option>
                  {dynamicFilterOptions.agents.map(agent => (
                    <option key={agent}>{agent}</option>
                  ))}
                </select>

                <select 
                  className="h-8 px-3 border border-[#E0E0E0] rounded text-xs min-w-[130px]"
                  value={filters.categoryMain}
                  onChange={(e) => setFilters({...filters, categoryMain: e.target.value, categorySub: '전체'})}
                >
                  <option value="전체">전체 카테고리 대</option>
                  {dynamicFilterOptions.categoryMains.map(categoryMain => (
                    <option key={categoryMain}>{categoryMain}</option>
                  ))}
                </select>

                <select 
                  className="h-8 px-3 border border-[#E0E0E0] rounded text-xs min-w-[130px]"
                  value={filters.categorySub}
                  onChange={(e) => setFilters({...filters, categorySub: e.target.value})}
                  disabled={filters.categoryMain === '전체'}
                >
                  <option value="전체">전체 카테고리 중</option>
                  {dynamicFilterOptions.categorySubs.map((categorySub) => (
                    <option key={categorySub}>{categorySub}</option>
                  ))}
                </select>

                <div className="flex gap-2">
                  {['전체', '완료', '진행중', '미완료'].map((status) => (
                    <button
                      key={status}
                      onClick={() => setFilters({...filters, status})}
                      className={`h-8 px-4 rounded text-xs font-medium transition-colors whitespace-nowrap ${
                        filters.status === status
                          ? 'bg-[#0047AB] text-white'
                          : 'bg-[#F5F5F5] text-[#666666] hover:bg-[#E0E0E0]'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex-[3] flex items-center gap-3 justify-end">
                {/* ⭐ Phase 14: 엑셀 다운로드 버튼 */}
                <Button
                  onClick={handleExcelDownloadRequest}
                  className="h-8 px-3 bg-[#34A853] hover:bg-[#2E7D32] text-white text-xs"
                  disabled={filteredConsultations.length === 0}
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 mr-1.5" />
                  엑셀 다운로드
                </Button>
                <div className="text-xs text-[#666666] font-bold whitespace-nowrap">
                  {isLoadingConsultations ? '로딩 중...' : `전체 ${totalCount.toLocaleString()}건 중 ${filteredConsultations.length.toLocaleString()}건`}
                </div>
              </div>
            </div>
          </div>

          {/* 일괄 작업 바 */}
          {selectedRows.length > 0 && (
            <div className="flex items-center justify-between pt-3 mt-3 border-t border-[#E0E0E0]">
              <span className="text-xs text-[#666666]">{selectedRows.length}개 선택됨</span>
              <Button 
                onClick={handleBulkBestPractice}
                className="bg-[#FBBC04] hover:bg-[#E0A800] text-white h-8 text-xs"
              >
                <Star className="w-3.5 h-3.5 mr-1.5" />
                우수 사례 일괄 등록
              </Button>
            </div>
          )}
        </div>

        {/* 상담 테이블 */}
        <div className="flex-1 bg-white rounded-lg shadow-sm border border-[#E0E0E0] flex flex-col overflow-hidden min-h-0">
          <div ref={tableContainerRef} className="flex-1 overflow-y-auto">
            <table className="w-full">
              <thead className="border-b-2 border-[#E0E0E0] sticky top-0 bg-white z-10">
                <tr>
                  <th className="text-center text-xs font-semibold text-[#666666] px-3 py-3 min-w-[50px] w-[50px]">
                    <input 
                      type="checkbox"
                      checked={selectedRows.length === filteredConsultations.length && filteredConsultations.length > 0}
                      onChange={handleSelectAll}
                      className="w-4 h-4 cursor-pointer"
                    />
                  </th>
                  <th className="text-center text-xs font-semibold text-[#666666] px-3 py-3 min-w-[110px] w-[110px]">상담 ID</th>
                  <th className="text-center text-xs font-semibold text-[#666666] px-3 py-3 min-w-[70px] w-[70px]">상태</th>
                  <th className="text-center text-xs font-semibold text-[#666666] px-3 py-3 min-w-[85px] w-[85px]">카테고리 대</th>
                  <th className="text-center text-xs font-semibold text-[#666666] px-3 py-3 min-w-[100px] w-[100px]">카테고리 중</th>
                  <th className="text-left text-xs font-semibold text-[#666666] px-3 py-3 min-w-[200px]">상담 내용</th>
                  <th className="text-center text-xs font-semibold text-[#666666] px-3 py-3 min-w-[70px] w-[70px]">고객명</th>
                  <th className="text-center text-xs font-semibold text-[#666666] px-3 py-3 min-w-[70px] w-[70px]">상담사</th>
                  <th className="text-center text-xs font-semibold text-[#666666] px-3 py-3 min-w-[110px] w-[110px]">일시</th>
                  <th className="text-center text-xs font-semibold text-[#666666] px-3 py-3 min-w-[80px] w-[80px]">통화시간</th>
                  <th className="text-center text-xs font-semibold text-[#666666] px-3 py-3 min-w-[50px] w-[50px]">FCR</th>
                  <th className="text-center text-xs font-semibold text-[#666666] px-3 py-3 min-w-[60px] w-[60px]">재생</th>
                  <th className="text-center text-xs font-semibold text-[#666666] px-3 py-3 min-w-[60px] w-[60px]">상세</th>
                  <th className="text-center text-xs font-semibold text-[#666666] px-3 py-3 min-w-[90px] w-[90px]">우수사례</th>
                </tr>
              </thead>
              <tbody>
                {filteredConsultations.flatMap((item) => {
                  const dateTime = item.datetime.split(' ');
                  const date = dateTime[0];
                  const time = dateTime[1];
                  const rows = [
                    <tr 
                      key={item.id}
                      className={`border-b border-[#F0F0F0] hover:bg-[#F8F9FA] transition-all ${
                        playingRow === item.id ? 'bg-[#F8F9FA]' : ''
                      }`}
                    >
                      <td className="px-3 py-3 text-center">
                        <input 
                          type="checkbox"
                          checked={selectedRows.includes(item.id)}
                          onChange={() => handleRowSelect(item.id)}
                          className="w-4 h-4 cursor-pointer"
                        />
                      </td>
                      <td className="px-3 py-2 text-center">
                        <span className="text-xs text-[#0047AB] font-mono font-semibold whitespace-nowrap">{item.id}</span>
                      </td>
                      <td className="px-3 py-2 text-center">
                        <span className={`text-xs px-2 py-1 rounded inline-block whitespace-nowrap font-medium ${
                          item.status === '완료' ? 'bg-[#E8F5E9] text-[#34A853]' :
                          item.status === '진행중' ? 'bg-[#E3F2FD] text-[#0047AB]' :
                          'bg-[#FFEBEE] text-[#EA4335]'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-center">
                        <span className="text-[11px] px-2 py-1 bg-[#0047AB]/10 text-[#0047AB] rounded inline-block whitespace-nowrap font-medium">
                          {item.categoryMain}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-center">
                        <span className="text-[11px] px-2 py-1 bg-[#E8F1FC] text-[#0047AB] rounded inline-block whitespace-nowrap">
                          {item.categorySub}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-xs text-[#333333]">{item.content}</td>
                      <td className="px-3 py-2 text-xs text-[#666666] text-center whitespace-nowrap">{item.customer}</td>
                      <td className="px-3 py-2 text-xs text-[#666666] text-center whitespace-nowrap">{item.agent}</td>
                      <td className="px-3 py-2 text-center">
                        <div className="text-xs text-[#666666] whitespace-nowrap">
                          <div className="font-medium">{date}</div>
                          <div className="text-[10px] text-[#999999] font-mono">{time}</div>
                        </div>
                      </td>
                      <td className="px-3 py-2 text-xs text-[#666666] text-center whitespace-nowrap font-mono">{item.duration}</td>
                      <td className="px-3 py-2 text-center">
                        {item.fcr ? (
                          <div className="w-5 h-5 bg-[#34A853] text-white rounded-full flex items-center justify-center mx-auto text-xs">
                            ✓
                          </div>
                        ) : (
                          <span className="text-xs text-[#999999]">-</span>
                        )}
                      </td>
                      <td className="px-3 py-3 text-center">
                        <button 
                          onClick={() => handlePlayClick(item.id)}
                          className="w-6 h-6 flex items-center justify-center hover:bg-[#E8F1FC] rounded transition-colors mx-auto"
                        >
                          <Play className="w-3.5 h-3.5 text-[#0047AB]"/>
                        </button>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <button 
                          onClick={() => {
                            setSelectedConsultation(item);
                            setIsConsultationModalOpen(true);
                          }}
                          className="w-6 h-6 flex items-center justify-center hover:bg-[#E8F1FC] rounded transition-colors mx-auto"
                        >
                          <Eye className="w-3.5 h-3.5 text-[#0047AB]"/>
                        </button>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <button 
                          onClick={() => toggleBestPractice(item.id)}
                          className="w-6 h-6 flex items-center justify-center hover:bg-[#FFF9E6] rounded transition-colors mx-auto"
                        >
                          {item.isBestPractice ? (
                            <Star className="w-3.5 h-3.5 text-[#FBBC04] fill-current"/>
                          ) : (
                            <StarOff className="w-3.5 h-3.5 text-[#999999]"/>
                          )}
                        </button>
                      </td>
                    </tr>
                  ];
                  
                  if (playingRow === item.id) {
                    rows.push(
                      <tr key={`${item.id}-player`}>
                        <td colSpan={14} className="px-3 pb-2">
                          <div className="bg-[#F8F8F8] rounded p-2.5 flex items-center gap-2">
                            <button 
                              onClick={togglePlayPause}
                              className="w-6 h-6 rounded-full bg-[#0047AB] flex items-center justify-center hover:bg-[#003580] transition-colors flex-shrink-0"
                            >
                              {isPlaying ? (
                                <Pause className="w-3 h-3 text-white"/>
                              ) : (
                                <Play className="w-3 h-3 text-white ml-0.5"/>
                              )}
                            </button>
                            
                            <div className="flex-1">
                              <input
                                type="range"
                                min="0"
                                max={duration}
                                value={currentTime}
                                onChange={handleSeek}
                                className="w-full h-0.5 bg-[#E0E0E0] rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:bg-[#0047AB] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
                              />
                            </div>
                            
                            <span className="text-[10px] text-[#666666] flex-shrink-0 font-mono">
                              {formatTime(currentTime)} / {formatTime(duration)}
                            </span>
                            
                            <button 
                              onClick={() => handleInlineDownloadClick(item)}
                              className="w-4 h-4 flex items-center justify-center hover:bg-[#E0E0E0] rounded transition-colors flex-shrink-0"
                            >
                              <Download className="w-3 h-3 text-[#666666]"/>
                            </button>
                            
                            <select 
                              className="h-6 text-[10px] bg-transparent border-none text-[#666666] cursor-pointer flex-shrink-0"
                              value={playbackRate}
                              onChange={handlePlaybackRateChange}
                            >
                              <option>1x</option>
                              <option>1.5x</option>
                              <option>2x</option>
                            </select>
                          </div>
                        </td>
                      </tr>
                    );
                  }
                  
                  return rows;
                })}
                {/* 로딩 표시 및 더보기 */}
                {(isLoadingMore || hasMore) && (
                  <tr>
                    <td colSpan={14} className="py-4 text-center">
                      {isLoadingMore ? (
                        <div className="flex items-center justify-center">
                          <Loader2 className="w-4 h-4 animate-spin text-[#0047AB] mr-2" />
                          <span className="text-xs text-[#666666]">더 불러오는 중...</span>
                        </div>
                      ) : hasMore ? (
                        <span className="text-xs text-[#999999]">스크롤하여 더 보기</span>
                      ) : null}
                    </td>
                  </tr>
                )}
                {!hasMore && consultations.length > 0 && (
                  <tr>
                    <td colSpan={14} className="py-3 text-center">
                      <span className="text-xs text-[#999999]">모든 데이터를 불러왔습니다</span>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <ConsultationDetailModal
        isOpen={isConsultationModalOpen}
        onClose={() => setIsConsultationModalOpen(false)}
        consultation={selectedConsultation}
      />
      
      {/* 실제 오디오 엘리먼트 (숨김) */}
      {playingRow && (
        <audio 
          ref={audioRef} 
          src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
          preload="metadata"
        />
      )}
      
      {/* 인라인 녹취 다운로드 경고 모달 */}
      <InlineRecordingDownloadWarningModal
        isOpen={pendingDownloadConsultation !== null}
        onClose={() => setPendingDownloadConsultation(null)}
        onConfirm={confirmInlineDownload}
        consultation={pendingDownloadConsultation}
      />

      {/* ⭐ Phase 14: 엑셀 다운로드 경고 모달 */}
      <ExcelDownloadWarningModal
        isOpen={isExcelDownloadModalOpen}
        onClose={() => setIsExcelDownloadModalOpen(false)}
        onConfirm={handleExcelDownloadConfirm}
        recordCount={filteredConsultations.length}
        filterInfo={
          [
            filters.team !== '전체' ? filters.team : null,
            filters.categoryMain !== '전체' ? filters.categoryMain : null,
            filters.categorySub !== '전체' ? filters.categorySub : null,
            filters.status !== '전체' ? filters.status : null
          ].filter(Boolean).join(', ') || '필터 없음'
        }
      />
    </MainLayout>
  );
}