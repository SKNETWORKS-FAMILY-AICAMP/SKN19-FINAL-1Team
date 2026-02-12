import { Search, ChevronLeft, ChevronRight, FileText, Download, Filter, Eye, Loader2 } from 'lucide-react';
import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import MainLayout from '../components/layout/MainLayout';
import ConsultationDetailModal from '../components/modals/ConsultationDetailModal';
import ExcelDownloadWarningModal from '../components/modals/ExcelDownloadWarningModal';
import { consultationsData, categoryMapping } from '@/data/mock';
import { enrichConsultationData } from '../../data/consultationsDataHelper';
import { fetchConsultationsPaginated, type ConsultationItem } from '@/api/consultationApi';
import * as XLSX from 'xlsx';
import { toast } from 'sonner';
import { DateRangePicker } from '../components/ui/date-range-picker';
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

const PAGE_SIZE = 50; // 한 번에 로드할 개수

export default function ConsultationHistoryPage() {
  const [consultations, setConsultations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const tableContainerRef = useRef<HTMLDivElement>(null);

  // ⭐ 페이지네이션: 초기 로드
  const loadConsultations = useCallback(async (reset = false) => {
    try {
      if (reset) {
        setIsLoading(true);
        setConsultations([]);
      } else {
        setIsLoadingMore(true);
      }

      const offset = reset ? 0 : consultations.length;
      const result = await fetchConsultationsPaginated({ limit: PAGE_SIZE, offset });

      // 데이터 가공
      const enrichedData = result.data.map((c: ConsultationItem) => {
        const enriched = enrichConsultationData(c);
        return {
          ...enriched,
          date: enriched.datetime?.split(' ')[0] || '',
          time: enriched.datetime?.split(' ')[1] || ''
        };
      });

      if (reset) {
        setConsultations(enrichedData);
      } else {
        setConsultations(prev => [...prev, ...enrichedData]);
      }

      setTotalCount(result.total);
      setHasMore(result.hasMore);
    } catch (e) {
      console.error('Failed to load consultations', e);
      // fallback to mock
      if (consultations.length === 0) {
        const fallbackData = consultationsData.slice(0, PAGE_SIZE).map(c => {
          const enriched = enrichConsultationData(c);
          return {
            ...enriched,
            date: enriched.datetime.split(' ')[0],
            time: enriched.datetime.split(' ')[1]
          };
        });
        setConsultations(fallbackData);
        setTotalCount(consultationsData.length);
        setHasMore(consultationsData.length > PAGE_SIZE);
      }
    } finally {
      setIsLoading(false);
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
    // 스크롤이 하단 200px 이내에 도달하면 추가 로드
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
  const [selectedConsultation, setSelectedConsultation] = useState<any>(null);
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);
  const [isExcelDownloadWarningModalOpen, setIsExcelDownloadWarningModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('전체');
  
  // ⭐ Phase 16-1: 필터 확장 (카테고리 대/중, 날짜 범위 추가)
  const [filterCategoryMain, setFilterCategoryMain] = useState('전체 카테고리 대');
  const [filterCategorySub, setFilterCategorySub] = useState('전체 카테고리 중');
  const [dateRange, setDateRange] = useState<DateRange>({ from: undefined, to: undefined });

  // ⭐ Phase 16-3: 동적 필터 옵션 생성 (실제 데이터에서 추출)
  const dynamicFilterOptions = useMemo(() => {
    // 대분류 목록 (중복 제거 및 정렬)
    const categoryMains = Array.from(new Set(consultations.map(c => c.categoryMain))).sort();
    
    // 중분류 목록 (선택된 대분류에 따라 필터링)
    const categorySubs = filterCategoryMain === '전체 카테고리 대'
      ? []
      : Array.from(
          new Set(
            consultations
              .filter(c => c.categoryMain === filterCategoryMain)
              .map(c => c.categorySub)
          )
        ).sort();
    
    return { categoryMains, categorySubs };
  }, [consultations, filterCategoryMain]);

  const filteredConsultations = useMemo(() => {
    return consultations.filter(item => {
      const matchesSearch = item.customer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.categoryMain?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.categorySub?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.id?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === '전체' || item.status === filterStatus;
      const matchesCategoryMain = filterCategoryMain === '전체 카테고리 대' || item.categoryMain === filterCategoryMain;
      const matchesCategorySub = filterCategorySub === '전체 카테고리 중' || item.categorySub === filterCategorySub;
      const matchesDateFrom = !dateRange?.from || item.datetime >= format(dateRange.from, 'yyyy-MM-dd');
      const matchesDateTo = !dateRange?.to || item.datetime <= format(dateRange.to, 'yyyy-MM-dd') + ' 23:59';
      
      return matchesSearch && matchesStatus && matchesCategoryMain && matchesCategorySub && matchesDateFrom && matchesDateTo;
    });
  }, [consultations, searchTerm, filterStatus, filterCategoryMain, filterCategorySub, dateRange]);

  const handleConsultationClick = (consultation: any) => {
    setSelectedConsultation(consultation);
    setIsConsultationModalOpen(true);
  };

  // ⭐ 엑셀 다운로드 함수
  const handleExcelDownload = () => {
    try {
      // 1. 데이터 준비 (현재 필터링된 데이터)
      const excelData = filteredConsultations.map((item, index) => ({
        '번호': index + 1,
        '상담 ID': item.id,
        '고객 ID': item.customer_id || `CUST-${item.id.split('-')[1]}`,
        '카테고리': item.category,
        '상담사': item.agent,
        '상담 일시': item.datetime,
        '통화 시간': item.duration || '-',
        '상태': item.status,
        '상담 내용': item.content || item.memo || '-'
      }));

      // 2. 워크시트 생성
      const worksheet = XLSX.utils.json_to_sheet(excelData);

      // 3. 컬럼 너비 설정
      worksheet['!cols'] = [
        { wch: 5 },  // 번호
        { wch: 20 }, // 상담 ID
        { wch: 18 }, // 고객 ID
        { wch: 12 }, // 카테고리
        { wch: 10 }, // 상담사
        { wch: 18 }, // 상담 일시
        { wch: 10 }, // 통화 시간
        { wch: 8 },  // 상태
        { wch: 60 }  // 상담 내용
      ];

      // 4. 워크북 생성
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, '상담 내역');

      // 5. 파일명 생성 (YYYYMMDD_HHMMSS 형식)
      const now = new Date();
      const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
      const timeStr = now.toTimeString().slice(0, 8).replace(/:/g, '');
      const fileName = `상담내역_${dateStr}_${timeStr}.xlsx`;

      // 6. 다운로드
      XLSX.writeFile(workbook, fileName);

      // 7. 로그 기록 (localStorage)
      try {
        const downloadLog = {
          id: crypto.randomUUID(),
          consultation_id: 'BULK_EXPORT', // 일괄 다운로드
          consultation_category: '일괄 다운로드',
          customer_name: `${filteredConsultations.length}건`,
          downloaded_by: 'EMP001', // TODO: 실제 로그인 사용자
          downloaded_by_name: '홍길동',
          download_type: 'xlsx',
          file_name: fileName,
          file_size: 0, // Excel 파일 크기는 브라우저에서 알 수 없음
          download_ip: 'localhost',
          user_agent: navigator.userAgent,
          downloaded_at: new Date().toISOString()
        };

        const existingLogs = JSON.parse(localStorage.getItem('downloadLogs') || '[]');
        existingLogs.unshift(downloadLog);
        localStorage.setItem('downloadLogs', JSON.stringify(existingLogs.slice(0, 500)));

        console.log('✅ 엑셀 다운로드 이력 기록 완료:', downloadLog);
      } catch (error) {
        console.error('❌ 다운로드 이력 기록 실패:', error);
      }

      // Toast 메시지 제거 - 브라우저 다운로드 대화상자가 피드백 역할
      // toast.success(`상담 내역이 다운로드되었습니다. (${filteredConsultations.length}건)`);
    } catch (error) {
      console.error('엑셀 다운로드 오류:', error);
      toast.error('엑셀 다운로드에 실패했습니다.');
    }
  };

  return (
    <MainLayout>
      <div className="h-[calc(100vh-60px)] flex flex-col p-4 gap-3 bg-[#F5F5F5]">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-[#E0E0E0] p-3 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-base font-bold text-[#333333]">📋 상담 내역</h1>
              <p className="text-[11px] text-[#666666] mt-0.5">
                {isLoading ? '로딩 중...' : `전체 ${totalCount.toLocaleString()}건 중 ${filteredConsultations.length.toLocaleString()}건 표시`}
              </p>
            </div>
            <Button className="bg-[#0047AB] hover:bg-[#003580] h-8 text-xs" onClick={() => setIsExcelDownloadWarningModalOpen(true)}>
              <Download className="w-3.5 h-3.5 mr-1.5" />
              엑셀 다운로드
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-[#E0E0E0] p-3 flex-shrink-0">
          <div className="flex flex-col gap-2">
            {/* ⭐ Phase 16-1: 검색창 + 날짜 범위 (1행) */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#999999]" />
                <Input 
                  className="pl-9 h-8 text-xs placeholder:text-xs" 
                  placeholder="상담 ID, 고객명, 카테고리 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <DateRangePicker
                value={dateRange}
                onChange={(newDateRange) => setDateRange(newDateRange || { from: undefined, to: undefined })}
              />
            </div>

            {/* ⭐ Phase 16-1: 카테고리(대/중) + 상태 필터 (1행) */}
            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-[#666666]" />
              
              <select 
                className="h-8 px-3 border border-[#E0E0E0] rounded text-xs min-w-[130px]"
                value={filterCategoryMain}
                onChange={(e) => {
                  setFilterCategoryMain(e.target.value);
                  setFilterCategorySub('전체 카테고리 중');
                }}
              >
                <option value="전체 카테고리 대">전체 카테고리 대</option>
                {dynamicFilterOptions.categoryMains.map(categoryMain => (
                  <option key={categoryMain}>{categoryMain}</option>
                ))}
              </select>

              <select 
                className="h-8 px-3 border border-[#E0E0E0] rounded text-xs min-w-[130px]"
                value={filterCategorySub}
                onChange={(e) => setFilterCategorySub(e.target.value)}
                disabled={filterCategoryMain === '전체 카테고리 대'}
              >
                <option value="전체 카테고리 중">전체 카테고리 중</option>
                {dynamicFilterOptions.categorySubs.map(categorySub => (
                  <option key={categorySub}>{categorySub}</option>
                ))}
              </select>

              <div className="flex gap-2">
                {['전체', '완료', '진행중', '미완료'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`h-8 px-4 rounded text-xs font-medium transition-colors whitespace-nowrap ${
                      filterStatus === status
                        ? 'bg-[#0047AB] text-white'
                        : 'bg-[#F5F5F5] text-[#666666] hover:bg-[#E0E0E0]'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Consultations Table */}
        <div className="flex-1 bg-white rounded-lg shadow-sm border border-[#E0E0E0] overflow-hidden flex flex-col min-h-0">
          <div ref={tableContainerRef} className="flex-1 overflow-y-auto">
            <table className="w-full">
              <thead className="border-b-2 border-[#E0E0E0] sticky top-0 bg-white">
                <tr>
                  <th className="text-center text-xs font-semibold text-[#666666] px-2.5 py-2.5 w-[110px]">상담 ID</th>
                  <th className="text-center text-xs font-semibold text-[#666666] px-2 py-2.5 w-[70px]">상태</th>
                  <th className="text-center text-xs font-semibold text-[#666666] px-2 py-2.5 w-[75px]">카테고리 대</th>
                  <th className="text-center text-xs font-semibold text-[#666666] px-2 py-2.5 w-[100px]">카테고리 중</th>
                  <th className="text-left text-xs font-semibold text-[#666666] px-2.5 py-2.5">상담 내용</th>
                  <th className="text-center text-xs font-semibold text-[#666666] px-2 py-2.5 w-[70px]">고객명</th>
                  <th className="text-center text-xs font-semibold text-[#666666] px-2 py-2.5 w-[70px]">상담사</th>
                  <th className="text-center text-xs font-semibold text-[#666666] px-2 py-2.5 w-[95px]">일시</th>
                  <th className="text-center text-xs font-semibold text-[#666666] px-2 py-2.5 w-[70px]">통화시간</th>
                  <th className="text-center text-xs font-semibold text-[#666666] px-2 py-2.5 w-[50px]">FCR</th>
                  <th className="text-center text-xs font-semibold text-[#666666] px-2 py-2.5 w-[60px]">상세</th>
                </tr>
              </thead>
              <tbody>
                {filteredConsultations.map((consultation) => (
                  <tr 
                    key={consultation.id}
                    className="border-b border-[#F0F0F0] hover:bg-[#F8F9FA] cursor-pointer transition-colors"
                    onClick={() => handleConsultationClick(consultation)}
                  >
                    <td className="px-2.5 py-2.5 text-center">
                      <span className="text-xs font-mono font-semibold text-[#0047AB] whitespace-nowrap">{consultation.id}</span>
                    </td>
                    <td className="px-2 py-2.5 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium whitespace-nowrap ${
                        consultation.status === '완료' ? 'bg-[#E8F5E9] text-[#34A853]' :
                        consultation.status === '진행중' ? 'bg-[#E3F2FD] text-[#0047AB]' :
                        'bg-[#F5F5F5] text-[#999999]'
                      }`}>
                        {consultation.status}
                      </span>
                    </td>
                    <td className="px-2 py-2.5 text-center">
                      <span className="text-[11px] px-2 py-0.5 bg-[#0047AB]/10 text-[#0047AB] rounded inline-block whitespace-nowrap font-medium">
                        {consultation.categoryMain}
                      </span>
                    </td>
                    <td className="px-2 py-2.5 text-center">
                      <span className="text-[11px] px-2 py-0.5 bg-[#E8F1FC] text-[#0047AB] rounded inline-block whitespace-nowrap">
                        {consultation.categorySub}
                      </span>
                    </td>
                    <td className="px-2.5 py-2.5 text-xs text-[#333333] truncate max-w-[200px]">{consultation.content}</td>
                    <td className="px-2 py-2.5 text-xs text-[#666666] text-center">{consultation.customer}</td>
                    <td className="px-2 py-2.5 text-xs text-[#666666] text-center">{consultation.agent}</td>
                    <td className="px-2 py-2.5 text-center">
                      <div className="text-xs text-[#666666]">
                        <div className="font-medium">{consultation.date}</div>
                        <div className="text-[11px] text-[#999999] font-mono">{consultation.time}</div>
                      </div>
                    </td>
                    <td className="px-2 py-2.5 text-center text-xs text-[#666666] font-mono">{consultation.duration}</td>
                    <td className="px-2 py-2.5 text-center">
                      {consultation.fcr ? (
                        <div className="w-5 h-5 bg-[#34A853] text-white rounded-full flex items-center justify-center mx-auto text-xs">
                          ✓
                        </div>
                      ) : (
                        <span className="text-xs text-[#999999]">-</span>
                      )}
                    </td>
                    <td className="px-2 py-2.5 text-center">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleConsultationClick(consultation);
                        }}
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Button>
                    </td>
                  </tr>
                ))}
                {/* 로딩 표시 및 더보기 */}
                {(isLoadingMore || hasMore) && (
                  <tr>
                    <td colSpan={11} className="py-4 text-center">
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
                    <td colSpan={11} className="py-3 text-center">
                      <span className="text-xs text-[#999999]">모든 데이터를 불러왔습니다</span>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedConsultation && (
        <ConsultationDetailModal
          isOpen={isConsultationModalOpen}
          onClose={() => setIsConsultationModalOpen(false)}
          consultation={selectedConsultation}
        />
      )}

      {/* Excel Download Warning Modal */}
      <ExcelDownloadWarningModal
        isOpen={isExcelDownloadWarningModalOpen}
        onClose={() => setIsExcelDownloadWarningModalOpen(false)}
        onConfirm={handleExcelDownload}
        recordCount={filteredConsultations.length}
      />
    </MainLayout>
  );
}