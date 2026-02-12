import { useEffect, useState } from 'react';
import { X, ChevronRight, ChevronLeft } from 'lucide-react';
import { Button } from '../ui/button';
import { calculateOffset } from '@/config/tutorialConfig';

export interface TutorialStep {
  id: string;
  targetId?: string; // 타겟 요소의 ID (환영 팝업은 없음)
  title: string;
  description: string;
  position?: 'top' | 'bottom' | 'left' | 'right'; // 말풍선 위치
}

interface TutorialGuideProps {
  steps: TutorialStep[];
  isActive: boolean;
  onComplete: () => void;
  onSkip: () => void;
  themeColor?: string;
  onStepChange?: (stepIndex: number) => void; // ⭐ 단계 변경 콜백 추가
  hideOverlay?: boolean; // ⭐ Phase 3에서 오버레이 숨김
}

export function TutorialGuide({ 
  steps, 
  isActive, 
  onComplete, 
  onSkip,
  themeColor = '#10B981', // Emerald-500
  onStepChange,
  hideOverlay
}: TutorialGuideProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [showSkipConfirm, setShowSkipConfirm] = useState(false);
  const [isPositionCalculated, setIsPositionCalculated] = useState(false); // ⭐ 위치 계산 완료 여부
  const [isProcessing, setIsProcessing] = useState(false); // ⭐ 중복 호출 방지

  // ⭐ Phase 전환 시 currentStep 초기화 (steps 배열이 바뀌면 0부터 시작)
  useEffect(() => {
    if (isActive) {
      setCurrentStep(0);
      setIsPositionCalculated(false); // 위치 재계산 필요
      console.log('🔄 [TutorialGuide] Phase 전환 감지 → currentStep 초기화');
    }
  }, [steps, isActive]); // steps 또는 isActive가 바뀔 때마다 초기화

  const currentStepData = steps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;
  const isWelcomeStep = !currentStepData?.targetId;

  // ⭐ 키보드 네비게이션 (C안: Tab + 화살표 + ESC)
  useEffect(() => {
    if (!isActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // 건너뛰기 확인 모달이 열려있을 때
      if (showSkipConfirm) {
        if (e.key === 'Escape') {
          e.preventDefault();
          e.stopPropagation(); // ⭐ 이벤트 전파 차단
          cancelSkipAll();
        } else if (e.key === 'Enter') {
          e.preventDefault();
          e.stopPropagation(); // ⭐ 이벤트 전파 차단
          confirmSkipAll();
        }
        return;
      }

      // 일반 가이드 진행 중
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          e.stopPropagation(); // ⭐ 이벤트 전파 차단
          if (!isFirstStep) handlePrevious();
          break;
        case 'ArrowRight':
          e.preventDefault();
          e.stopPropagation(); // ⭐ 이벤트 전파 차단
          if (!isLastStep) handleNext();
          break;
        case 'Enter':
          e.preventDefault();
          e.stopPropagation(); // ⭐ 이벤트 전파 차단 - 실제 버튼까지 전달되지 않도록
          handleNext();
          break;
        case 'Escape':
          e.preventDefault();
          e.stopPropagation(); // ⭐ 이벤트 전파 차단
          handleSkipAll();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isActive, showSkipConfirm, currentStep, isFirstStep, isLastStep]);

  // 타겟 요소의 위치를 계산하여 말풍선 위치 설정
  useEffect(() => {
    if (!isActive || isWelcomeStep || showSkipConfirm) return;

    const updatePosition = () => {
      const targetElement = document.getElementById(currentStepData.targetId!);
      if (!targetElement) return;

      const rect = targetElement.getBoundingClientRect();
      const position = currentStepData.position || 'bottom';
      
      const tooltipWidth = 380; // 말풍선 너비
      const tooltipHeight = 260; // 말풍선 높이 (대략)
      const gap = 20; // 타겟과 말풍선 사이 간격
      const padding = 20; // 화면 경계로부터의 최소 여백

      let top = 0;
      let left = 0;

      // ⭐ targetId별 오프셋 조정 (픽셀 단위 미세 조정용)
      const offsetX = calculateOffset(currentStepData.targetId!, rect, 'x');
      const offsetY = calculateOffset(currentStepData.targetId!, rect, 'y');

      // ⭐ transform 없이 정확한 위치 계산 (말풍선 좌상단 기준)
      switch (position) {
        case 'top':
          // 타겟 위쪽, 가로 중앙 정렬
          top = rect.top - tooltipHeight - gap;
          left = rect.left + (rect.width / 2) - (tooltipWidth / 2);
          // 화면 상단 경계 체크
          if (top < padding) {
            top = rect.bottom + gap; // 하단으로 변경
          }
          break;
        case 'bottom':
          // 타겟 아래쪽, 가로 중앙 정렬
          top = rect.bottom + gap;
          left = rect.left + (rect.width / 2) - (tooltipWidth / 2);
          // 화면 하단 경계 체크
          if (top + tooltipHeight > window.innerHeight - padding) {
            top = Math.max(padding, window.innerHeight - tooltipHeight - padding);
          }
          break;
        case 'left':
          // 타겟 왼쪽, 세로 중앙 정렬
          top = rect.top + (rect.height / 2) - (tooltipHeight / 2);
          left = rect.left - tooltipWidth - gap;
          // 화면 좌측 경계 체크
          if (left < padding) {
            left = rect.right + gap; // 우측으로 변경
          }
          break;
        case 'right':
          // 타겟 오른쪽, 세로 중앙 정렬
          top = rect.top + (rect.height / 2) - (tooltipHeight / 2);
          left = rect.right + gap;
          // 화면 우측 경계 체크
          if (left + tooltipWidth > window.innerWidth - padding) {
            left = rect.left - tooltipWidth - gap; // 좌측으로 변경
          }
          break;
      }

      // offsetX, offsetY 적용 (미세 조정)
      top += offsetY;
      left += offsetX;

      setTooltipPosition({ top, left });

      // 하이라이트 효과 적용 - ⭐ info-cards-area는 더 큰 패딩 적용
      const isInfoCardsArea = currentStepData.targetId === 'info-cards-area';
      const horizontalPadding = isInfoCardsArea ? 3 : 0;
      const verticalPadding = isInfoCardsArea ? 6 : 0;
      
      if (isInfoCardsArea) {
        // 패딩 적용 (레이아웃 변경 없이 시각적 확장)
        targetElement.style.padding = `${verticalPadding}px ${horizontalPadding}px`;
        targetElement.style.margin = `-${verticalPadding}px -${horizontalPadding}px`;
      }
      
      targetElement.style.position = 'relative';
      targetElement.style.zIndex = '10001';
      targetElement.style.transition = 'box-shadow 0.3s ease';
      targetElement.style.boxShadow = `0 0 0 4px ${themeColor}40, 0 0 20px ${themeColor}60`;
      targetElement.style.borderRadius = '8px';
      
      // ⭐ 즉시 표시 (delay 제거)
      setIsPositionCalculated(true);
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);

      // 하이라이트 제거
      const targetElement = document.getElementById(currentStepData.targetId!);
      if (targetElement) {
        targetElement.style.zIndex = '';
        targetElement.style.boxShadow = '';
        // ⭐ info-cards-area 패딩/마진 초기화
        if (currentStepData.targetId === 'info-cards-area') {
          targetElement.style.padding = '';
          targetElement.style.margin = '';
        }
      }
    };
  }, [currentStep, isActive, isWelcomeStep, showSkipConfirm, currentStepData, themeColor]);

  const handleNext = () => {
    console.log('🎯 handleNext 실행 시작');
    console.log('  - currentStep:', currentStep);
    console.log('  - isLastStep:', isLastStep);
    console.log('  - steps.length:', steps.length);
    console.log('  - currentStepData:', currentStepData);
    console.log('  - isActive:', isActive);
    
    if (isLastStep) {
      console.log('  → 마지막 단계 → handleComplete() 호출');
      handleComplete();
    } else {
      const nextStep = currentStep + 1;
      console.log('  → 다음 단계로 이동:', nextStep);
      console.log('  → 다음 스텝 정보:', steps[nextStep]);
      console.log('  → setCurrentStep(' + nextStep + ') 호출');
      setCurrentStep(nextStep);
      console.log('  → onStepChange 콜백 호출');
      if (onStepChange) onStepChange(nextStep);
      console.log('  ✅ handleNext 완료');
    }
  };

  const handlePrevious = () => {
    if (!isFirstStep) {
      setCurrentStep(prev => prev - 1);
      if (onStepChange) onStepChange(currentStep - 1);
    }
  };

  const handleComplete = () => {
    if (dontShowAgain) {
      localStorage.setItem('tutorial-completed', 'true');
    }
    onComplete();
  };

  const handleSkipAll = () => {
    setShowSkipConfirm(true);
  };

  const confirmSkipAll = () => {
    onSkip();
    setShowSkipConfirm(false);
  };

  const cancelSkipAll = () => {
    setShowSkipConfirm(false);
  };

  if (!isActive) return null;

  return (
    <>
      {/* 반투명 오버레이 (블러 제거) */}
      {!hideOverlay && (
        <div 
          className="fixed inset-0 bg-black/50 z-[10000] transition-opacity duration-300"
          style={{ opacity: isActive ? 1 : 0 }}
        />
      )}

      {/* 환영 팝업 (중앙 모달) */}
      {isWelcomeStep && (
        <div className="fixed inset-0 z-[10001] flex items-center justify-center p-4">
          <div 
            className="bg-white rounded-lg shadow-2xl max-w-md w-full p-5 transition-all duration-300"
            style={{ borderTop: `3px solid ${themeColor}` }}
          >
            {!showSkipConfirm ? (
              <>
                {/* 헤더 */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white text-lg font-bold"
                      style={{ backgroundColor: themeColor }}
                    >
                      🎓
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-gray-900">{currentStepData.title}</h2>
                      <p className="text-xs text-gray-500">교육 시뮬레이션 모드</p>
                    </div>
                  </div>
                  <button
                    onClick={handleSkipAll}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* 내용 */}
                <div className="mb-4">
                  <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-line">
                    {currentStepData.description}
                  </p>
                </div>

                {/* 진행 상황 */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-[10px] text-gray-500 mb-1.5">
                    <span>진행 상황</span>
                    <span>{currentStep + 1} / {steps.length}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className="h-1.5 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${((currentStep + 1) / steps.length) * 100}%`,
                        backgroundColor: themeColor 
                      }}
                    />
                  </div>
                </div>

                {/* 액션 버튼 */}
                <div className="flex items-center justify-between gap-2">
                  <Button
                    variant="outline"
                    onClick={handleSkipAll}
                    size="sm"
                    className="flex-1 h-8 text-xs"
                  >
                    건너뛰기
                  </Button>
                  <Button
                    onClick={handleNext}
                    size="sm"
                    className="flex-1 h-8 text-xs text-white"
                    style={{ backgroundColor: themeColor }}
                  >
                    시작하기
                    <ChevronRight className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              </>
            ) : (
              <>
                {/* 건너뛰기 확인 화면 - 같은 모달 크기 유지 */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white text-lg font-bold"
                      style={{ backgroundColor: themeColor }}
                    >
                      ⚠️
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-gray-900">교육 가이드 건너뛰기</h2>
                      <p className="text-xs text-gray-500">정말로 건너뛰시겠습니까?</p>
                    </div>
                  </div>
                  <button
                    onClick={cancelSkipAll}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* 내용 */}
                <div className="mb-4">
                  <p className="text-xs text-gray-700 leading-relaxed">
                    교육 가이드를 건너뛰면 다시 볼 수 없습니다.{'\n'}
                    계속 진행하시겠습니까?
                  </p>
                </div>

                {/* 액션 버튼 */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={cancelSkipAll}
                    size="sm"
                    className="flex-1 h-8 text-xs"
                  >
                    취소
                  </Button>
                  <Button
                    onClick={confirmSkipAll}
                    size="sm"
                    className="flex-1 h-8 text-xs text-white"
                    style={{ backgroundColor: themeColor }}
                  >
                    건너뛰기
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* 말풍선 가이드 - 위치 계산 완료 후에만 표시 (애니메이션 개선) */}
      {!isWelcomeStep && isPositionCalculated && (
        <div
          className="fixed z-[10001] transition-all duration-300 ease-out"
          style={{
            top: `${tooltipPosition.top}px`,
            left: `${tooltipPosition.left}px`,
            transform: getTransformByPosition(currentStepData.position || 'bottom'),
          }}
        >
          <div 
            className="bg-white rounded-lg shadow-xl w-[380px] p-4 relative border border-gray-100"
          >
            {!showSkipConfirm && (
              <>
                {/* 화살표 */}
                <div
                  className="absolute w-3 h-3 bg-white border-gray-100 transform rotate-45"
                  style={getArrowStyle(currentStepData.position || 'bottom', themeColor)}
                />
              </>
            )}

            {!showSkipConfirm ? (
              <>
                {/* 헤더 */}
                <div className="flex items-center justify-between mb-2.5">
                  <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                    <span 
                      className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold"
                      style={{ backgroundColor: themeColor }}
                    >
                      {currentStep}
                    </span>
                    {currentStepData.title}
                  </h3>
                  <button
                    onClick={handleSkipAll}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* 내용 */}
                <p className="text-xs text-gray-700 mb-3 leading-relaxed whitespace-pre-line">
                  {currentStepData.description}
                </p>

                {/* 진행 상황 */}
                <div className="mb-3">
                  <div className="flex items-center justify-between text-[10px] text-gray-500 mb-1.5">
                    <span>{currentStep + 1} / {steps.length}</span>
                    <div className="flex gap-0.5">
                      {steps.map((_, idx) => (
                        <div
                          key={idx}
                          className="w-1 h-1 rounded-full transition-all duration-300"
                          style={{
                            backgroundColor: idx <= currentStep ? themeColor : '#E5E7EB'
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* 마지막 단계: 다시 보지 않기 */}
                {isLastStep && (
                  <label className="flex items-center gap-1.5 mb-3 text-xs text-gray-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={dontShowAgain}
                      onChange={(e) => setDontShowAgain(e.target.checked)}
                      className="rounded w-3 h-3"
                      style={{ accentColor: themeColor }}
                    />
                    <span>다시 보지 않기</span>
                  </label>
                )}

                {/* 액션 버튼 */}
                <div className="flex items-center justify-between gap-1.5">
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={isFirstStep}
                    size="sm"
                    className="h-7 text-[11px] px-2"
                  >
                    <ChevronLeft className="w-3 h-3" />
                    이전
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleSkipAll}
                    size="sm"
                    className="h-7 text-[11px] px-2"
                  >
                    건너뛰기
                  </Button>
                  <Button
                    onClick={handleNext}
                    size="sm"
                    className="h-7 text-[11px] px-2 text-white"
                    style={{ backgroundColor: themeColor }}
                  >
                    {isLastStep ? '완료' : '다음'}
                    {!isLastStep && <ChevronRight className="w-3 h-3 ml-0.5" />}
                  </Button>
                </div>
              </>
            ) : (
              <>
                {/* 건너뛰기 확인 화면 - 같은 말풍선 크기 유지 */}
                <div className="flex items-center justify-between mb-2.5">
                  <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                    <span 
                      className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold"
                      style={{ backgroundColor: themeColor }}
                    >
                      ⚠️
                    </span>
                    건너뛰기 확인
                  </h3>
                  <button
                    onClick={cancelSkipAll}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* 내용 */}
                <p className="text-xs text-gray-700 mb-3 leading-relaxed">
                  교육 가이드를 건너뛰면 다시 볼 수 없습니다.{'\n'}
                  정말로 건너뛰시겠습니까?
                </p>

                {/* 액션 버튼 */}
                <div className="flex items-center gap-1.5">
                  <Button
                    variant="outline"
                    onClick={cancelSkipAll}
                    size="sm"
                    className="flex-1 h-7 text-[11px]"
                  >
                    취소
                  </Button>
                  <Button
                    onClick={confirmSkipAll}
                    size="sm"
                    className="flex-1 h-7 text-[11px] text-white"
                    style={{ backgroundColor: themeColor }}
                  >
                    건너뛰기
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

// 말풍선 위치에 따른 transform 계산
function getTransformByPosition(position: string): string {
  // ⭐ top/left로 이미 정확한 위치를 계산했으므로 transform은 사용하지 않음
  return 'translate(0, 0)';
}

// 화살표 스타일 계산
function getArrowStyle(position: string, color: string): React.CSSProperties {
  const baseStyle: React.CSSProperties = {
    boxShadow: 'none',
  };

  switch (position) {
    case 'top':
      return { ...baseStyle, bottom: '-6px', left: '50%', marginLeft: '-6px', borderLeft: '1px solid #E5E7EB', borderTop: '1px solid #E5E7EB', borderRight: 'none', borderBottom: 'none' };
    case 'bottom':
      return { ...baseStyle, top: '-6px', left: '50%', marginLeft: '-6px', borderRight: '1px solid #E5E7EB', borderBottom: '1px solid #E5E7EB', borderLeft: 'none', borderTop: 'none' };
    case 'left':
      return { ...baseStyle, right: '-6px', top: '50%', marginTop: '-6px', borderTop: '1px solid #E5E7EB', borderLeft: '1px solid #E5E7EB', borderRight: 'none', borderBottom: 'none' };
    case 'right':
      return { ...baseStyle, left: '-6px', top: '50%', marginTop: '-6px', borderRight: '1px solid #E5E7EB', borderBottom: '1px solid #E5E7EB', borderLeft: 'none', borderTop: 'none' };
    default:
      return { ...baseStyle, top: '-6px', left: '50%', marginLeft: '-6px', borderRight: '1px solid #E5E7EB', borderBottom: '1px solid #E5E7EB' };
  }
}