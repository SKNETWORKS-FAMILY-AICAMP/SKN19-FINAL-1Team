import { AlertTriangle, X } from 'lucide-react';
import { Button } from '../ui/button';
import { logRecordingDownload } from '@/utils/recordingDownloadLogger';
import { showSuccess } from '@/utils/toast';

interface RecordingDownloadWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  consultation: any;
  detailData: any;
}

export default function RecordingDownloadWarningModal({ 
  isOpen, 
  onClose,
  consultation,
  detailData
}: RecordingDownloadWarningModalProps) {
  if (!isOpen) return null;

  // ⭐ 실제 다운로드 처리
  const handleConfirmDownload = () => {
    // Mock 녹취 텍스트 생성
    const recordingText = `
[CALL:ACT 녹취록]
========================================
상담 ID: ${consultation.id}
상담사: ${consultation.agent || '정보 없음'}
고객: ${detailData.customerName}
카테고리: ${consultation.category}
일시: ${detailData.startTime} - ${detailData.endTime}
통화 시간: ${detailData.duration}
========================================

[상담 요약]
${detailData.summary}

[처리 내역]
${detailData.actions.map((action, index) => `${index + 1}. [${action.time}] ${action.action}`).join('\n')}

[참조 문서]
${detailData.documents.map((doc, index) => `${index + 1}. ${doc.title}`).join('\n')}

========================================
고객 만족도: ${detailData.satisfaction}/5
FCR 달성: ${consultation.fcr ? '예' : '아니오'}
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

    // Blob 생성
    const blob = new Blob([recordingText], { type: 'text/plain;charset=utf-8' });
    
    // 다운로드 링크 생성
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `녹취록_${consultation.id}_${new Date().toISOString().split('T')[0]}.txt`;
    
    // 다운로드 실행
    document.body.appendChild(link);
    link.click();
    
    // 정리
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // ⭐ 다운로드 로그 기록
    logRecordingDownload({
      consultation_id: consultation.id,
      download_type: 'txt',
      file_name: `녹취록_${consultation.id}_${new Date().toISOString().split('T')[0]}.txt`
    });

    // 성공 메시지 표시
    showSuccess('녹취 파일이 성공적으로 다운로드되었습니다.');

    onClose();
  };

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
              onClick={handleConfirmDownload}
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