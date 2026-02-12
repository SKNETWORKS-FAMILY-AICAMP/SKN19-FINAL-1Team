import { AlertTriangle, Download } from 'lucide-react';
import { Button } from '../ui/button';

interface ExcelDownloadWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  recordCount: number;
  filterInfo?: string;
}

export default function ExcelDownloadWarningModal({
  isOpen,
  onClose,
  onConfirm,
  recordCount,
  filterInfo
}: ExcelDownloadWarningModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6 animate-slideInFromTop">
        {/* 경고 아이콘 */}
        <div className="flex items-center justify-center mb-4">
          <div className="w-16 h-16 bg-[#FFF3E0] rounded-full flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-[#F57C00]" />
          </div>
        </div>

        {/* 제목 */}
        <h2 className="text-xl font-bold text-[#333333] text-center mb-3">
          엑셀 다운로드 경고
        </h2>

        {/* 경고 메시지 */}
        <div className="bg-[#FFF3E0] border-l-4 border-[#F57C00] rounded p-4 mb-4">
          <p className="text-sm text-[#333333] leading-relaxed mb-3">
            <strong className="text-[#F57C00]">개인정보가 포함된 상담 내역</strong>을 다운로드합니다.
          </p>
          <div className="text-xs text-[#666666] space-y-1">
            <p>• 다운로드 건수: <strong className="text-[#F57C00]">{recordCount}건</strong></p>
            {filterInfo && <p>• 필터 조건: {filterInfo}</p>}
            <p>• 다운로드 로그가 자동으로 기록됩니다</p>
            <p>• 무단 유출 시 법적 책임을 질 수 있습니다</p>
          </div>
        </div>

        {/* 주의사항 */}
        <div className="bg-[#F5F5F5] rounded p-3 mb-4">
          <p className="text-xs font-bold text-[#333333] mb-2">📋 주의사항</p>
          <ul className="text-xs text-[#666666] space-y-1 list-disc list-inside">
            <li>다운로드한 파일은 업무 목적으로만 사용하세요</li>
            <li>파일을 외부로 전송하거나 공유하지 마세요</li>
            <li>업무 완료 후 즉시 삭제하세요</li>
          </ul>
        </div>

        {/* 버튼 */}
        <div className="flex gap-3">
          <Button
            onClick={onClose}
            className="flex-1 h-10 bg-[#F5F5F5] text-[#333333] hover:bg-[#E0E0E0] border border-[#D1D5DB]"
          >
            취소
          </Button>
          <Button
            onClick={onConfirm}
            className="flex-1 h-10 bg-[#F57C00] text-white hover:bg-[#E65100]"
          >
            <Download className="w-4 h-4 mr-2" />
            다운로드
          </Button>
        </div>
      </div>
    </div>
  );
}
