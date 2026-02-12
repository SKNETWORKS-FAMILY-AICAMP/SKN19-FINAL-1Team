// 검색 결과 레이어 컴포넌트
// 검색된 카드를 가로 스크롤 방식으로 쌓음 (드래그 가능)
// 각 검색마다 2x2 블록으로 추가

import { ScenarioCard } from '@/data/scenarios';
import { InfoCard } from './InfoCard';
import { EmptySearchSlot } from './EmptySearchSlot';
import { motion, AnimatePresence } from 'motion/react';
import { useRef, useEffect, useState } from 'react';

interface SearchResultLayerProps {
  searchResults: ScenarioCard[][]; // 2차원 배열: [[최신 카드들], [이전 카드들], ...]
  onCardClick: (card: ScenarioCard) => void;
  className?: string;
  onIndexChange?: (currentIndex: number, totalBlocks: number) => void; // 인디케이터 상태 전달
  externalIndex?: number; // 외부(SearchLayer)에서 인디케이터 클릭 시 전달받는 인덱스
}

/**
 * 검색 결과 레이어 (가로 스크롤)
 * - 첫 검색: 위→아래 (1행 2개 카드)
 * - 두번째 검색: 우→좌로 새 1행, 기존 1행은 2행으로 밀림
 * - 드래그로 이전 검색 결과 탐색 가능 (블록 단위: 4개 카드)
 * - searchResults 구조: [[최신검색-card1, card2], [이전검색-card1, card2], ...]
 */
export const SearchResultLayer = ({
  searchResults,
  onCardClick,
  className = '',
  onIndexChange,
  externalIndex
}: SearchResultLayerProps) => {
  const [currentIndex, setCurrentIndex] = useState(0); // 현재 보고 있는 블록 인덱스 (0 = 최신 검색)
  const [isFirstSearch, setIsFirstSearch] = useState(true);
  // ⭐ 드래그 관련 ref (칸반 레이어 방식 - 성능 최적화)
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const dragDistanceRef = useRef(0);
  const [isExternalUpdate, setIsExternalUpdate] = useState(false); // 외부 업데이트 플래그
  
  // totalBlocks 계산: 검색 2회 = 블록 1개 (4개 카드)
  const totalBlocks = Math.ceil(searchResults.length / 2);
  
  // 현재 블록의 2개 검색 (4개 카드)
  const search1 = searchResults[currentIndex * 2] || []; // 최신 검색
  const search2 = searchResults[currentIndex * 2 + 1] || []; // 이전 검색
  const cards = [...search1, ...search2]; // 최대 4개 카드
  
  // 첫 검색 여부 추적
  useEffect(() => {
    if (searchResults.length > 0 && searchResults[0].length > 0) {
      const timer = setTimeout(() => setIsFirstSearch(false), 600);
      return () => clearTimeout(timer);
    }
  }, [searchResults]);

  // 새 검색 시 최신 결과로 이동
  useEffect(() => {
    setCurrentIndex(0);
  }, [searchResults.length]);

  // 인디케이터 상태를 부모로 전달 (외부 업데이트가 아닐 때만)
  useEffect(() => {
    if (onIndexChange && !isExternalUpdate) {
      onIndexChange(currentIndex, totalBlocks);
    }
    // 외부 업데이트 플래그 리셋
    if (isExternalUpdate) {
      setIsExternalUpdate(false);
    }
  }, [currentIndex, totalBlocks, onIndexChange, isExternalUpdate]);

  // 외부 인덱스 변경 시 현재 인덱스 업데이트 (조건부)
  useEffect(() => {
    if (externalIndex !== undefined && externalIndex !== currentIndex) {
      setIsExternalUpdate(true); // 외부 업데이트임을 표시
      setCurrentIndex(externalIndex);
    }
  }, [externalIndex]);

  // ⭐ 드래그 시작 (칸반 레이어 방식)
  const handleDragStart = (e: React.MouseEvent) => {
    if (totalBlocks <= 1) return; // 블록이 1개면 드래그 불필요

    isDraggingRef.current = true;
    startXRef.current = e.pageX;
    dragDistanceRef.current = 0;
    e.currentTarget.style.cursor = 'grabbing';
  };

  // ⭐ 드래그 중 (칸반 레이어 방식)
  const handleDragMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    e.preventDefault();
    dragDistanceRef.current = e.pageX - startXRef.current;
  };

  // ⭐ 드래그 종료 (칸반 레이어 방식)
  const handleDragEnd = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;

    isDraggingRef.current = false;
    e.currentTarget.style.cursor = 'grab';

    const threshold = 100; // 100px 이상 드래그하면 페이지 전환

    if (Math.abs(dragDistanceRef.current) > threshold) {
      // 좌→우 드래그: 이전 검색 결과로 이동
      if (dragDistanceRef.current > 0 && currentIndex < totalBlocks - 1) {
        setCurrentIndex(currentIndex + 1);
      }
      // 우→좌 드래그: 최신 검색 결과로 복귀
      else if (dragDistanceRef.current < 0 && currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      }
    }

    dragDistanceRef.current = 0;
  };

  return (
    <div className={className}>
      {/* 2x2 그리드 컨테이너 (드래그 가능) */}
      <div
        className="relative overflow-hidden select-none"
        style={{
          cursor: totalBlocks > 1 ? 'grab' : 'default'
        }}
        onMouseDown={handleDragStart}
        onMouseMove={handleDragMove}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
      >
          <div
            key={`search-block-${currentIndex}`}
            className="grid grid-cols-2 gap-4"
          >
            {/* 4개 카드 또는 빈 슬롯 */}
            {[0, 1, 2, 3].map((index) => {
              const card = cards[index];
              const row = Math.floor(index / 2); // 0 or 1
              const col = index % 2; // 0 or 1
              
              // 검색 번호 계산 (최신 검색 = 1, 이전 검색 = 2, ...)
              const searchNumber = searchResults.length - (currentIndex * 2 + row);
              
              // 첫 검색: 위→아래, 이후: 우→좌 (첫 행), 위→아래로 밀림 (둘째 행)
              // ⭐ 칸반 스타일 (fade + scale)
              const getInitial = () => {
                return { opacity: 0, scale: 0.96, y: 8 };
              };
              
              return (
                <motion.div
                  key={`${card?.id || `empty-${index}`}-${currentIndex}`}
                  initial={getInitial()}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{
                    type: 'spring',
                    stiffness: 150,
                    damping: 28,
                    mass: 0.8,
                    delay: index * 0.05
                  }}
                >
                  {card ? (
                    <InfoCard
                      card={card}
                      source="search-result"
                      searchNumber={searchNumber}
                      onDetailClick={() => onCardClick(card)}
                    />
                  ) : (
                    <EmptySearchSlot />
                  )}
                </motion.div>
              );
            })}
          </div>
        
      </div>

      {/* 검색 히스토리 정보 */}
      {totalBlocks > 1 && (
        <div className="mt-4 text-center">
          <span className="text-[10px] text-[#9CA3AF]">
            {totalBlocks - currentIndex}번째 검색 결과 ({totalBlocks}개 중)
          </span>
        </div>
      )}
    </div>
  );
};
