import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function LoadingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { consultationId } = location.state || {};
  
  // ⭐ consultationId가 없으면 pendingConsultation에서 가져오기
  const pendingConsultation = JSON.parse(localStorage.getItem('pendingConsultation') || '{}');
  const actualConsultationId = consultationId || pendingConsultation.consultationId || '';
  
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);
  
  // 상담사 이름
  const employeeName = localStorage.getItem('employeeName') || '상담사';
  
  // 50개의 따뜻한 메시지 풀 (랜덤 선택용)
  const warmMessages = [
    // 깊은 감사 (15개)
    `${employeeName}님, 오늘도 보이지 않는 곳에서 누군가의 하루를 구해주셨어요`,
    `${employeeName}님, 당신의 목소리 하나로 누군가는 안도의 한숨을 쉬었습니다`,
    `${employeeName}님, 고객의 불안을 잠재워준 그 순간, 당신은 영웅이었어요`,
    `${employeeName}님, 전화 너머 떨리던 목소리를 안심시켜주셨네요`,
    `${employeeName}님, 한 통의 전화가 누군가의 하루 전체를 바꿨습니다`,
    `${employeeName}님, 당신이 건넨 따뜻한 한마디가 위로가 되었을 거예요`,
    `${employeeName}님, 고객의 급한 마음을 진정시켜준 당신이 대단해요`,
    `${employeeName}님, 화난 목소리 뒤에 숨은 상처까지 보듬어주셨네요`,
    `${employeeName}님, 단순한 업무가 아닌 진심으로 대해주셔서 고맙습니다`,
    `${employeeName}님, 고객이 받은 건 답변이 아니라 당신의 마음이었어요`,
    `${employeeName}님, 매뉴얼에 없는 따뜻함을 전해주셨습니다`,
    `${employeeName}님, 지친 하루 끝에서도 친절을 잃지 않으셨네요`,
    `${employeeName}님, 반복되는 질문 속에서도 처음처럼 정성껏 답하셨어요`,
    `${employeeName}님, 고객의 눈물을 닦아준 건 당신의 진심이었습니다`,
    `${employeeName}님, 당신 덕분에 누군가는 오늘을 견딜 수 있었어요`,
    
    // 진심 어린 격려 (15개)
    `${employeeName}님, 힘든 상담 뒤에도 다시 웃을 수 있는 당신이 존경스럽습니다`,
    `${employeeName}님, 감정 노동이 얼마나 힘든지 우리는 알고 있어요`,
    `${employeeName}님, 매일 같은 일상 속에서 빛나는 순간을 만드시네요`,
    `${employeeName}님, 당신의 인내는 조용한 용기입니다`,
    `${employeeName}님, 보이지 않는 곳에서 쌓아온 노력이 빛나고 있어요`,
    `${employeeName}님, 완벽하지 않아도 괜찮아요. 최선을 다하셨으니까요`,
    `${employeeName}님, 하루에도 수십 번 감정을 추스르는 당신이 대단해요`,
    `${employeeName}님, 지친 목소리를 감추고 밝게 인사하는 그 순간이 프로예요`,
    `${employeeName}님, 누군가에게 필요한 사람이 되는 건 쉽지 않은 일입니다`,
    `${employeeName}님, 오늘도 당신은 충분히 잘하고 계세요`,
    `${employeeName}님, 반복되는 일상 속에서도 의미를 만들어가시네요`,
    `${employeeName}님, 스트레스 속에서도 중심을 잃지 않는 당신이 멋져요`,
    `${employeeName}님, 매일의 작은 승리가 모여 당신을 만듭니다`,
    `${employeeName}님, 힘들 때도 있지만, 당신은 해내고 있어요`,
    `${employeeName}님, 쉬운 일은 없지만, 당신은 강합니다`,
    
    // 깊은 위로 (10개)
    `${employeeName}님, 오늘 하루 버텨내신 것만으로도 충분합니다`,
    `${employeeName}님, 힘든 순간에도 당신은 혼자가 아니에요`,
    `${employeeName}님, 때로는 내려놓는 것도 용기입니다`,
    `${employeeName}님, 지친 당신의 마음도 누군가 보듬어주길 바랍니다`,
    `${employeeName}님, 완벽하지 않아도, 당신은 소중합니다`,
    `${employeeName}님, 힘들었던 오늘, 내일은 더 나아질 거예요`,
    `${employeeName}님, 당신도 쉬어갈 자격이 있습니다`,
    `${employeeName}님, 지금 이 순간, 당신의 노고를 기억해주세요`,
    `${employeeName}님, 힘든 상담 뒤에는 스스로를 토닥여주세요`,
    `${employeeName}님, 당신의 감정도 중요합니다. 돌봐주세요`,
    
    // 가치 인정 (10개)
    `${employeeName}님, 당신이 하는 일은 단순 업무가 아닌 누군가의 삶입니다`,
    `${employeeName}님, 세상은 당신 같은 사람이 필요합니다`,
    `${employeeName}님, 당신의 존재 자체가 누군가에게 안전망이에요`,
    `${employeeName}님, 보이지 않는 곳에서 세상을 지탱하고 계시네요`,
    `${employeeName}님, 당신이 만든 작은 변화가 큰 파장을 만듭니다`,
    `${employeeName}님, 당신의 목소리는 누군가에게 희망이었어요`,
    `${employeeName}님, 평범한 일상 속에서 비범함을 만드시네요`,
    `${employeeName}님, 당신의 공감 하나가 세상을 조금 더 따뜻하게 해요`,
    `${employeeName}님, 숫자로 측정할 수 없는 가치를 만들고 계세요`,
    `${employeeName}님, 당신은 이 자리에 있을 자격이 충분합니다`
  ];
  
  // 3개의 메시지 (1번 랜덤, 2-3번 고정) - useState로 한 번만 선택
  const [messages] = useState(() => {
    // 최근 10개 메시지 인덱스 가져오기
    const recentIndices = JSON.parse(localStorage.getItem('recentWarmMessages') || '[]');
    
    // 사용 가능한 인덱스 풀 (최근 10개 제외)
    const availableIndices = [];
    for (let i = 0; i < warmMessages.length; i++) {
      if (!recentIndices.includes(i)) {
        availableIndices.push(i);
      }
    }
    
    // 사용 가능한 인덱스가 너무 적으면 초기화 (안전장치)
    if (availableIndices.length < 10) {
      localStorage.removeItem('recentWarmMessages');
      availableIndices.length = 0;
      for (let i = 0; i < warmMessages.length; i++) {
        availableIndices.push(i);
      }
    }
    
    // 랜덤 선택
    const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
    
    // 최근 목록에 추가 (최대 10개 유지)
    const updatedRecent = [randomIndex, ...recentIndices].slice(0, 10);
    localStorage.setItem('recentWarmMessages', JSON.stringify(updatedRecent));
    
    return [
      warmMessages[randomIndex], // 랜덤 (최근 10개 제외)
      '상담에만 집중하실 수 있도록 저희가 도와드릴게요', // 고정
      '평균 45초면 후처리가 완성됩니다' // 고정
    ];
  });

  // 단계별 메시지 (점 3개 추가)
  const stepMessages = [
    '상담 데이터 저장중...',
    '상담 내용 분석중...',
    'AI 요약본 생성중...',
    '문서 완성중...'
  ];

  useEffect(() => {
    // 진행률 증가 (10초 동안 100%까지)
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 100;
        return prev + 1;
      });
    }, 100);

    // 메시지 순환 (3.5초마다 - 마지막 메시지도 충분히 보이도록)
    const messageInterval = setInterval(() => {
      setMessageIndex(prev => (prev + 1) % messages.length);
    }, 3500);

    // 단계별 순차 진행 (2.5초씩)
    const step0 = setTimeout(() => setCurrentStep(0), 0);
    const step1 = setTimeout(() => setCurrentStep(1), 2500);
    const step2 = setTimeout(() => setCurrentStep(2), 5000);
    const step3 = setTimeout(() => setCurrentStep(3), 7500);

    // LLM 분석 완료 이벤트
    const handleComplete = () => {
      setProgress(100);
      setCurrentStep(3);
      
      // 페이드아웃 후 이동 (0.8초로 빠르게 조정)
      setIsFadingOut(true);
      setTimeout(() => {
        sessionStorage.setItem('fromLoading', 'true');
        const isSimulationMode = sessionStorage.getItem('simulationMode') === 'true';
        const educationType = sessionStorage.getItem('educationType') || 'basic';
        navigate('/acw', {
          state: {
            mode: isSimulationMode ? 'simulation' : 'normal',
            educationType: educationType
          }
        });
      }, 800);
    };

    window.addEventListener('llmAnalysisComplete', handleComplete);

    // 10초 타임아웃
    const minTimeout = setTimeout(() => {
      setIsFadingOut(true);
      setTimeout(() => {
        sessionStorage.setItem('fromLoading', 'true');
        const isSimulationMode = sessionStorage.getItem('simulationMode') === 'true';
        const educationType = sessionStorage.getItem('educationType') || 'basic';
        navigate('/acw', {
          state: {
            mode: isSimulationMode ? 'simulation' : 'normal',
            educationType: educationType
          }
        });
      }, 800);
    }, 10000);

    return () => {
      clearInterval(progressInterval);
      clearInterval(messageInterval);
      clearTimeout(step0);
      clearTimeout(step1);
      clearTimeout(step2);
      clearTimeout(step3);
      clearTimeout(minTimeout);
      window.removeEventListener('llmAnalysisComplete', handleComplete);
    };
  }, [navigate, messages.length]);

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#0047AB] via-[#003580] to-[#001E40] relative px-6 py-12"
    >
      {/* 그리드 패턴 배경 */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA0IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40"></div>
      
      <div className="relative max-w-4xl w-full space-y-12">
        {/* 로고 */}
        <div className="text-center">
          <h1 className="text-5xl font-extrabold text-white mb-3 tracking-wider">
            CALL<span className="text-[#FBBC04] font-black tracking-normal" style={{ fontFamily: 'ui-monospace, monospace' }}>:</span>ACT
          </h1>
          <p className="text-sm text-white/60 tracking-widest uppercase font-light">
            AI 상담 분석 시스템
          </p>
        </div>

        {/* 순환 메시지 (감성적 폰트) */}
        <div className="relative h-20 flex items-center justify-center px-8">
          {messages.map((msg, index) => {
            const isActive = messageIndex === index;
            return (
              <div
                key={index}
                className="absolute inset-0 flex items-center justify-center"
                style={{
                  transition: isActive 
                    ? 'opacity 2s ease-in-out, transform 2s ease-in-out' 
                    : 'opacity 0.8s ease-in-out, transform 0.8s ease-in-out',
                  opacity: isActive ? 1 : 0,
                  transform: isActive ? 'scale(1)' : 'scale(0.96)'
                }}
              >
                <p 
                  className="text-center text-base text-white leading-loose px-4 truncate"
                  style={{
                    fontWeight: 250,
                    letterSpacing: '0.05em',
                    lineHeight: '1.8',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Helvetica Neue", sans-serif',
                    textShadow: '0 2px 20px rgba(0, 0, 0, 0.3)',
                    width: '100%',
                    maxWidth: '100%'
                  }}
                >
                  {msg}
                </p>
              </div>
            );
          })}
        </div>

        {/* 진행률 바 + 상태 (왼쪽 상단에 작게) */}
        <div className="space-y-2 px-4 max-w-lg mx-auto w-full">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-white/60 font-light tracking-wide">
              {stepMessages[currentStep]}
            </span>
            <span className="text-xs text-white/80 font-normal">
              {progress}%
            </span>
          </div>
          <div className="bg-white/10 h-0.5 rounded-full overflow-hidden backdrop-blur-sm">
            <div 
              className="bg-gradient-to-r from-white via-[#FBBC04] to-white h-full rounded-full transition-all duration-500 ease-out shadow-lg"
              style={{ width: `${progress}%` }}
            >
              <div className="h-full w-full bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"></div>
            </div>
          </div>
        </div>

        {/* 상담 정보 */}
        {actualConsultationId && (
          <div className="text-center px-4">
            <div className="inline-block px-5 py-2.5 bg-white/8 backdrop-blur-sm rounded-lg border border-white/15">
              <p className="text-xs text-white/50 mb-0.5 font-light">상담 ID</p>
              <p className="text-sm font-medium text-white tracking-wide">{actualConsultationId}</p>
            </div>
          </div>
        )}
      </div>

      {/* 하얀색 페이드 오버레이 (디졸브 효과) */}
      <div 
        className={`absolute inset-0 bg-white transition-opacity duration-1200 ease-in-out pointer-events-none ${
          isFadingOut ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ zIndex: 100 }}
      />

      {/* 애니메이션 */}
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 3s infinite;
        }
      `}</style>
    </div>
  );
}