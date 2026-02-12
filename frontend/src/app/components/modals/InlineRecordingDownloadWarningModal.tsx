import { AlertTriangle, X } from 'lucide-react';
import { Button } from '../ui/button';

interface InlineRecordingDownloadWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  consultation: any;
}

export default function InlineRecordingDownloadWarningModal({ 
  isOpen, 
  onClose,
  onConfirm,
  consultation
}: InlineRecordingDownloadWarningModalProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg w-full max-w-md shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#EA4335] to-[#D93025] p-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            <h2 className="text-base font-bold">녹취 파일 다운로드 주의사항</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-white hover:bg-white/20 p-1.5 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="bg-[#FFF9E6] border-l-4 border-[#FBBC04] p-4 mb-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-[#FBBC04] flex-shrink-0 mt-0.5" />
              <div className="text-sm text-[#666666]">
                <p className="font-bold text-[#333333] mb-1">📞 금융권 상담 녹취 보안 규정</p>
                <p className="text-xs leading-relaxed">
                  본 녹취 파일은 <span className="font-bold text-[#EA4335]">개인정보 및 금융거래정보</span>를 포함하고 있습니다.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3 mb-5">
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-[#0047AB] rounded-full mt-1.5 flex-shrink-0"></div>
              <p className="text-sm text-[#333333]">
                상담 녹취는 <span className="font-bold text-[#0047AB]">법적 의무 보관 기간 5년</span>이 적용됩니다
              </p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-[#0047AB] rounded-full mt-1.5 flex-shrink-0"></div>
              <p className="text-sm text-[#333333]">
                <span className="font-bold text-[#EA4335]">개인정보 보호법</span> 및 <span className="font-bold text-[#EA4335]">금융실명법</span> 준수 필수
              </p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-[#0047AB] rounded-full mt-1.5 flex-shrink-0"></div>
              <p className="text-sm text-[#333333]">
                무단 유출 시 <span className="font-bold text-[#EA4335]">5년 이하 징역 또는 5천만원 이하 벌금</span>
              </p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-[#0047AB] rounded-full mt-1.5 flex-shrink-0"></div>
              <p className="text-sm text-[#333333]">
                <span className="font-bold text-[#0047AB]">업무 목적 외 사용 절대 금지</span> (품질 평가, 교육 목적만 허용)
              </p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-[#0047AB] rounded-full mt-1.5 flex-shrink-0"></div>
              <p className="text-sm text-[#333333]">
                다운로드 이력은 <span className="font-bold text-[#0047AB]">시스템에 자동 기록</span>됩니다
              </p>
            </div>
          </div>

          <div className="bg-[#F8F9FA] rounded-lg p-3 mb-4">
            <p className="text-xs text-[#666666] leading-relaxed">
              위 사항을 숙지하고 동의하시는 경우에만 다운로드를 진행하시기 바랍니다.
              녹취 파일의 보안 관리는 다운로드하신 분의 책임입니다.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-2">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 h-10 text-sm"
            >
              취소
            </Button>
            <Button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="flex-1 h-10 text-sm bg-[#0047AB] hover:bg-[#003580]"
            >
              확인 후 다운로드
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}