// 검색 레이어 래퍼 컴포넌트
// 검색 결과를 보여주는 레이어 (칸반 레이어와 통일된 레이아웃)

import { ScenarioCard } from '@/data/scenarios';
import { SearchResultLayer } from './SearchResultLayer';
import { Lightbulb, FileText, Sparkles } from 'lucide-react';
import { useState } from 'react';

interface SearchLayerProps {
  searchResults: ScenarioCard[][];
  onCardClick: (card: ScenarioCard) => void;
  focusedCardIds: string[];
  className?: string;
}

/**
 * 검색 레이어 (칸반 레이어와 통일된 레이아웃)
 * - 인입 키워드 영역 → 검색 키워드 영역
 * - 상담 안내 멘트 → 검색 안내 멘트
 * - 현재 상황 관련 정보 → AI 검색 결과
 * - 카드 영역 (grid grid-cols-2)
 */
export const SearchLayer = ({
  searchResults,
  onCardClick,
  focusedCardIds,
  className = ''
}: SearchLayerProps) => {
  const totalResults = searchResults.flat().length;
  const [currentSearchIndex, setCurrentSearchIndex] = useState(0);
  const [totalSearchBlocks, setTotalSearchBlocks] = useState(Math.ceil(searchResults.length / 2)); // 초기값 계산
  
  // SearchResultLayer에서 인디케이터 정보 받기
  const handleIndexChange = (currentIndex: number, totalBlocks: number) => {
    setCurrentSearchIndex(currentIndex);
    setTotalSearchBlocks(totalBlocks);
  };

  // 인디케이터 클릭 핸들러 (칸반 레이어와 동일)
  const handleProgressClick = (index: number) => {
    setCurrentSearchIndex(index);
  };

  return (
    <div 
      className={`h-full flex flex-col ${className}`}
    >
      {/* 검색 키워드 + 검색 안내 - flex 레이아웃 (칸반과 동일 구조) */}
      <div className="mb-4 flex gap-4 items-start">
        {/* 좌측: 검색 키워드 영역 (고정 너비 240px) */}
        <div className="flex-shrink-0" style={{ width: '240px' }}>
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-xs font-bold text-[#333333]">검색 키워드</h3>
            {totalResults > 0 && (
              <span className="px-2 py-0.5 bg-[#4F46E5]/10 text-[#4F46E5] text-[10px] font-semibold rounded">
                {totalResults}건
              </span>
            )}
          </div>
          <div className="flex gap-1.5 flex-wrap">
            <span className="px-1.5 py-0.5 bg-[#4F46E5] text-white rounded-full text-[10px] font-medium">
              AI 검색
            </span>
            <span className="px-1.5 py-0.5 bg-[#4F46E5] text-white rounded-full text-[10px] font-medium">
              문서검색
            </span>
          </div>
        </div>

        {/* 우측: 검색 안내 멘트 (flex-1) */}
        <div className="flex-1 bg-white border-l-4 border-[#4F46E5] rounded-md p-2.5 shadow-sm">
          <div className="flex items-start gap-2">
            <Lightbulb className="w-3.5 h-3.5 text-[#4F46E5] flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-[10px] font-bold text-[#4F46E5] mb-1">검색 안내</h3>
              <p className="text-[10px] text-[#333333] leading-relaxed">
                {totalResults > 0 
                  ? 'AI가 관련도 순으로 정렬한 문서입니다. 카드를 클릭하여 상세 내용을 확인하고, 우측 복사 버튼으로 상담 메모에 바로 활용할 수 있습니다. 필요시 추가 검색으로 더 많은 정보를 찾아보세요.'
                  : 'AI 검색 어시스턴트에 질문이나 키워드를 입력하면 관련 약관, 상품 정보, 가이드, 분석 리포트 등을 빠르게 찾아드립니다. 자연어 질문도 가능합니다.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* AI 검색 결과 제목 (칸반의 "현재 상황 관련 정보"와 동일 위치) */}
      <div className="mb-5 flex-1 flex flex-col">
        <h2 className="text-sm font-bold text-[#333333] mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            AI 검색 결과
            {totalResults > 0 && (
              <span className="text-[10px] text-[#4F46E5] font-normal flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-[#4F46E5] rounded-full animate-pulse"></div>
                검색 완료
              </span>
            )}
          </div>
          {/* 우측 아이콘 */}
          {totalResults > 0 && (
            <Sparkles className="w-4 h-4 text-[#4F46E5]" />
          )}
        </h2>

        {/* Step 진행 인디케이터 - 검색 결과가 2개 이상일 때만 표시 (칸반 레이어와 동일 구조) */}
        {totalSearchBlocks > 1 && (
          <div className="flex items-center justify-between mb-3">
            {/* 좌측: 인디케이터 막대들 + 검색 N/N */}
            <div className="flex items-center gap-2">
              {/* 가로 막대 인디케이터 - 동적 렌더링 (클릭 가능) */}
              {Array.from({ length: totalSearchBlocks }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleProgressClick(index)}
                  className={`h-1 rounded-full transition-all duration-500 cursor-pointer ${
                    index === currentSearchIndex
                      ? 'bg-[#4F46E5] w-8 hover:bg-[#4338CA]'
                      : 'bg-[#E0E0E0] w-4 hover:bg-[#BDBDBD]'
                  }`}
                  title={`검색 ${index + 1}로 이동`}
                />
              ))}
              
              {/* 검색 N/N 텍스트 - 한 번만 표시 */}
              <span className="text-[10px] text-[#666666] ml-2">
                검색 {currentSearchIndex + 1} / {totalSearchBlocks}
              </span>
            </div>
            
            {/* 우측: 드래그 가이드 */}
            <span className="text-[10px] text-[#999999]">
              ← 드래그하여 검색 전환 →
            </span>
          </div>
        )}
        
        {/* 검색 결과 카드 영역 (칸반의 grid grid-cols-2와 동일) */}
        {totalResults === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            {/* 빈 상태 메시지 - 완전 센터 정렬 */}
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-[#EEF2FF] flex items-center justify-center mb-6 mx-auto">
                <FileText className="w-10 h-10 text-[#4F46E5]/40" />
              </div>
              <h3 className="text-base font-bold text-[#333333] mb-3">검색 결과가 없습니다</h3>
              <p className="text-sm text-[#666666] max-w-md leading-relaxed">
                다른 키워드로 검색하거나 질문을 변경해보세요.<br />
                자연어 질문으로도 검색이 가능합니다.
              </p>
            </div>
          </div>
        ) : (
          <SearchResultLayer
            searchResults={searchResults}
            onCardClick={onCardClick}
            className="flex-1"
            onIndexChange={handleIndexChange}
            externalIndex={currentSearchIndex}
          />
        )}
      </div>
    </div>
  );
};