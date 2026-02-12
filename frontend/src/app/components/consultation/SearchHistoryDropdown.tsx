// 검색 이력 드롭다운 컴포넌트
// AI 검색 어시스턴트 하단에 표시되는 검색 이력 목록

import { useState } from 'react';
import { ChevronDown, ChevronUp, Clock, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { SearchHistoryItem, deleteSearchHistoryItem } from '@/utils/searchSimulator';
import { ScenarioCard } from '@/data/scenarios';

interface SearchHistoryDropdownProps {
  history: SearchHistoryItem[];
  onHistoryItemClick: (item: SearchHistoryItem) => void;
  onDocumentClick?: (card: ScenarioCard) => void; // 개별 문서 클릭
  onClearHistory: () => void;
  onDeleteItem?: (historyId: string) => void; // 개별 이력 삭제
  isOpen?: boolean; // 외부에서 제어되는 열림 상태
  onToggle?: (isOpen: boolean) => void; // 열림 상태 변경 콜백
  className?: string;
}

/**
 * 검색 이력 드롭다운
 * - 상담 중(통화 중)에만 검색 이력 저장
 * - 새 상담 시작 시 자동 초기화
 * - 클릭 시 해당 문서를 모달로 표시
 * - 고정 높이 + 좌우 페이징 방식으로 상담 메모 위치 고정
 */
export const SearchHistoryDropdown = ({
  history,
  onHistoryItemClick,
  onDocumentClick,
  onClearHistory,
  onDeleteItem,
  isOpen: externalIsOpen,
  onToggle,
  className = ''
}: SearchHistoryDropdownProps) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  // 외부에서 제어되는 경우 외부 상태 사용, 아니면 내부 상태 사용
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;

  const toggleDropdown = () => {
    const newIsOpen = !isOpen;
    if (onToggle) {
      onToggle(newIsOpen);
    } else {
      setInternalIsOpen(newIsOpen);
    }
  };

  const handleItemClick = (item: SearchHistoryItem) => {
    onHistoryItemClick(item);
    // 드롭다운은 열린 상태 유지 (각 문서를 클릭할 수 있도록)
  };

  const handleDocumentClick = (e: React.MouseEvent, card: ScenarioCard) => {
    e.stopPropagation(); // 부모 클릭 이벤트 차단
    if (onDocumentClick) {
      onDocumentClick(card);
    }
  };

  const handleDeleteDocument = (e: React.MouseEvent, card: ScenarioCard) => {
    e.stopPropagation(); // 부모 클릭 이벤트 차단
    
    const currentItem = history[currentPage];
    
    // 현재 검색 결과에서 해당 문서만 제거
    const updatedResults = currentItem.results.filter(r => r.id !== card.id);
    
    // 모든 문서가 삭제되면 검색 이력 자체를 삭제
    if (updatedResults.length === 0) {
      handleDeleteItem(e, currentItem.id);
    } else {
      // 문서만 제거하고 검색 이력은 유지
      // localStorage 업데이트
      const allHistory = JSON.parse(localStorage.getItem('searchHistory') || '[]') as SearchHistoryItem[];
      const updatedHistory = allHistory.map(item => 
        item.id === currentItem.id 
          ? { ...item, results: updatedResults }
          : item
      );
      localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
      
      // 부모 컴포넌트에 알림
      if (onDeleteItem) {
        onDeleteItem(currentItem.id);
      }
    }
  };

  const handleDeleteItem = (e: React.MouseEvent, historyId: string) => {
    e.stopPropagation(); // 부모 클릭 이벤트 차단
    deleteSearchHistoryItem(historyId);
    
    // 부모 컴포넌트에 삭제 알림
    if (onDeleteItem) {
      onDeleteItem(historyId);
    }
    
    // 현재 페이지가 삭제된 경우 이전 페이지로 이동
    if (currentPage >= history.length - 1 && currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const nextPage = () => {
    if (currentPage < history.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (history.length === 0) {
    return null; // 이력이 없으면 아무것도 표시하지 않음
  }

  const currentItem = history[currentPage];

  return (
    <div className={`mt-2 ${className}`}>
      {/* 드롭다운 토글 버튼 */}
      <button
        onClick={toggleDropdown}
        className="w-full flex items-center justify-between px-3 py-2 
                   bg-[#F8F9FA] hover:bg-[#E9ECEF] 
                   border border-[#E0E0E0] rounded-md
                   text-[10px] text-[#666666] transition-colors"
      >
        <div className="flex items-center gap-2">
          <Clock className="w-3 h-3" />
          <span>검색 이력 {history.length}건</span>
        </div>
        {isOpen ? (
          <ChevronUp className="w-3.5 h-3.5" />
        ) : (
          <ChevronDown className="w-3.5 h-3.5" />
        )}
      </button>

      {/* 드롭다운 목록 - 고정 높이 */}
      {isOpen && (
        <div className="mt-1 bg-white border border-[#E0E0E0] rounded-md shadow-lg">
          {/* 헤더: 페이징 + 전체 삭제 */}
          <div className="bg-white border-b border-[#E0E0E0] px-3 py-1.5 flex justify-between items-center">
            <div className="flex items-center gap-2">
              {/* 페이징은 항상 표시 (1개여도 표시) */}
              <button
                onClick={prevPage}
                disabled={currentPage === 0}
                className="p-1 hover:bg-[#F0F0F0] rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                title="이전"
              >
                <ChevronLeft className="w-3 h-3" />
              </button>
              <span className="text-[9px] text-[#666666] font-mono">
                {currentPage + 1} / {history.length}
              </span>
              <button
                onClick={nextPage}
                disabled={currentPage === history.length - 1}
                className="p-1 hover:bg-[#F0F0F0] rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                title="다음"
              >
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
            <button
              onClick={onClearHistory}
              className="text-[10px] text-[#EA4335] hover:text-[#C5221F] hover:bg-[#FEF2F2]
                         flex items-center gap-1 px-2 py-1 rounded transition-all"
              title="모든 검색 이력 삭제"
            >
              <X className="w-3 h-3" />
              전체 삭제
            </button>
          </div>

          {/* 현재 검색 이력 아이템 - 높이 축소 */}
          <div className="px-3 py-2.5 h-[85px] overflow-hidden">
            {/* 쿼리 + 시간 */}
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <span className="text-[10px] font-medium text-[#0047AB]">
                "{currentItem.query}"
              </span>
              <em className="not-italic text-[9px] text-[#999999] flex-shrink-0" style={{ fontStyle: 'italic' }}>
                {new Date(currentItem.timestamp).toLocaleTimeString('ko-KR', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </em>
            </div>

            {/* 문서명 리스트 - 개별 클릭 가능 + 매칭 점수 + 개별 삭제 */}
            <div className="space-y-0.5">
              {currentItem.results.map((card, idx) => {
                // 매칭 점수 계산
                const score = card.relevanceScore || currentItem.accuracy || 0;
                
                return (
                  <div
                    key={idx}
                    className="flex items-center gap-2 px-2 py-0.5 rounded 
                               hover:bg-[#E8F1FC] transition-colors group"
                  >
                    {/* 좌측: 문서명 (클릭 가능) */}
                    <button
                      onClick={(e) => handleDocumentClick(e, card)}
                      className="flex items-center gap-1 flex-1 text-left min-w-0"
                    >
                      <span className="text-[9px] text-[#666666] group-hover:text-[#0047AB] transition-colors truncate">
                        {card.title}
                      </span>
                    </button>
                    
                    {/* 우측: 검색 유사도 + 점수 + 삭제 버튼 */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {/* 검색 유사도 (좌측 정렬) + 점수 (우측 정렬) */}
                      <div className="flex items-center gap-0.5" style={{ width: '80px' }}>
                        <span className="text-[9px] text-[#999999]">검색 유사도</span>
                        <span className="text-[9px] text-[#999999] ml-auto">{score.toFixed(2)}</span>
                      </div>
                      <button
                        onClick={(e) => handleDeleteDocument(e, card)}
                        className="text-[#EA4335] hover:text-[#C5221F] 
                                   hover:bg-[#FEF2F2] p-0.5 rounded transition-all"
                        title="이 문서만 삭제"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};