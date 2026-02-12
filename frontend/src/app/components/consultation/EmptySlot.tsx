// 빈 슬롯 컴포넌트 - 통화 시작 전 또는 데이터 로딩 중 표시

interface EmptySlotProps {
  type: 'keyword' | 'card' | 'customer' | 'guide' | 'stt' | 'memo';
  text?: string;
  isCallActive?: boolean;
}

export function EmptySlot({ type, text, isCallActive = false }: EmptySlotProps) {
  const defaultMessages = {
    keyword: isCallActive ? '키워드 추출 중...' : '통화 시작 후 키워드가 표시됩니다',
    card: isCallActive ? '정보 분석 중...' : '통화 시작 후 정보 카드가 표시됩니다',
    customer: isCallActive ? '고객 정보 조회 중...' : '통화 시작 후 고객 정보가 표시됩니다',
    guide: isCallActive ? '가이드 생성 중...' : '통화 시작 후 상담 가이드가 표시됩니다',
    stt: isCallActive ? '음성 분석 중...' : '통화 시작 후 실시간 음성이 표시됩니다',
    memo: '상담 메모를 입력하세요',
  };

  const message = text || defaultMessages[type];

  // 키워드 슬롯
  if (type === 'keyword') {
    return (
      <div className="flex items-center justify-center h-20 bg-[#F5F5F5] border border-dashed border-[#CCCCCC] rounded-lg">
        <p className="text-xs text-[#999999]">{message}</p>
      </div>
    );
  }

  // 카드 슬롯
  if (type === 'card') {
    return (
      <div className="bg-white border-2 border-dashed border-[#E0E0E0] rounded-lg p-4 flex flex-col items-center justify-center h-[200px]">
        <div className="w-12 h-12 bg-[#F5F5F5] rounded-full flex items-center justify-center mb-3">
          <svg className="w-6 h-6 text-[#CCCCCC]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <p className="text-xs text-[#999999] text-center">{message}</p>
      </div>
    );
  }

  // 고객 정보 슬롯
  if (type === 'customer') {
    return (
      <div className="space-y-2">
        <div className="h-8 bg-[#F5F5F5] rounded animate-pulse" />
        <div className="h-8 bg-[#F5F5F5] rounded animate-pulse" />
        <div className="h-8 bg-[#F5F5F5] rounded animate-pulse" />
        <p className="text-xs text-[#999999] text-center mt-4">{message}</p>
      </div>
    );
  }

  // 가이드 슬롯
  if (type === 'guide') {
    return (
      <div className="h-24 bg-[#F5F5F5] border border-dashed border-[#CCCCCC] rounded-lg flex items-center justify-center">
        <p className="text-xs text-[#999999] text-center px-4">{message}</p>
      </div>
    );
  }

  // STT 슬롯
  if (type === 'stt') {
    return (
      <div className="h-32 bg-[#FAFAFA] border border-[#E0E0E0] rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-[#E0E0E0] rounded-full mx-auto mb-2 flex items-center justify-center">
            <svg className="w-4 h-4 text-[#999999]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </div>
          <p className="text-xs text-[#999999]">{message}</p>
        </div>
      </div>
    );
  }

  // 기본 슬롯
  return (
    <div className="flex items-center justify-center h-full bg-[#F5F5F5] border border-dashed border-[#CCCCCC] rounded-lg">
      <p className="text-xs text-[#999999]">{message}</p>
    </div>
  );
}
