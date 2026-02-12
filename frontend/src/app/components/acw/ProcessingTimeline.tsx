/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * CALL:ACT - 처리 내역 타임라인 컴포넌트 (Redesigned v3.1)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * 적응형 간격 시스템:
 * - 3개 이하: 넓은 간격 (50px 라인)
 * - 4-6개: 중간 간격 (40px 라인)
 * - 7개 이상: 좁은 간격 (32px 라인)
 * - 중앙 정렬 + 좌우 여백
 * - 1.5px 도트 + 엣지 있는 라인
 * 
 * @version 3.1
 * @since 2025-02-02
 */

import { useEffect, useState } from 'react';
import type { ProcessingTimelineItem } from '@/data/afterCallWorkData/types';

interface ProcessingTimelineProps {
  timeline: ProcessingTimelineItem[];
  animate?: boolean;
}

export function ProcessingTimeline({ timeline, animate = true }: ProcessingTimelineProps) {
  const [visibleCount, setVisibleCount] = useState(0);

  // 타임라인 개수에 따른 간격 조정
  const getLineWidth = () => {
    const count = timeline.length;
    if (count <= 3) return 50; // 넓은 간격
    if (count <= 6) return 40; // 중간 간격
    return 32; // 좁은 간격
  };

  const lineWidth = getLineWidth();

  useEffect(() => {
    if (!animate) {
      setVisibleCount(timeline.length);
      return;
    }

    // 초기화
    setVisibleCount(0);

    // 각 아이템이 "따 따 따" 리듬감 있게 등장 (200ms 간격)
    const timers: NodeJS.Timeout[] = [];
    timeline.forEach((_, index) => {
      const timer = setTimeout(() => {
        setVisibleCount(prev => prev + 1);
      }, index * 200);
      timers.push(timer);
    });

    return () => timers.forEach(timer => clearTimeout(timer));
  }, [timeline, animate]);

  if (!timeline || timeline.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-[10px] text-[#999999]">
        처리 내역이 없습니다.
      </div>
    );
  }

  return (
    <div className="flex items-start justify-center gap-4 w-full px-8">
      {timeline.map((item, index) => {
        const isVisible = index < visibleCount;
        const isLast = index === timeline.length - 1;

        return (
          <div
            key={index}
            className="flex items-start gap-4"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(-8px) scale(0.95)',
              transition: 'all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)', // 탄성 있는 애니메이션
            }}
          >
            {/* 타임라인 아이템 */}
            <div className="flex flex-col items-center">
              {/* 시간 */}
              <div className="text-[9px] text-[#999999] mb-2 whitespace-nowrap font-medium">
                {item.time}
              </div>

              {/* 도트 (1.5px, 엣지 효과) */}
              <div
                className={`rounded-full shadow-sm ${
                  item.categoryRaw ? 'bg-[#0047AB]' : 'bg-[#CCCCCC]'
                }`}
                style={{
                  width: '6px',
                  height: '6px',
                  boxShadow: item.categoryRaw ? '0 0 3px rgba(0, 71, 171, 0.4)' : 'none',
                }}
              />

              {/* 액션 */}
              <div className="text-[10px] text-[#333333] mt-2 text-center leading-tight max-w-[110px]">
                {item.action}
              </div>
            </div>

            {/* 연결선 (마지막 아이템 제외, 엣지 효과) */}
            {!isLast && (
              <div
                className="bg-gradient-to-r from-[#E0E0E0] via-[#CCCCCC] to-[#E0E0E0] flex-shrink-0"
                style={{
                  width: `${lineWidth}px`,
                  height: '2px',
                  marginTop: '22px', // 도트 중앙과 정렬
                  opacity: isVisible ? 1 : 0,
                  transition: 'opacity 0.4s ease-out 0.2s',
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
