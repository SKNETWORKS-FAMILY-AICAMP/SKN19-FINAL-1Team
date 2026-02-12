/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * CALL:ACT - 참조 문서 전체보기 모달
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * 참조 문서 더보기 버튼 → 모달
 * - 통화 종료 확인 모달과 동일한 디자인
 * - 깔끔하고 고급스러운 스타일
 * 
 * @version 2.0
 * @since Phase 11
 */

import { X, FileText } from 'lucide-react';
import { useEffect } from 'react';
import { Button } from '../ui/button';

export interface Document {
  id: string;
  title: string;
  category: string;
  content?: string;
}

interface ReferencedDocumentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  documents: Document[];
  onDocumentClick: (doc: Document) => void;
}

export default function ReferencedDocumentsModal({
  isOpen,
  onClose,
  documents,
  onDocumentClick,
}: ReferencedDocumentsModalProps) {
  // ESC 키로 닫기
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.key === 'Escape' || event.key === 'Enter') && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[80] p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        {/* 모달 헤더 - 통화 종료 모달과 동일한 스타일 */}
        <div className="bg-gradient-to-r from-[#0047AB] to-[#003580] text-white p-4 rounded-t-lg flex items-center justify-between">
          <div className="flex-1">
            <h2 className="text-base font-bold mb-1">검색한 참조 문서</h2>
            <p className="text-xs opacity-90">총 {documents.length}개의 문서가 참조되었습니다</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 모달 바디 */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-2 gap-3">
            {documents.map((doc) => (
              <button
                key={doc.id}
                onClick={() => {
                  onDocumentClick(doc);
                  // ⭐ onClose() 제거 - 문서 상세보기에서 ESC로 닫으면 리스트로 돌아오도록
                }}
                className="flex items-center gap-2 text-left p-3 border border-[#E0E0E0] rounded-md hover:border-[#0047AB] hover:bg-[#F0F7FF] transition-colors"
              >
                <FileText className="w-4 h-4 text-[#0047AB] flex-shrink-0" />
                <span className="text-[10px] text-[#333333] line-clamp-2">{doc.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 모달 푸터 */}
        <div className="border-t border-[#E0E0E0] p-4 flex justify-end gap-2">
          <Button 
            onClick={onClose}
            className="bg-[#0047AB] text-white hover:bg-[#003580] h-9 text-xs"
          >
            확인
          </Button>
        </div>
      </div>
    </div>
  );
}