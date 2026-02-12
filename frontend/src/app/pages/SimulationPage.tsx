import { Play, Clock, TrendingUp, Target, Shield, Users, Star, ChevronLeft, ChevronRight, Award, BookOpen, Lock, Trophy } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useState, useEffect } from 'react';
import { consultationsData, simulationScenariosData, recentAttemptsData } from '@/data/mock';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';

// ⭐ Mock 데이터에서 가져오기
const scenarios = simulationScenariosData;
const recentAttempts = recentAttemptsData;

export default function SimulationPage() {
  const navigate = useNavigate();
  const [consultations, setConsultations] = useState([]);
  const [scenarioPage, setScenarioPage] = useState(1);
  const [bestPracticePage, setBestPracticePage] = useState(1);
  
  const SCENARIOS_PER_PAGE = 4;
  const BEST_PRACTICES_PER_PAGE = 4;
  
  // ⭐ 페이지네이션 계산 (최신순 정렬)
  const bestPractices = consultations
    .filter(c => c.isBestPractice)
    .sort((a, b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime()); // 최신순
  const totalBestPracticePages = Math.ceil(bestPractices.length / BEST_PRACTICES_PER_PAGE);
  const totalScenarioPages = Math.ceil(scenarios.length / SCENARIOS_PER_PAGE);
  
  // ⭐ 현재 페이지 데이터 (1페이지 = 최신, 상단 = 최신)
  const currentBestPractices = bestPractices.slice(
    (bestPracticePage - 1) * BEST_PRACTICES_PER_PAGE, 
    bestPracticePage * BEST_PRACTICES_PER_PAGE
  );
  const currentScenarios = scenarios.slice(
    (scenarioPage - 1) * SCENARIOS_PER_PAGE, 
    scenarioPage * SCENARIOS_PER_PAGE
  );
  
  // 시뮬레이션 시작
  const handleStartSimulation = (scenarioId: string) => {
    sessionStorage.setItem('simulationMode', 'true');
    sessionStorage.setItem('educationType', 'basic');
    sessionStorage.setItem('scenarioId', scenarioId);
    // ⭐ [v25] 교육 카테고리 저장 (시뮬레이션 시작 API 호출용)
    const scenario = scenarios.find(s => s.id === scenarioId);
    if (scenario) {
      sessionStorage.setItem('educationCategory', scenario.category);
    }
    localStorage.removeItem('isGuideModeActive');

    navigate('/consultation/live', {
      state: {
        mode: 'simulation',
        educationType: 'basic',
        scenarioId
      }
    });
  };

  useEffect(() => {
    const loadConsultations = () => {
      const saved = localStorage.getItem('consultations');
      if (saved) {
        try {
          const data = JSON.parse(saved);
          // ⭐ 우수사례 2개 추가 (CS-EMP021, CS-EMP015를 isBestPractice: true로 변경)
          return data.map(c => {
            if (c.id === 'CS-EMP021-202501041520' || c.id === 'CS-EMP015-202501031155') {
              return { ...c, isBestPractice: true };
            }
            return c;
          });
        } catch (error) {
          console.error('상담 데이터 로드 실패:', error);
          return consultationsData.map(c => {
            if (c.id === 'CS-EMP021-202501041520' || c.id === 'CS-EMP015-202501031155') {
              return { ...c, isBestPractice: true };
            }
            return c;
          });
        }
      }
      return consultationsData.map(c => {
        if (c.id === 'CS-EMP021-202501041520' || c.id === 'CS-EMP015-202501031155') {
          return { ...c, isBestPractice: true };
        }
        return c;
      });
    };

    const data = loadConsultations();
    setConsultations(data);
    // ⭐ localStorage에도 저장 (우수사례 추가 반영)
    localStorage.setItem('consultations', JSON.stringify(data));
  }, []);

  return (
    <MainLayout>
      <div className="h-[calc(100vh-60px)] flex flex-col p-3 gap-3 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0047AB] to-[#4A90E2] rounded-lg shadow-sm p-3 text-white border border-[#0047AB] flex-shrink-0">
          <h1 className="text-base font-bold mb-1">교육 시뮬레이션</h1>
          <p className="text-xs opacity-90">실전과 같은 상담 시뮬레이션으로 스킬을 향상시키세요</p>
          
          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3">
            <div className="bg-white/10 rounded-lg p-2 text-center backdrop-blur-sm">
              <div className="text-lg font-bold">{scenarios.filter(s => s.completed).length}</div>
              <div className="text-[10px] opacity-80 mt-0.5">완료한 시나리오</div>
            </div>
            <div className="bg-white/10 rounded-lg p-2 text-center backdrop-blur-sm">
              <div className="flex items-center justify-center gap-1">
                <div className="text-lg font-bold">92</div>
                <Star className="w-3 h-3 text-[#FBBC04] fill-current" />
              </div>
              <div className="text-[10px] opacity-80 mt-0.5">평균 점수</div>
            </div>
            <div className="bg-white/10 rounded-lg p-2 text-center backdrop-blur-sm">
              <div className="text-lg font-bold">{recentAttempts.length}</div>
              <div className="text-[10px] opacity-80 mt-0.5">총 시도 횟수</div>
            </div>
            <div className="bg-white/10 rounded-lg p-2 text-center backdrop-blur-sm">
              <div className="text-lg font-bold">{scenarios.length - scenarios.filter(s => s.locked).length}</div>
              <div className="text-[10px] opacity-80 mt-0.5">이용 가능</div>
            </div>
          </div>
        </div>

        {/* ⭐ Main Content Grid - 고정 높이 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 flex-1 min-h-0 overflow-hidden">
          {/* Left - Scenarios */}
          <div className="lg:col-span-2 flex flex-col gap-3 min-h-0 overflow-hidden">
            {/* ⭐ 우수 상담 사례 - 50% 높이 */}
            {consultations.filter(c => c.isBestPractice).length > 0 && (
              <div className="bg-white rounded-lg shadow-sm h-[calc(50%-6px)] flex flex-col overflow-hidden">
                <div className="p-3 border-b border-[#E0E0E0] flex-shrink-0 flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-bold text-[#333333] flex items-center gap-2">
                      <Award className="w-4 h-4 text-[#FBBC04]" />
                      우수 상담 사례
                    </h2>
                    <p className="text-xs text-[#666666] mt-0.5">실제 우수 상담 사례를 시뮬레이션으로 학습하세요</p>
                  </div>
                  
                  {/* ⭐ 페이지네이션 (항상 표시) */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setBestPracticePage(prev => Math.max(1, prev - 1))}
                      disabled={bestPracticePage === 1}
                      className={`p-1 rounded transition-colors ${
                        bestPracticePage === 1
                          ? 'text-[#CCCCCC] cursor-not-allowed'
                          : 'text-[#FBBC04] hover:bg-[#FFFBF0]'
                      }`}
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    
                    {Array.from({ length: Math.max(1, totalBestPracticePages) }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setBestPracticePage(i + 1)}
                        className={`w-6 h-6 rounded text-[10px] font-medium transition-all ${
                          bestPracticePage === i + 1
                            ? 'bg-[#FBBC04] text-white'
                            : 'bg-[#F0F0F0] text-[#666666] hover:bg-[#FFFBF0]'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => setBestPracticePage(prev => Math.min(Math.max(1, totalBestPracticePages), prev + 1))}
                      disabled={bestPracticePage === totalBestPracticePages || totalBestPracticePages === 0}
                      className={`p-1 rounded transition-colors ${
                        bestPracticePage === totalBestPracticePages || totalBestPracticePages === 0
                          ? 'text-[#CCCCCC] cursor-not-allowed'
                          : 'text-[#FBBC04] hover:bg-[#FFFBF0]'
                      }`}
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                
                <div className="p-3 flex-1 overflow-hidden">
                  {/* ⭐ 모든 여백 12px 통일: 카드 크기 각 방향 2px 확장 */}
                  <div className="flex flex-wrap gap-3 h-full content-start">
                    {currentBestPractices.map((consultation) => (
                      <div 
                        key={consultation.id}
                        className="w-[calc(50%-6px)] border-2 border-[#FBBC04] bg-gradient-to-br from-[#FFFBF0] to-white rounded-lg p-3 hover:shadow-md transition-all cursor-pointer flex flex-col"
                      >
                        <div className="flex items-start justify-between mb-1.5 flex-1">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <div className="flex items-center gap-1 px-1.5 py-0.5 bg-[#FBBC04] text-white text-[10px] rounded-full">
                                <Star className="w-2.5 h-2.5 fill-current" />
                                우수사례
                              </div>
                              {consultation.fcr && (
                                <div className="px-1.5 py-0.5 bg-[#34A853] text-white text-[10px] rounded-full">
                                  FCR
                                </div>
                              )}
                            </div>
                            <h3 className="text-xs font-bold text-[#333333] mb-0.5">{consultation.category}</h3>
                            <p className="text-[11px] text-[#666666] line-clamp-2 mb-1.5">{consultation.content}</p>
                            
                            <div className="flex flex-wrap gap-1.5 mb-1.5">
                              <span className="text-[10px] px-1.5 py-0.5 bg-[#E8F1FC] text-[#0047AB] rounded">
                                상담사: {consultation.agent}
                              </span>
                              <span className="text-[10px] px-1.5 py-0.5 bg-[#F0F0F0] text-[#666666] rounded">
                                {consultation.duration}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between pt-1.5 border-t border-[#FBBC04]/20">
                          <div className="text-[10px] text-[#999999]">
                            {consultation.datetime}
                          </div>
                          
                          <Button 
                            className="text-xs px-2.5 py-1 h-auto bg-[#FBBC04] hover:bg-[#E0A800] text-white"
                            onClick={() => {
                              sessionStorage.setItem('simulationMode', 'true');
                              sessionStorage.setItem('educationType', 'advanced');
                              sessionStorage.setItem('scenarioId', consultation.id);
                              sessionStorage.setItem('educationCategory', consultation.category); // ⭐ [v25]
                              localStorage.removeItem('isGuideModeActive');
                              localStorage.setItem('simulationCase', JSON.stringify(consultation));
                              navigate('/consultation/live', {
                                state: {
                                  mode: 'simulation',
                                  educationType: 'advanced',
                                  scenarioId: consultation.id
                                }
                              });
                            }}
                          >
                            <Play className="w-3 h-3 mr-1" />
                            학습하기
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ⭐ 기본 시나리오 - 50% 높이 */}
            <div className="bg-white rounded-lg shadow-sm h-[calc(50%-6px)] flex flex-col overflow-hidden">
              <div className="p-3 border-b border-[#E0E0E0] flex-shrink-0 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-[#333333] flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-[#0047AB]" />
                    기본 시나리오
                  </h2>
                  <p className="text-xs text-[#666666] mt-0.5">단계별 학습을 통해 상담 스킬을 체계적으로 향상시키세요</p>
                </div>
                
                {/* 페이지네이션 (제목 우측 배치) */}
                {totalScenarioPages > 1 && (
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setScenarioPage(prev => Math.max(1, prev - 1))}
                      disabled={scenarioPage === 1}
                      className={`p-1 rounded transition-colors ${
                        scenarioPage === 1
                          ? 'text-[#CCCCCC] cursor-not-allowed'
                          : 'text-[#0047AB] hover:bg-[#E8F1FC]'
                      }`}
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    
                    {Array.from({ length: totalScenarioPages }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setScenarioPage(i + 1)}
                        className={`w-6 h-6 rounded text-[10px] font-medium transition-all ${
                          scenarioPage === i + 1
                            ? 'bg-[#0047AB] text-white'
                            : 'bg-[#F0F0F0] text-[#666666] hover:bg-[#E8F1FC]'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => setScenarioPage(prev => Math.min(totalScenarioPages, prev + 1))}
                      disabled={scenarioPage === totalScenarioPages}
                      className={`p-1 rounded transition-colors ${
                        scenarioPage === totalScenarioPages
                          ? 'text-[#CCCCCC] cursor-not-allowed'
                          : 'text-[#0047AB] hover:bg-[#E8F1FC]'
                      }`}
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
              
              <div className="p-3 flex-1 overflow-hidden">
                {/* ⭐ 모든 여백 12px 통일: 카드 크기 각 방향 2px 확장 */}
                <div className="flex flex-wrap gap-3 h-full content-start">
                  {currentScenarios.map((scenario) => {
                    // ⭐ 카테고리별 배지 색상
                    const categoryColors: Record<string, { bg: string, text: string }> = {
                      '카드분실': { bg: 'bg-[#FFEBEE]', text: 'text-[#EA4335]' },
                      '해외결제': { bg: 'bg-[#E8F1FC]', text: 'text-[#0047AB]' },
                      '수수료문의': { bg: 'bg-[#FFF9E6]', text: 'text-[#FBBC04]' },
                      '한도증액': { bg: 'bg-[#F3E5F5]', text: 'text-[#9C27B0]' },
                      '연체문의': { bg: 'bg-[#FFF3E0]', text: 'text-[#FF6B35]' },
                      '기타문의': { bg: 'bg-[#F5F5F5]', text: 'text-[#666666]' },
                      '포인트/혜택': { bg: 'bg-[#E8F5E9]', text: 'text-[#34A853]' },
                    };
                    const categoryColor = categoryColors[scenario.category] || categoryColors['기타문의'];
                    
                    return (
                      <div 
                        key={scenario.id}
                        className={`w-[calc(50%-6px)] border-2 rounded-lg p-3 transition-all flex flex-col ${ 
                          scenario.locked 
                            ? 'border-[#E0E0E0] bg-[#F5F5F5] opacity-60' 
                            : scenario.completed
                              ? 'border-[#34A853] bg-[#F0FFF4] hover:shadow-md cursor-pointer'
                              : 'border-[#E0E0E0] hover:border-[#0047AB] hover:shadow-md cursor-pointer'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-1.5 flex-1">
                          <div className="flex-1">
                            {/* ⭐ 1행: 카테고리 배지 + 완료/잠김 상태 */}
                            <div className="flex items-center gap-2 mb-1">
                              <div className={`px-1.5 py-0.5 ${categoryColor.bg} ${categoryColor.text} text-[10px] rounded-full font-medium`}>
                                {scenario.category}
                              </div>
                              {scenario.completed && (
                                <div className="flex items-center gap-1 px-1.5 py-0.5 bg-[#34A853] text-white text-[10px] rounded-full">
                                  <Star className="w-2.5 h-2.5" />
                                  {scenario.score}점
                                </div>
                              )}
                              {scenario.locked && (
                                <Lock className="w-3.5 h-3.5 text-[#999999]" />
                              )}
                            </div>
                            
                            {/* ⭐ 2행: 제목 */}
                            <h3 className="text-xs font-bold text-[#333333] mb-0.5">{scenario.title}</h3>
                            
                            {/* ⭐ 3행: 설명 */}
                            <p className="text-[11px] text-[#666666] line-clamp-2 mb-1.5">{scenario.description}</p>
                            
                            {/* ⭐ 4행: 태그들 */}
                            <div className="flex flex-wrap gap-1.5 mb-1.5">
                              {scenario.tags.map((tag, index) => (
                                <span key={index} className="text-[10px] px-1.5 py-0.5 bg-[#E8F1FC] text-[#0047AB] rounded">
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        {/* ⭐ 5행: 구분선 + 난이도/시간 + 버튼 */}
                        <div className="flex items-center justify-between pt-1.5 border-t border-[#E0E0E0]">
                          <div className="flex items-center gap-3 text-xs text-[#666666]">
                            <div className={`px-2 py-0.5 rounded text-[10px] ${
                              scenario.difficulty === '초급' ? 'bg-[#E8F5E9] text-[#34A853]' :
                              scenario.difficulty === '중급' ? 'bg-[#FFF9E6] text-[#FBBC04]' :
                              'bg-[#FFEBEE] text-[#EA4335]'
                            }`}>
                              {scenario.difficulty}
                            </div>
                            <div className="flex items-center gap-1 text-[10px]">
                              <Clock className="w-3 h-3" />
                              {scenario.duration}
                            </div>
                          </div>
                          
                          <Button 
                            disabled={scenario.locked}
                            onClick={() => !scenario.locked && handleStartSimulation(scenario.id)}
                            className={`text-xs px-2.5 py-1 h-auto ${
                              scenario.locked
                                ? 'bg-[#E0E0E0] text-[#999999] cursor-not-allowed'
                                : 'bg-[#0047AB] hover:bg-[#003580]'
                            }`}
                          >
                            <Play className="w-3 h-3 mr-1" />
                            {scenario.locked ? '잠김' : '시작하기'}
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Right - Recent Attempts */}
          <div className="bg-white rounded-lg shadow-sm flex flex-col overflow-hidden">
            <div className="p-3 border-b border-[#E0E0E0] flex-shrink-0">
              <h2 className="text-sm font-bold text-[#333333] flex items-center gap-2">
                <Trophy className="w-4 h-4 text-[#FBBC04]" />
                최근 기록
              </h2>
            </div>
            
            <div className="p-3 flex-1 overflow-y-auto">
              <div className="space-y-2.5">
                {recentAttempts.map((attempt) => (
                  <div 
                    key={attempt.id}
                    className="border border-[#E0E0E0] rounded-lg p-2.5 hover:shadow-md transition-all cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-1.5">
                      <div className="flex-1">
                        <div className="text-[10px] text-[#999999] mb-0.5">{attempt.scenario}</div>
                        <div className="text-xs font-semibold text-[#333333] line-clamp-2 mb-1.5">
                          {attempt.title}
                        </div>
                      </div>
                      <div className={`text-lg font-bold ml-2 ${
                        attempt.score >= 90 ? 'text-[#34A853]' :
                        attempt.score >= 80 ? 'text-[#FBBC04]' :
                        'text-[#EA4335]'
                      }`}>
                        {attempt.score}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-[10px] text-[#666666]">
                      <span>{attempt.date}</span>
                      <span>{attempt.duration}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}