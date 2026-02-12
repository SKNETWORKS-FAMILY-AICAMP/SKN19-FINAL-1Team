// 정보 카드 컴포넌트 (AI 추천, 검색 결과, 다음 단계 통합)
// 모든 카드 렌더링을 중앙에서 관리하여 일관성 유지

import { ScenarioCard } from '@/data/scenarios';
import { FileText } from 'lucide-react';
import { ProductAttributesGrid } from '../cards/ProductAttributesGrid';
import { useState, useEffect } from 'react';

export type CardSource = 'ai-recommend' | 'search-result' | 'next-step';

interface InfoCardProps {
  card: ScenarioCard;
  stepNumber?: number; // AI 추천 카드만 사용
  searchNumber?: number; // 검색 결과 카드만 사용 (검색결과1, 검색결과2...)
  source: CardSource;
  onDetailClick: () => void;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * 타임스탬프를 "HH:MM (N분 전)" 형식으로 계산
 */
const formatRelativeTime = (timestamp?: string): string | null => {
  if (!timestamp) return null;
  
  const d = new Date(timestamp);
  const now = new Date();
  
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  
  // 방금 전 (1분 미만)
  if (diffMins < 1) {
    return `${hours}:${minutes} (방금 전)`;
  }
  
  // N분 전 (1시간 미만)
  if (diffMins < 60) {
    return `${hours}:${minutes} (${diffMins}분 전)`;
  }
  
  // N시간 전 (24시간 미만)
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) {
    return `${hours}:${minutes} (${diffHours}시간 전)`;
  }
  
  // N일 전 (24시간 이상)
  const diffDays = Math.floor(diffHours / 24);
  return `${hours}:${minutes} (${diffDays}일 전)`;
};

/**
 * 통합 정보 카드 컴포넌트
 * - AI 추천 카드 (Step 배지, 파란색 테두리)
 * - 검색 결과 카드 (검색 결과 배지, 보라색 테두리)
 * - 다음 단계 예상 카드 (노란색 테두리)
 */
export const InfoCard = ({ card, stepNumber, searchNumber, source, onDetailClick, className = '', style }: InfoCardProps) => {
  // 타임스탬프를 현재 시각 기준으로 실시간 계산
  const [relativeTime, setRelativeTime] = useState<string | null>(
    card.timestamp ? formatRelativeTime(card.timestamp) : card.displayTime || null
  );

  // 1분마다 타임스탬프 업데이트
  useEffect(() => {
    if (!card.timestamp) return;

    const updateTime = () => {
      setRelativeTime(formatRelativeTime(card.timestamp));
    };

    // 초기 설정
    updateTime();

    // 1분마다 업데이트
    const intervalId = setInterval(updateTime, 60000);

    return () => clearInterval(intervalId);
  }, [card.timestamp]);

  // 소스별 스타일
  const getCardStyle = () => {
    switch (source) {
      case 'ai-recommend':
        return 'bg-gradient-to-br from-white to-[#F8FBFF] border-2 border-[#0047AB]/20 hover:border-[#0047AB]/40';
      case 'search-result':
        return 'bg-white border-2 border-[#6366F1] hover:border-[#4F46E5] shadow-[0_2px_8px_rgba(99,102,241,0.1)] hover:shadow-[0_4px_16px_rgba(79,70,229,0.15)]';
      case 'next-step':
        return 'bg-gradient-to-br from-white to-[#FFFBF0] border-2 border-[#FDB022]/20 hover:border-[#FDB022]/40';
      default:
        return 'bg-white border-2 border-[#E0E0E0]';
    }
  };

  // 배지 스타일 및 텍스트
  const getBadge = () => {
    switch (source) {
      case 'ai-recommend':
        return {
          text: `Step ${stepNumber}`,
          className: 'bg-[#0047AB] text-white'
        };
      case 'search-result':
        return {
          text: searchNumber ? `검색 결과 ${searchNumber}` : '검색 결과',
          className: 'bg-[#4F46E5] text-white'
        };
      case 'next-step':
        return {
          text: `Step ${stepNumber} 예상`,
          className: 'bg-[#FDB022] text-white'
        };
      default:
        return null;
    }
  };

  const badge = getBadge();

  return (
    <div
      className={`${getCardStyle()} rounded-lg p-3 shadow-md hover:shadow-xl transition-all flex flex-col h-[340px] overflow-y-auto ${className}`}
      style={style}
      onDoubleClick={onDetailClick} // ⭐ 더블클릭으로 자세히 보기
    >
      {/* 상단: 배지 + 타임스탬프 */}
      <div className="flex items-center justify-between mb-2">
        {badge && (
          <span className={`text-[9px] px-1.5 py-0.5 rounded ${badge.className}`}>
            {badge.text}
          </span>
        )}
        {relativeTime && (
          <em className="not-italic text-[10px] text-[#9CA3AF] opacity-85 ml-auto" style={{ fontStyle: 'italic' }}>
            {relativeTime}
          </em>
        )}
      </div>

      {/* 제목 */}
      <h3 className={`text-base font-bold mb-2.5 ${
        source === 'search-result' ? 'text-[#4F46E5]' : 'text-[#0047AB]'
      }`}>
        {card.title}
      </h3>

      {/* 키워드 */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {card.keywords.map((keyword: string, index: number) => (
          <span
            key={index}
            className={`text-[11px] px-2 py-0.5 rounded font-medium ${
              source === 'search-result'
                ? 'bg-[#EEF2FF] text-[#4F46E5]'
                : 'bg-[#E8F1FC] text-[#0047AB]'
            }`}
          >
            {keyword}
          </span>
        ))}
      </div>

      {/* 내용 미리보기 */}
      <p className="text-xs text-[#666666] leading-relaxed mb-2 line-clamp-2">
        {card.content}
      </p>

      {/* 하이브리드 카드: 상품 속성 그리드 */}
      {card.attributes && <ProductAttributesGrid attributes={card.attributes} />}

      {/* DocumentType별 맞춤 정보 표시 */}
      {card.documentType === 'product-spec' && (
        <div className="bg-[#F8FCFF] rounded-md p-2.5 mb-2.5 space-y-1.5 border border-[#0047AB]/10">
          <div className="flex items-center justify-between">
            <div className="text-[10px] text-[#666666]">
              <span className="font-semibold text-[#0047AB]">📋 {card.regulation}</span>
            </div>
          </div>
          {card.note && (
            <div className="text-[10px] text-[#34A853] font-medium bg-[#E6F4EA] px-2 py-1 rounded">
              💡 {card.note}
            </div>
          )}
        </div>
      )}

      {card.documentType === 'analysis-report' && (
        <div className="bg-[#FFF9E6] rounded-md p-2.5 mb-2.5 border border-[#FBBC04]/30">
          <div className="text-[10px] font-semibold text-[#FBBC04] mb-1">📊 분석 결과</div>
          <div className="text-[10px] text-[#666666]">{card.note}</div>
        </div>
      )}

      {/* 실무 정보 (guide, terms, general 타입에만 표시) */}
      {(!card.documentType || ['guide', 'terms', 'general'].includes(card.documentType)) && card.type !== 'product-info' && (
        <div className="bg-white/60 rounded-md p-2.5 mb-2.5 space-y-2">
          <div className="text-[11px] text-[#0047AB] font-medium border-b border-[#0047AB]/10 pb-1.5">
            🖥️ {card.systemPath}
          </div>

          <div>
            <div className="text-[11px] font-semibold text-[#333333] mb-1">필수 확인 사항:</div>
            {card.requiredChecks.slice(0, 2).map((check: string, index: number) => (
              <div key={index} className="text-[10px] text-[#666666] leading-relaxed">
                {check}
              </div>
            ))}
          </div>

          <div>
            <div className="text-[11px] font-semibold text-[#333333] mb-1">예외 사항:</div>
            {card.exceptions.slice(0, 1).map((exception: string, index: number) => (
              <div key={index} className="text-[10px] text-[#EA4335] leading-relaxed">
                {exception}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 하단: 처리 시간 + 자세히 보기 */}
      <div className="mt-auto pt-2 border-t border-[#E0E0E0] flex items-center justify-between">
        <span className="text-[10px] text-[#999999]">⏱ {card.time}</span>
        <button
          onClick={onDetailClick}
          className={`text-[10px] font-semibold flex items-center gap-1 px-2 py-1 rounded transition-colors ${
            source === 'search-result'
              ? 'text-[#4F46E5] hover:bg-[#EEF2FF]'
              : 'text-[#0047AB] hover:bg-[#E8F1FC]'
          }`}
        >
          <FileText className="w-3 h-3" />
          자세히 보기
        </button>
      </div>
    </div>
  );
};