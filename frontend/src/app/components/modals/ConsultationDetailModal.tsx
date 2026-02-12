import { Play, Pause, User, Clock, CheckCircle, FileText, Download, X, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { useState, useRef, useEffect } from 'react';
import { formatBirthDateWithAge } from '@/utils/age';
import DocumentDetailModal from './DocumentDetailModal';
import RecordingDownloadWarningModal from './RecordingDownloadWarningModal';
import { fetchConsultationDetail, type ConsultationDetail, USE_MOCK_DATA } from '@/api/consultationApi';

interface ConsultationDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  consultation: {
    id: string;
    status: string;
    category: string;
    categoryMain?: string;
    categorySub?: string;
    title?: string;
    customer: string;
    time?: string;
    fcr: boolean;
    agent?: string;
    duration?: string;
    memo?: string;
  };
}

export default function ConsultationDetailModal({ isOpen, onClose, consultation }: ConsultationDetailModalProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(327); // 5분 27초
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);
  const [isRecordingDownloadWarningModalOpen, setIsRecordingDownloadWarningModalOpen] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // ⭐ DB에서 가져온 상세 데이터 (Real 모드에서만 사용)
  const [detailFromDB, setDetailFromDB] = useState<ConsultationDetail | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

  // ⭐ 상담 상세 데이터 로드 (Real 모드에서만)
  useEffect(() => {
    // Mock 모드에서는 API 호출하지 않음
    if (USE_MOCK_DATA) {
      setDetailFromDB(null);
      return;
    }

    if (isOpen && consultation?.id) {
      setIsLoadingDetail(true);
      fetchConsultationDetail(consultation.id)
        .then((data) => {
          setDetailFromDB(data);
        })
        .finally(() => {
          setIsLoadingDetail(false);
        });
    } else {
      setDetailFromDB(null);
    }
  }, [isOpen, consultation?.id]);

  // ⭐ Phase 16-1: categoryMain/categorySub 파싱 (fallback)
  const getCategoryMain = () => {
    if (consultation.categoryMain) return consultation.categoryMain;
    const parts = consultation.category.split(' > ');
    return parts[0]?.trim() || '기타';
  };

  const getCategorySub = () => {
    if (consultation.categorySub) return consultation.categorySub;
    const parts = consultation.category.split(' > ');
    return parts[1]?.trim() || '서비스 이용방법 안내';
  };

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            setIsPlaying(false);
            return duration;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, duration]);

  // ⭐ ESC 키 이벤트 리스너 추가
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      // ⭐ Phase 10-6: DocumentDetailModal이 열려있으면 ConsultationDetailModal의 ESC는 무시
      if (e.key === 'Escape' && isOpen && !isDocumentModalOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // 모달 열릴 때 body 스크롤 잠금
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, isDocumentModalOpen, onClose]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseInt(e.target.value);
    setCurrentTime(newTime);
  };

  // ⭐ Phase 11-2: 녹취 다운로드 기능
  const handleDownloadRecording = () => {
    setIsRecordingDownloadWarningModalOpen(true);
  };

  if (!isOpen) return null;

  // ⭐ Mock 모드: 기존 하드코딩 데이터 사용
  // ⭐ Real 모드: DB에서 가져온 데이터 사용
  const db = detailFromDB;

  // Mock 데이터 (기존 하드코딩)
  const mockDetailData = {
    customerId: 'CUST-TEDDY-00001',
    customerName: consultation.customer,
    customerPhone: '010-1234-5678',
    customerBirthDate: '1982-05-15',
    customerAddress: '서울시 강남구 테헤란로 123',
    startTime: consultation.time || '14:32:15',
    endTime: '14:37:42',
    duration: consultation.duration || '5:27',
    summary: consultation.memo || consultation.title || '고객님께서 카드 분실 신고를 요청하셨습니다. 즉시 카드 사용을 정지 처리하였으며, 재발급 카드는 등록된 주소(서울시 강남구 테헤란로 123)로 3-5일 내 배송될 예정입니다.',
    actions: [
      { time: '14:32:30', action: '카드 분실 신고 접수' },
      { time: '14:33:15', action: '카드 사용 즉시 정지 처리' },
      { time: '14:34:20', action: '재발급 카드 신청 완료' },
      { time: '14:36:45', action: '배송 정보 안내 및 확인' },
      { time: '14:37:30', action: '상담 종료 및 만족도 확인' },
    ],
    documents: [
      {
        id: 'card-1-1-1',
        title: '카드 즉시 사용 정지',
        content: '고객의 카드 분실 신고 시 즉시 카드 사용을 정지하여 부정 사용을 방지합니다.'
      },
      {
        id: 'card-1-1-2',
        title: '분실 신고 접수 완료',
        content: '분실 신고가 정식으로 접수되었으며, 신고 번호가 발급됩니다.'
      },
      {
        id: 'card-1-1-3',
        title: '재발급 카드 신청',
        content: '분실 카드를 대체할 새로운 카드를 발급합니다.'
      },
    ],
    satisfaction: 5,
  };

  // Real 모드: DB 데이터 기반 생성 (processing_timeline 우선 사용)
  const getActionsFromDB = () => {
    // 1순위: processing_timeline (처리 내역)
    if (db?.processing_timeline && db.processing_timeline.length > 0) {
      return db.processing_timeline.map(item => ({
        time: item.time,
        action: item.action,
      }));
    }
    // 2순위: transcript에서 agent 메시지 추출 (fallback)
    if (db?.transcript?.messages && db.transcript.messages.length > 0) {
      return db.transcript.messages
        .filter(m => m.speaker === 'agent')
        .slice(0, 5)
        .map(m => ({ time: m.timestamp, action: m.message }));
    }
    return mockDetailData.actions;
  };

  const getDocumentsFromDB = () => {
    if (db?.referenced_documents && db.referenced_documents.length > 0) {
      return db.referenced_documents.map((doc, idx) => ({
        id: doc.doc_id || `doc-${idx}`,
        title: doc.title || `참조 문서 ${idx + 1}`,
        content: doc.doc_type || '문서',
      }));
    }
    return mockDetailData.documents;
  };

  // ⭐ Mock 모드면 mockDetailData 사용, Real 모드면 DB 데이터 사용
  const detailData = USE_MOCK_DATA ? mockDetailData : {
    customerId: db?.customer_id || mockDetailData.customerId,
    customerName: db?.customer_name || consultation.customer,
    customerPhone: db?.customer_phone || mockDetailData.customerPhone,
    customerBirthDate: db?.customer_birth_date || mockDetailData.customerBirthDate,
    customerAddress: db?.customer_address || mockDetailData.customerAddress,
    startTime: db?.call_time?.substring(0, 8) || consultation.time || mockDetailData.startTime,
    endTime: db?.call_end_time?.substring(0, 8) || mockDetailData.endTime,
    duration: db?.call_duration || consultation.duration || mockDetailData.duration,
    summary: db?.ai_summary || consultation.memo || consultation.title || mockDetailData.summary,
    actions: getActionsFromDB(),
    documents: getDocumentsFromDB(),
    satisfaction: db?.satisfaction_score || mockDetailData.satisfaction,
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg w-full max-w-[900px] max-h-[90vh] flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - 4K 스타일 */}
        <div className="bg-gradient-to-r from-[#0047AB] to-[#4A90E2] p-3 text-white flex-shrink-0">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-base font-bold mb-0.5">상담 상세 정보</h2>
              <p className="text-[11px] opacity-90 font-mono">{consultation.id}</p>
            </div>
            <button 
              onClick={onClose}
              className="text-white hover:bg-white/20 p-1.5 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Status Badge */}
          <div className="flex items-center gap-1.5 sm:gap-2 mt-2 flex-wrap">
            <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${
              consultation.status === '완료' ? 'bg-[#34A853]' :
              consultation.status === '진행중' ? 'bg-[#FBBC04]' :
              'bg-[#EA4335]'
            }`}>
              {consultation.status}
            </span>
            <span className="px-2 py-0.5 bg-white/20 rounded text-[11px] font-medium">
              {getCategoryMain()}
            </span>
            <span className="px-2 py-0.5 bg-white/30 rounded text-[11px] font-medium">
              {getCategorySub()}
            </span>
            {consultation.fcr && (
              <span className="px-2 py-0.5 bg-[#34A853] rounded text-[11px] font-medium flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                FCR 달성
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-2.5 sm:p-3">
          {/* 로딩 표시 (Real 모드에서만) */}
          {!USE_MOCK_DATA && isLoadingDetail && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-[#0047AB] mr-2" />
              <span className="text-sm text-[#666666]">상담 정보 로딩 중...</span>
            </div>
          )}
          {/* Basic Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mb-2 sm:mb-3">
            <div className="bg-[#F8F9FA] rounded-lg p-2.5 border border-[#E0E0E0]">
              <div className="flex items-center gap-2 mb-1.5">
                <User className="w-3.5 h-3.5 text-[#0047AB]" />
                <span className="text-[11px] font-semibold text-[#666666]">고객 정보</span>
              </div>

              {/* 1행: 이름 + ID (작게) */}
              <p className="text-xs font-bold text-[#333333] mb-0.5">
                {detailData.customerName} 
                <span className="text-[10px] text-[#999999] font-normal ml-2">ID: {detailData.customerId}</span>
              </p>
              
              {/* 2행: 전화번호 | 생년월일 */}
              <div className="grid grid-cols-2 gap-x-4 mb-0.5">
                <p className="text-[11px] text-[#666666]">전화번호: <span className="font-mono">{detailData.customerPhone}</span></p>
                <p className="text-[11px] text-[#666666]">생년월일: <span className="font-mono">{formatBirthDateWithAge(detailData.customerBirthDate)}</span></p>
              </div>

              {/* 3행: 주소 (전체 너비) */}
              <p className="text-[11px] text-[#666666] truncate" title={detailData.customerAddress}>주소: {detailData.customerAddress}</p>
            </div>

            <div className="bg-[#F8F9FA] rounded-lg p-2.5 border border-[#E0E0E0]">
              <div className="flex items-center gap-2 mb-1.5">
                <Clock className="w-3.5 h-3.5 text-[#0047AB]" />
                <span className="text-[11px] font-semibold text-[#666666]">상담 시간</span>
              </div>
              <p className="text-xs font-bold text-[#333333] mb-0.5">통화 시간: {detailData.duration}</p>
              <p className="text-[11px] text-[#666666]">시작: {detailData.startTime}</p>
              <p className="text-[11px] text-[#666666]">종료: {detailData.endTime}</p>
            </div>
          </div>

          {/* Recording Player - 4K 스타일 */}
          <div className="bg-white rounded-lg border border-[#E0E0E0] p-2.5 mb-2 sm:mb-3">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-3.5 h-3.5 text-[#0047AB]" />
              <span className="text-xs font-bold text-[#333333]">녹취 재생</span>
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-7 h-7 bg-[#0047AB] hover:bg-[#003580] rounded-full flex items-center justify-center transition-colors flex-shrink-0 self-start sm:self-auto"
              >
                {isPlaying ? (
                  <Pause className="w-3.5 h-3.5 text-white" />
                ) : (
                  <Play className="w-3.5 h-3.5 text-white ml-0.5" />
                )}
              </button>
              
              <div className="flex-1">
                <input
                  type="range"
                  min="0"
                  max={duration}
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full h-1.5 bg-[#E0E0E0] rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#0047AB]"
                />
                <div className="flex justify-between mt-0.5">
                  <span className="text-[10px] text-[#666666] font-mono">{formatTime(currentTime)}</span>
                  <span className="text-[10px] text-[#666666] font-mono">{formatTime(duration)}</span>
                </div>
              </div>

              <Button variant="outline" size="sm" className="h-7 text-[10px] px-2" onClick={handleDownloadRecording}>
                <Download className="w-3 h-3 mr-1" />
                다운로드
              </Button>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-[#F8FAFB] rounded-lg border border-[#E0E0E0] p-2.5 mb-2 sm:mb-3">
            <h3 className="text-xs font-bold text-[#333333] mb-1.5 flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-[#0047AB]" />
              상담 요약
            </h3>
            <p className="text-[11px] text-[#333333] leading-relaxed">
              {detailData.summary}
            </p>
          </div>

          {/* Action Timeline */}
          <div className="bg-white rounded-lg border border-[#E0E0E0] p-2.5 mb-2 sm:mb-3">
            <h3 className="text-xs font-bold text-[#333333] mb-2">처리 내역</h3>
            <div className="space-y-2">
              {detailData.actions.map((action, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-[#0047AB] rounded-full mt-1.5 flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-2">
                      <span className="text-[10px] text-[#999999] font-mono">{action.time}</span>
                      <span className="text-xs text-[#333333]">{action.action}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Referenced Documents - ⭐ Phase 10-6: DocumentDetailModal 사용 */}
          <div className="bg-white rounded-lg border border-[#E0E0E0] p-2.5">
            <h3 className="text-xs font-bold text-[#333333] mb-2">참조 문서</h3>
            <div className="space-y-1.5">
              {detailData.documents.map((doc, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSelectedDocumentId(doc.id);
                    setIsDocumentModalOpen(true);
                  }}
                  className="w-full flex items-center gap-2 p-1.5 rounded bg-[#F8F9FA] hover:bg-[#E8F1FC] transition-colors cursor-pointer text-left"
                >
                  <FileText className="w-3.5 h-3.5 text-[#0047AB] flex-shrink-0" />
                  <span className="text-xs text-[#333333]">{doc.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-[#E0E0E0] p-2.5 sm:p-3 bg-[#F8F9FA] flex-shrink-0">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-[#666666]">고객 만족도:</span>
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <span 
                    key={i}
                    className={`text-sm ${i < detailData.satisfaction ? 'text-[#FBBC04]' : 'text-[#E0E0E0]'}`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="text-xs font-bold text-[#0047AB]">{detailData.satisfaction}/5</span>
            </div>
            
            <Button onClick={onClose} className="bg-[#0047AB] hover:bg-[#003580] h-7 text-xs px-3 w-full sm:w-auto">
              닫기
            </Button>
          </div>
        </div>
      </div>

      {/* ⭐ Phase 10-6: 문서 상세 모달 */}
      {isDocumentModalOpen && selectedDocumentId && (
        <DocumentDetailModal
          isOpen={isDocumentModalOpen}
          onClose={() => {
            setIsDocumentModalOpen(false);
            setSelectedDocumentId(null);
          }}
          documentId={selectedDocumentId}
        />
      )}

      {/* ⭐ 녹취 다운로드 경고 모달 */}
      {isRecordingDownloadWarningModalOpen && (
        <RecordingDownloadWarningModal
          isOpen={isRecordingDownloadWarningModalOpen}
          onClose={() => setIsRecordingDownloadWarningModalOpen(false)}
          consultation={consultation}
          detailData={detailData}
        />
      )}
    </div>
  );
}