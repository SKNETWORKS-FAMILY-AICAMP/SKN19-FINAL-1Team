// 검색 레이어 관련 헬퍼 함수들
import { ScenarioCard } from '@/data/scenarios';
import { simulateSearch, saveSearchHistory, getSearchHistory } from './searchSimulator';
import { addTimestampToCard } from './timeFormatter';

export interface SearchHandlerOptions {
  query: string;
  isCallActive: boolean;
  isDirectIncoming: boolean;
  setSearchHistory: (history: any[]) => void;
  setSearchResults: React.Dispatch<React.SetStateAction<ScenarioCard[][]>>;
  setConsultationReferences: React.Dispatch<React.SetStateAction<ScenarioCard[]>>;
  setSearchedDocuments: React.Dispatch<React.SetStateAction<string[]>>;
  setActiveLayer: React.Dispatch<React.SetStateAction<'kanban' | 'search'>>;
  setFocusedCardIds: React.Dispatch<React.SetStateAction<string[]>>;
  setIsSearchHistoryOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

/**
 * 검색 실행 핸들러
 * - 대기 중/통화 중 모두 검색 가능
 * - 검색 이력은 항상 저장
 * - 후처리 참조 문서는 통화 중에만 저장
 * - 검색 후 자동으로 검색 레이어로 전환
 */
export async function handleSearchExecution(options: SearchHandlerOptions) {
  const {
    query,
    isCallActive,
    isDirectIncoming,
    setSearchHistory,
    setSearchResults,
    setConsultationReferences,
    setSearchedDocuments,
    setActiveLayer,
    setFocusedCardIds,
    setIsSearchHistoryOpen
  } = options;

  const result = await simulateSearch(query, isDirectIncoming, isCallActive);

  if (result.cards.length > 0) {
    // 1. ⭐ 검색 이력 저장 (항상 - 대기 중/통화 중 무관)
    const historyItem = saveSearchHistory(result);
    setSearchHistory(getSearchHistory());

    // 2. ⭐ 검색 결과 상태 저장 (누적 방식: 최신 카드를 맨 앞에 추가)
    const cardsWithTimestamp = result.cards.map(card => addTimestampToCard(card));
    setSearchResults(prev => {
      // 기존 카드들과 합쳐서 누적 (최신 카드가 맨 앞)
      const allCards = [...cardsWithTimestamp, ...prev.flat()];
      
      // 2x2 블록 단위로 재구성
      const blocks: ScenarioCard[][] = [];
      for (let i = 0; i < allCards.length; i += 2) {
        blocks.push(allCards.slice(i, i + 2));
      }
      
      return blocks;
    });

    // 3. ⭐ 후처리 참조 문서 저장 (통화 중일 때만)
    if (isCallActive) {
      setConsultationReferences(prev => [...cardsWithTimestamp, ...prev]);

      // 현재 세션의 검색 문서 누적 (중복 제거)
      const newDocumentIds = result.cards.map(card => card.id);
      setSearchedDocuments(prev => {
        const uniqueIds = Array.from(new Set([...prev, ...newDocumentIds]));
        return uniqueIds;
      });
    }

    // 4. ⭐ 자동 레이어 전환 (칸반 → 검색)
    setActiveLayer('search');

    // 5. ⭐ 새 카드에 포커싱 플래그 설정
    setFocusedCardIds(cardsWithTimestamp.map(c => c.id));

    // 6. 1.5초 후 포커싱 해제
    setTimeout(() => {
      setFocusedCardIds([]);
    }, 1500);

    // ⭐ 검색 시 자동으로 검색 이력 펼치기
    setIsSearchHistoryOpen(true);

    console.log(
      `🔍 검색 완료: "${query}" (${result.cards.length}건, ${result.accuracy}% 매칭, ${result.searchTime}ms)${
        isCallActive ? ' [참조 문서 저장됨]' : ' [대기 중 - 이력만 저장]'
      }`
    );
  } else if (result.cards.length === 0) {
    console.log(`🔍 검색 결과 없음: "${query}"`);
  }

  return result;
}