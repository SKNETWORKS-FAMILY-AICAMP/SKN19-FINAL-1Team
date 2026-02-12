// ⭐ 단어 큐 처리 시스템 (누락 방지 + 타이핑 효과)

export interface WordQueueItem {
  text: string;
  isKeyword: boolean;
  speaker: 'agent' | 'customer';
  matchedKeyword?: string;
}

export interface QueueCallbacks {
  onWordAdded: (wordObj: Omit<WordQueueItem, 'matchedKeyword'>) => void;
  onKeywordDetected: (keyword: string, isFirst: boolean) => void;
  onStepTransition: (keyword: string, nextStep: number) => void;
}

export class WordQueueProcessor {
  private queue: WordQueueItem[] = [];
  private isProcessing = false;
  private callbacks: QueueCallbacks;

  constructor(callbacks: QueueCallbacks) {
    this.callbacks = callbacks;
  }

  // 단어를 큐에 추가
  addWords(words: WordQueueItem[]) {
    this.queue.push(...words);
    this.startProcessing();
  }

  // 큐 처리 시작
  private startProcessing() {
    if (this.isProcessing || this.queue.length === 0) {
      return;
    }

    this.isProcessing = true;
    this.processNextWord();
  }

  // 다음 단어 처리
  private processNextWord = () => {
    if (this.queue.length === 0) {
      this.isProcessing = false;
      return;
    }

    const wordObj = this.queue.shift()!;

    // State 업데이트 콜백 호출
    this.callbacks.onWordAdded({
      text: wordObj.text,
      isKeyword: wordObj.isKeyword,
      speaker: wordObj.speaker,
    });

    // 키워드 감지 콜백 호출
    if (wordObj.matchedKeyword) {
      this.callbacks.onKeywordDetected(wordObj.matchedKeyword, false);
    }

    // 다음 단어 처리 (100ms 간격으로 타이핑 효과)
    setTimeout(this.processNextWord, 100);
  };

  // 큐 초기화
  clear() {
    this.queue = [];
    this.isProcessing = false;
  }

  // 큐 크기 반환
  getQueueSize() {
    return this.queue.length;
  }
}
