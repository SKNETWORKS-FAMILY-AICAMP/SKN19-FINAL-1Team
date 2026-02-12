import { useEffect, useState } from 'react';
import { FileText, ExternalLink } from 'lucide-react';
import DocumentDetailModal from './DocumentDetailModal';

interface FrequentInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  inquiry: {
    id: number;
    keyword: string;
    question: string;
    count: number;
    trend: 'up' | 'down' | 'same';
  };
  detailData: Array<{
    id: number;
    keyword: string;
    question: string;
    count: number;
    trend: 'up' | 'down' | 'same';
    content: string;
    relatedDocument: {
      title: string;
      regulation: string;
      summary: string;
      document_id: string;
    };
  }>;
}

export default function FrequentInquiryModal({ isOpen, onClose, inquiry, detailData }: FrequentInquiryModalProps) {
  // ⭐ 상세 데이터 찾기
  const detail = detailData.find(d => d.id === inquiry.id);
  
  // ⭐ 문서 상세 모달 상태
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);

  // ⭐ "보기" 버튼 클릭 핸들러
  const handleViewDocument = () => {
    if (detail?.relatedDocument.document_id) {
      setSelectedDocumentId(detail.relatedDocument.document_id);
      setIsDocumentModalOpen(true);
    }
  };

  // ⭐ FrequentInquiryModal이 열릴 때 DocumentDetailModal 상태 초기화
  useEffect(() => {
    if (isOpen) {
      setIsDocumentModalOpen(false);
      setSelectedDocumentId(null);
    }
  }, [isOpen]);

  // ⭐ ESC 키 이벤트 리스너 추가
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      // DocumentDetailModal이 열려있으면 FrequentInquiryModal의 ESC는 무시
      if (e.key === 'Escape' && isOpen && !isDocumentModalOpen) {
        onClose();
      }
    };

    if (isOpen) {
      window.document.addEventListener('keydown', handleEscape);
      // 모달 열릴 때 body 스크롤 잠금
      window.document.body.style.overflow = 'hidden';
    }

    return () => {
      window.document.removeEventListener('keydown', handleEscape);
      window.document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, isDocumentModalOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg w-full max-w-2xl max-h-[85vh] overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-4 py-3 border-b border-[#E0E0E0] bg-gradient-to-r from-[#F8FBFF] to-[#F0F7FF]">
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-[#E8F1FC] text-[#0047AB]">
              자주 찾는 문의
            </span>
            <span className="text-[10px] text-[#666666]">최근 인입 {inquiry.count}건</span>
          </div>
          <h2 className="text-base font-bold text-[#333333]">{inquiry.question}</h2>
        </div>

        {/* Content */}
        <div className="px-4 py-4 overflow-y-auto" style={{ maxHeight: 'calc(85vh - 200px)' }}>
          {/* 상세 내용 */}
          <div className="mb-4">
            <div className="text-xs text-[#333333] leading-relaxed whitespace-pre-wrap">
              {detail?.content}
            </div>
          </div>

          {/* 관련 문서 */}
          <div className="bg-[#F8FAFB] rounded-lg border border-[#E0E0E0] p-3">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-[#0047AB]" />
              <h3 className="text-xs font-bold text-[#333333]">관련 문서</h3>
            </div>
            
            <div className="space-y-2">
              <div className="bg-white rounded-md p-2.5 border border-[#E0E0E0]">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <h4 className="text-xs font-bold text-[#0047AB] mb-1">{detail?.relatedDocument.title}</h4>
                    <p className="text-[11px] text-[#666666] mb-1.5">{detail?.relatedDocument.summary}</p>
                    <div className="text-[10px] text-[#999999] italic">
                      근거 규정: {detail?.relatedDocument.regulation}
                    </div>
                  </div>
                  <button 
                    className="flex-shrink-0 flex items-center gap-1 px-2 py-1 rounded bg-[#E8F1FC] hover:bg-[#0047AB] text-[#0047AB] hover:text-white transition-colors text-[10px] font-medium"
                    title="문서 상세보기"
                    onClick={handleViewDocument}
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>보기</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-[#E0E0E0] flex justify-center bg-[#F8F9FA]">
          <button
            onClick={onClose}
            className="px-5 py-1.5 text-xs bg-[#0047AB] hover:bg-[#003580] text-white rounded-md transition-colors w-full sm:w-auto"
          >
            닫기
          </button>
        </div>
      </div>

      {/* 문서 상세 모달 */}
      {isDocumentModalOpen && selectedDocumentId && (
        <DocumentDetailModal
          isOpen={isDocumentModalOpen}
          onClose={() => setIsDocumentModalOpen(false)}
          documentId={selectedDocumentId}
        />
      )}
    </div>
  );
}