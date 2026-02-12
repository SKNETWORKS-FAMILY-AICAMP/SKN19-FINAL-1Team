import { useEffect } from 'react';
import { formatNoticeContent } from '@/utils/textFormatter';

interface AnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
  announcement: {
    id: number;
    tag: string;
    title: string;
    date: string;
    content?: string;
    author?: string;
  };
}

export default function AnnouncementModal({ isOpen, onClose, announcement }: AnnouncementModalProps) {
  const getTagBgColor = (tag: string) => {
    switch (tag) {
      case '긴급':
        return 'bg-[#FFEBEE] text-[#EA4335]';
      case '시스템':
        return 'bg-[#FFF9E6] text-[#FBBC04]';
      default:
        return 'bg-[#E8F1FC] text-[#0047AB]';
    }
  };

  // ⭐ ESC 키 이벤트 리스너 추가
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
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
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg w-full max-w-2xl max-h-[80vh] overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-4 py-3 border-b border-[#E0E0E0]">
          <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold mb-1.5 ${getTagBgColor(announcement.tag)}`}>
            [{announcement.tag}]
          </span>
          <h2 className="text-base font-bold text-[#333333] mt-1">{announcement.title}</h2>
          
          <div className="flex items-center gap-3 mt-2 text-xs text-[#666666]">
            <span>작성자: {announcement.author || '운영팀'}</span>
            <span className="text-[#999999]">{announcement.date}</span>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 py-4 overflow-y-auto" style={{ maxHeight: 'calc(70vh - 180px)' }}>
          <div className="prose prose-sm max-w-none">
            {announcement.content ? (
              <div className="text-xs text-[#333333] leading-relaxed whitespace-pre-wrap">
                {formatNoticeContent(announcement.content)}
              </div>
            ) : (
              <div className="text-xs text-[#333333] leading-relaxed">
                <p className="mb-3">
                  {announcement.title}에 대한 상세 내용입니다.
                </p>
                <p className="mb-3">
                  이 공지사항은 모든 직원에게 중요한 정보를 담고 있습니다. 
                  자세한 내용은 관리자에게 문의하시기 바랍니다.
                </p>
                <ul className="list-disc list-inside space-y-1.5 mb-3">
                  <li>첫 번째 주요 사항</li>
                  <li>두 번째 주요 사항</li>
                  <li>세 번째 주요 사항</li>
                </ul>
                <p>
                  추가 문의사항이 있으시면 운영팀으로 연락 주시기 바랍니다.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-[#E0E0E0] flex justify-center">
          <button
            onClick={onClose}
            className="px-5 py-1.5 text-xs bg-[#0047AB] hover:bg-[#003580] text-white rounded-md transition-colors w-full sm:w-auto"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}