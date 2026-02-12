/**
 * ⭐ Phase 10: 마스킹 텍스트 컴포넌트
 * 
 * Toss CRM 방식 실명 노출:
 * - 기본: 마스킹된 텍스트 표시
 * - 클릭 시: 실명 노출 (3-5초)
 * - 타이머 종료 후: 자동 마스킹
 */

import { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface MaskedTextProps {
  originalText: string;
  maskedText: string;
  type: 'name' | 'phone' | 'cardNumber';
  duration?: number; // 노출 시간 (ms, 기본 3000)
  className?: string;
  showIcon?: boolean; // 아이콘 표시 여부 (기본 true)
}

/**
 * 마스킹 텍스트 컴포넌트
 * 
 * @param originalText - 원본 텍스트 (예: "김민수")
 * @param maskedText - 마스킹된 텍스트 (예: "김*수")
 * @param type - 텍스트 타입 (name/phone/cardNumber)
 * @param duration - 실명 노출 시간 (기본 3초)
 * @param className - 추가 스타일
 * @param showIcon - 아이콘 표시 여부
 */
export function MaskedText({
  originalText,
  maskedText,
  type,
  duration = 3000,
  className = '',
  showIcon = true,
}: MaskedTextProps) {
  const [isRevealed, setIsRevealed] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);

  useEffect(() => {
    if (!isRevealed) return;

    // 타이머 시작
    setRemainingTime(Math.ceil(duration / 1000));

    const countdownInterval = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const hideTimeout = setTimeout(() => {
      setIsRevealed(false);
      setRemainingTime(0);
    }, duration);

    return () => {
      clearTimeout(hideTimeout);
      clearInterval(countdownInterval);
    };
  }, [isRevealed, duration]);

  const handleClick = () => {
    if (!isRevealed) {
      setIsRevealed(true);
    }
  };

  // 타입별 레이블
  const typeLabel = {
    name: '이름',
    phone: '전화번호',
    cardNumber: '카드번호',
  }[type];

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <span
        className={`font-medium ${
          isRevealed ? 'text-[#0047AB]' : 'text-[#333333]'
        }`}
      >
        {isRevealed ? originalText : maskedText}
      </span>

      {showIcon && (
        <button
          onClick={handleClick}
          disabled={isRevealed}
          className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] transition-all ${
            isRevealed
              ? 'bg-[#E8F1FC] text-[#0047AB] cursor-default'
              : 'bg-[#F5F5F5] text-[#999999] hover:bg-[#E0E0E0] hover:text-[#666666] cursor-pointer'
          }`}
          title={isRevealed ? `${remainingTime}초 후 자동 마스킹` : `${typeLabel} 보기 (3초)`}
        >
          {isRevealed ? (
            <>
              <EyeOff className="w-3 h-3" />
              <span>{remainingTime}초</span>
            </>
          ) : (
            <>
              <Eye className="w-3 h-3" />
              <span>보기</span>
            </>
          )}
        </button>
      )}
    </div>
  );
}

/**
 * 간단한 인라인 마스킹 텍스트 (아이콘 없음, 클릭만으로 노출)
 * ⭐ Phase 10-2: UI 개선 - 버튼 제거, 깔끔한 디자인
 */
export function InlineMaskedText({
  originalText,
  maskedText,
  duration = 3000,
  className = '',
}: Omit<MaskedTextProps, 'type' | 'showIcon'>) {
  const [isRevealed, setIsRevealed] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);

  useEffect(() => {
    if (!isRevealed) return;

    // 타이머 시작
    setRemainingTime(Math.ceil(duration / 1000));

    const countdownInterval = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const hideTimeout = setTimeout(() => {
      setIsRevealed(false);
      setRemainingTime(0);
    }, duration);

    return () => {
      clearTimeout(hideTimeout);
      clearInterval(countdownInterval);
    };
  }, [isRevealed, duration]);

  const handleClick = () => {
    if (!isRevealed) {
      setIsRevealed(true);
    }
  };

  return (
    <span
      onClick={handleClick}
      className={`inline-flex items-center gap-0.5 cursor-pointer select-none transition-all ${
        isRevealed 
          ? 'text-[#0047AB] font-semibold' 
          : 'text-[#333333] hover:text-[#0047AB] hover:underline decoration-dotted underline-offset-2'
      } ${className}`}
      title={isRevealed ? `${remainingTime}초 후 자동 마스킹` : '클릭하여 보기 (3초)'}
    >
      <span>{isRevealed ? originalText : maskedText}</span>
      {isRevealed && (
        <span className="text-[9px] text-[#0047AB] opacity-70 shrink-0">
          {remainingTime}s
        </span>
      )}
    </span>
  );
}