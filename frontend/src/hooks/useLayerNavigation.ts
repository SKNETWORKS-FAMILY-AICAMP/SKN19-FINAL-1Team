// 레이어 네비게이션 커스텀 훅
// 키보드/휠 네비게이션 로직

import { useEffect, RefObject, useRef } from 'react';

interface UseLayerNavigationOptions {
  activeLayer: 'kanban' | 'search';
  setActiveLayer: React.Dispatch<React.SetStateAction<'kanban' | 'search'>>;
  focusedCard: { row: number; col: number };
  setFocusedCard: React.Dispatch<React.SetStateAction<{ row: number; col: number }>>;
  isWheelThrottled: boolean;
  setIsWheelThrottled: React.Dispatch<React.SetStateAction<boolean>>;
  isAtBoundary: boolean;
  setIsAtBoundary: React.Dispatch<React.SetStateAction<boolean>>;
  isModalOpen?: boolean;
  searchInputRef?: RefObject<HTMLInputElement>;
  cardAreaId?: string; // 카드 영역 DOM ID
  setWheelDirection?: React.Dispatch<React.SetStateAction<'up' | 'down' | undefined>>; // 휠 방향 추적
}

/**
 * 레이어 네비게이션 훅
 * - 방향키: 카드 간 이동, 경계에서 레이어/Step 전환
 * - 휠: 즉시 레이어 전환 (경계 lock 효과)
 * - /: 검색창 포커싱
 * - Esc: 검색 취소 / 모달 닫기
 */
export function useLayerNavigation(options: UseLayerNavigationOptions) {
  const {
    activeLayer,
    setActiveLayer,
    focusedCard,
    setFocusedCard,
    isWheelThrottled,
    setIsWheelThrottled,
    isAtBoundary,
    setIsAtBoundary,
    isModalOpen = false,
    searchInputRef,
    cardAreaId = 'card-layer-area',
    setWheelDirection
  } = options;
  
  // 경계 lock 상태 (첫 휠은 경고, 두 번째부터 전환)
  const boundaryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const wheelDirectionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 키보드 네비게이션
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 입력 필드에 포커스 있으면 무시
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      const { row, col } = focusedCard;
      const maxRow = 1; // 2x2 그리드 (0, 1)
      const maxCol = 1;

      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          if (row > 0) {
            // 2x2 내부 이동
            setFocusedCard({ row: row - 1, col });
          } else {
            // 맨 위 경계 → 다른 레이어 맨 아래로 전환
            setActiveLayer(prev => (prev === 'kanban' ? 'search' : 'kanban'));
            setFocusedCard({ row: maxRow, col }); // 맨 아래로 진입
          }
          break;

        case 'ArrowDown':
          e.preventDefault();
          if (row < maxRow) {
            // 2x2 내부 이동
            setFocusedCard({ row: row + 1, col });
          } else {
            // 맨 아래 경계 → 다른 레이어 맨 위로 전환
            setActiveLayer(prev => (prev === 'kanban' ? 'search' : 'kanban'));
            setFocusedCard({ row: 0, col }); // 맨 위로 진입
          }
          break;

        case 'ArrowLeft':
          e.preventDefault();
          if (col > 0) {
            // 2x2 내부 이동
            setFocusedCard({ row, col: col - 1 });
          }
          // TODO: 칸반 레이어에서 Step 전환 (향후 구현)
          break;

        case 'ArrowRight':
          e.preventDefault();
          if (col < maxCol) {
            // 2x2 내부 이동
            setFocusedCard({ row, col: col + 1 });
          }
          // TODO: 칸반 레이어에서 Step 전환 (향후 구현)
          break;

        case '/':
          e.preventDefault();
          searchInputRef?.current?.focus();
          break;

        case 'Escape':
          if (document.activeElement === searchInputRef?.current) {
            searchInputRef?.current?.blur();
          }
          // 모달 닫기는 각 컴포넌트에서 처리
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    focusedCard,
    activeLayer,
    isModalOpen,
    searchInputRef,
    setActiveLayer,
    setFocusedCard
  ]);

  // 휠 스크롤 레이어 전환
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // 카드 영역 내에서만 레이어 전환
      const cardArea = document.getElementById(cardAreaId);
      if (!cardArea?.contains(e.target as Node)) return;

      // 쓰로틀링 (500ms) - 더 부드럽게
      if (isWheelThrottled) return;
      setIsWheelThrottled(true);
      setTimeout(() => setIsWheelThrottled(false), 350); // 500ms → 350ms (70%)

      const direction = e.deltaY > 0 ? 'down' : 'up';

      if (e.deltaY > 0) {
        // 휠 다운 → 경계 lock 후 전환
        if (setWheelDirection) setWheelDirection('down');
        
        if (isAtBoundary) {
          setActiveLayer(prev => (prev === 'kanban' ? 'search' : 'kanban'));
          setFocusedCard({ row: 0, col: focusedCard.col });
          setIsAtBoundary(false);
          if (boundaryTimeoutRef.current) {
            clearTimeout(boundaryTimeoutRef.current);
            boundaryTimeoutRef.current = null;
          }
        } else {
          setIsAtBoundary(true);
          boundaryTimeoutRef.current = setTimeout(() => setIsAtBoundary(false), 700); // 1000ms → 700ms (70%)
        }
      } else if (e.deltaY < 0) {
        // 휠 업 → 경계 lock 후 전환
        if (setWheelDirection) setWheelDirection('up');
        
        if (isAtBoundary) {
          setActiveLayer(prev => (prev === 'kanban' ? 'search' : 'kanban'));
          setFocusedCard({ row: 1, col: focusedCard.col });
          setIsAtBoundary(false);
          if (boundaryTimeoutRef.current) {
            clearTimeout(boundaryTimeoutRef.current);
            boundaryTimeoutRef.current = null;
          }
        } else {
          setIsAtBoundary(true);
          boundaryTimeoutRef.current = setTimeout(() => setIsAtBoundary(false), 700); // 1000ms → 700ms (70%)
        }
      }

      // 휠 방향 표시 2초 후 숨김
      if (wheelDirectionTimeoutRef.current) {
        clearTimeout(wheelDirectionTimeoutRef.current);
      }
      wheelDirectionTimeoutRef.current = setTimeout(() => {
        if (setWheelDirection) setWheelDirection(undefined);
      }, 2000);
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      window.removeEventListener('wheel', handleWheel);
      if (wheelDirectionTimeoutRef.current) {
        clearTimeout(wheelDirectionTimeoutRef.current);
      }
    };
  }, [
    isWheelThrottled,
    focusedCard.col,
    cardAreaId,
    setActiveLayer,
    setFocusedCard,
    setIsWheelThrottled,
    isAtBoundary,
    setIsAtBoundary,
    setWheelDirection,
    boundaryTimeoutRef
  ]);
}