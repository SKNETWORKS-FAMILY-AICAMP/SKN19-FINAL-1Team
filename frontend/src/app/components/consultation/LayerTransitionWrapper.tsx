// 레이어 전환 래퍼 컴포넌트
// 칸반/검색 레이어 전환 시 슬라이딩 애니메이션 적용

import { motion, AnimatePresence } from 'motion/react';
import { ReactNode } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface LayerTransitionWrapperProps {
  activeLayer: 'kanban' | 'search';
  kanbanContent: ReactNode;
  searchContent: ReactNode;
  isAtBoundary: boolean;
  isCallActive: boolean;
  wheelDirection?: 'up' | 'down'; // 휠 방향
}

/**
 * 레이어 전환 래퍼
 * - 부드러운 Spring 애니메이션으로 물 흐르듯이 슬라이딩
 * - 칸반 → 검색: 칸반이 아래로, 검색이 위에서 내려옴
 * - 검색 → 칸반: 검색이 위로, 칸반이 아래에서 올라옴
 * - 휠 힌트 (카드 하단, 휠 방향에 따라 화살표 표시)
 */
export const LayerTransitionWrapper = ({
  activeLayer,
  kanbanContent,
  searchContent,
  isAtBoundary,
  isCallActive,
  wheelDirection
}: LayerTransitionWrapperProps) => {
  return (
    <div id="card-layer-area" className="relative h-full flex flex-col">
      {/* 휠 힌트 (카드 영역 하단, 휠 움직일 때만 표시, 방향성 포함) */}
      <AnimatePresence>
        {isAtBoundary && wheelDirection && (
          <motion.div
            initial={{ opacity: 0, y: wheelDirection === 'down' ? -10 : 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: wheelDirection === 'down' ? 10 : -10 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-0 left-1/2 -translate-x-1/2 z-10 mb-4
                     px-4 py-2 rounded-full 
                     bg-white/95 backdrop-blur-sm
                     border-2 border-[#0047AB]/20
                     flex items-center gap-2 
                     shadow-lg"
          >
            {wheelDirection === 'down' ? (
              <>
                <ChevronDown className="w-4 h-4 text-[#0047AB] animate-bounce" />
                <span className="text-xs font-semibold text-[#0047AB]">
                  {activeLayer === 'kanban' ? '검색 레이어로 전환' : '칸반 레이어로 전환'}
                </span>
                <ChevronDown className="w-4 h-4 text-[#0047AB] animate-bounce" style={{ animationDelay: '0.1s' }} />
              </>
            ) : (
              <>
                <ChevronUp className="w-4 h-4 text-[#0047AB] animate-bounce" />
                <span className="text-xs font-semibold text-[#0047AB]">
                  {activeLayer === 'search' ? '칸반 레이어로 전환' : '검색 레이어로 전환'}
                </span>
                <ChevronUp className="w-4 h-4 text-[#0047AB] animate-bounce" style={{ animationDelay: '0.1s' }} />
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* 레이어 전환 애니메이션 - 부드럽고 자연스러운 전환 */}
      <div className="relative overflow-hidden flex-1 flex flex-col">
        <AnimatePresence mode="wait">
          {activeLayer === 'kanban' ? (
            <motion.div
              key="kanban-layer"
              initial={{ y: '100%' }}  // opacity 제거 - 슬라이딩만
              animate={{ y: 0 }}
              exit={{ y: '100%' }}     // opacity 제거 - 슬라이딩만
              transition={{
                type: 'spring',
                stiffness: 160,    // 120 → 160 (더 빠르게 따라옴)
                damping: 22,       // 25 → 22 (더 빠르게 따라옴)
                mass: 0.4          // 1 → 0.8 (더 가볍게)
              }}
              className="w-full h-full flex flex-col"
            >
              {kanbanContent}
            </motion.div>
          ) : (
            <motion.div
              key="search-layer"
              initial={{ y: '-100%' }}  // opacity 제거 - 슬라이딩만
              animate={{ y: 0 }}
              exit={{ y: '-100%' }}     // opacity 제거 - 슬라이딩만
              transition={{
                type: 'spring',
                stiffness: 160,    // 120 → 160 (더 빠르게 따라옴)
                damping: 22,       // 25 → 22 (더 빠르게 따라옴)
                mass: 0.4          // 1 → 0.8 (더 가볍게)
              }}
              className="w-full h-full flex flex-col"
            >
              {searchContent}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};