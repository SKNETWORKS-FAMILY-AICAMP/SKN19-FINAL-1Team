// 검색 레이어 빈 공간 컴포넌트
// 검색 결과가 없을 때 표시되는 플레이스홀더

interface EmptySearchSlotProps {
  className?: string;
}

/**
 * 검색 레이어의 빈 공간
 * - Empty 느낌 (실선 테두리)
 * - 카드와 동일한 높이 고정 (h-[340px] - 일반 카드 높이)
 * - 미묘한 배경 패턴
 */
export const EmptySearchSlot = ({ className = '' }: EmptySearchSlotProps) => {
  return (
    <div className={`h-[340px] ${className}`}>
      <div className="relative border-2 border-[#E5E7EB] rounded-lg h-full 
                      flex flex-col items-center justify-center 
                      bg-white
                      overflow-hidden group
                      transition-all duration-300 hover:border-[#D1D5DB]">
        {/* 배경 패턴 (미묘하게) */}
        <div className="absolute inset-0 opacity-[0.015]"
             style={{
               backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 15px, #9CA3AF 15px, #9CA3AF 16px)`
             }}
        />
        
        {/* 중앙 아이콘 */}
        <div className="relative z-10 flex flex-col items-center opacity-20 group-hover:opacity-25 transition-opacity">
          <svg 
            className="w-10 h-10 text-[#9CA3AF] mb-2" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5} 
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
            />
          </svg>
          <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-[#D1D5DB] to-transparent" />
        </div>
      </div>
    </div>
  );
};