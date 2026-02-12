import { useNavigate } from 'react-router-dom';
import { noticesData, consultationsData, employeesData, simulationsData, dashboardStatsData, weeklyGoalData, teamStatsData, frequentInquiriesDetailData } from '@/data/mock';
import { fetchFrequentInquiries, type FrequentInquiry } from '@/api/frequentInquiriesApi';
import { enrichConsultationData } from '../../data/consultationsDataHelper';
import ConsultationDetailModal from '../components/modals/ConsultationDetailModal';
import AnnouncementModal from '../components/modals/AnnouncementModal';
import FrequentInquiryModal from '../components/modals/FrequentInquiryModal';
import { useState, useEffect } from 'react';
import { CheckCircle, Clock, XCircle, AlertCircle, ExternalLink, Star, TrendingUp, TrendingDown, Minus, Target, Users, BookOpen, Shield, Play } from 'lucide-react';
import MainLayout from '../components/layout/MainLayout';
import { fetchNotices, incrementViewCount, type Notice } from '@/api/noticesApi';
import { fetchTopEmployees, type TopEmployee } from '@/api/employeesApi';
import { fetchConsultations, type ConsultationItem } from '@/api/consultationApi';

// ⭐ Mock 데이터에서 가져오기
const stats = dashboardStatsData;

// ⭐ 우수 상담사는 이제 컴포넌트 내부에서 API로 가져옴 (아래 useEffect 참조)

const weeklyGoal = weeklyGoalData;
const teamStats = teamStatsData;

export default function DashboardPage() {
  const navigate = useNavigate();
  const [selectedConsultation, setSelectedConsultation] = useState<any>(null);
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<any>(null);
  const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);
  const [announcements, setAnnouncements] = useState<Notice[]>([]);
  const [isLoadingNotices, setIsLoadingNotices] = useState(true);
  const [topEmployees, setTopEmployees] = useState<TopEmployee[]>([]);
  const [isLoadingTopEmployees, setIsLoadingTopEmployees] = useState(true);
  const [selectedFrequentInquiry, setSelectedFrequentInquiry] = useState<any>(null);
  const [isFrequentInquiryModalOpen, setIsFrequentInquiryModalOpen] = useState(false);
  const [consultationHistory, setConsultationHistory] = useState<any[]>([]);
  const [isLoadingConsultations, setIsLoadingConsultations] = useState(true);
  const [frequentInquiries, setFrequentInquiries] = useState<FrequentInquiry[]>([]);
  const [isLoadingFrequentInquiries, setIsLoadingFrequentInquiries] = useState(true);

  // 현재 사용자 권한 확인 (localStorage에서)
  const userRole = localStorage.getItem('userRole') || 'employee';

  // ⭐ 공지사항 로드 (API 또는 Mock - USE_MOCK_DATA에 따라 자동 전환)
  useEffect(() => {
    const loadNotices = async () => {
      try {
        setIsLoadingNotices(true);
        const notices = await fetchNotices(10);

        // localStorage에서 pinned 공지 확인
        const saved = localStorage.getItem('pinnedAnnouncements');
        if (saved) {
          const pinnedAnnouncements = JSON.parse(saved);
          if (pinnedAnnouncements.length > 0) {
            const unpinnedNotices = notices.filter(
              (n: Notice) => !pinnedAnnouncements.find((p: any) => p.id === n.id)
            );
            setAnnouncements([...pinnedAnnouncements.slice(0, 5), ...unpinnedNotices].slice(0, 5));
            return;
          }
        }

        setAnnouncements(notices.slice(0, 5));
      } catch (e) {
        console.error('Failed to load notices', e);
        setAnnouncements(noticesData.slice(0, 5)); // fallback to mock
      } finally {
        setIsLoadingNotices(false);
      }
    };
    loadNotices();
  }, []);

  // ⭐ 우수 상담사 로드 (API 또는 Mock - USE_MOCK_DATA에 따라 자동 전환)
  useEffect(() => {
    const loadTopEmployees = async () => {
      try {
        setIsLoadingTopEmployees(true);
        const employees = await fetchTopEmployees(3);
        setTopEmployees(employees);
      } catch (e) {
        console.error('Failed to load top employees', e);
        // fallback to mock
        const fallback = employeesData
          .filter(emp => emp.rank <= 3)
          .sort((a, b) => a.rank - b.rank)
          .map((emp, index) => ({
            id: emp.id,
            name: emp.name,
            title: index === 0 ? `FCR ${emp.fcr}% 달성` : index === 1 ? `평균 ${emp.avgTime} 처리 시간` : `월간 ${emp.consultations}건 상담`,
            team: emp.team,
            rank: emp.rank
          }));
        setTopEmployees(fallback);
      } finally {
        setIsLoadingTopEmployees(false);
      }
    };
    loadTopEmployees();
  }, []);

  // ⭐ 상담 내역 로드 (API 또는 Mock - USE_MOCK_DATA에 따라 자동 전환)
  useEffect(() => {
    const loadConsultations = async () => {
      try {
        setIsLoadingConsultations(true);
        const data = await fetchConsultations({ limit: 20 });

        // 데이터 가공 (title, time, date 추가)
        const enrichedData = data.map((c: ConsultationItem) => {
          const enriched = enrichConsultationData(c);
          return {
            ...enriched,
            title: enriched.memo || enriched.content || '상담 내용',
            time: enriched.datetime?.split(' ')[1] || '',
            date: enriched.datetime?.split(' ')[0] || '',
          };
        });

        setConsultationHistory(enrichedData);
      } catch (e) {
        console.error('Failed to load consultations', e);
        // fallback to mock
        const fallbackData = consultationsData.map(c => {
          const enriched = enrichConsultationData(c);
          return {
            ...enriched,
            title: enriched.memo || '상담 내용',
            time: enriched.datetime.split(' ')[1],
            date: enriched.datetime.split(' ')[0],
          };
        });
        setConsultationHistory(fallbackData);
      } finally {
        setIsLoadingConsultations(false);
      }
    };
    loadConsultations();
  }, []);

  // ⭐ 자주 찾는 문의 로드 (API 또는 Mock - USE_MOCK_DATA에 따라 자동 전환)
  useEffect(() => {
    const loadFrequentInquiries = async () => {
      try {
        setIsLoadingFrequentInquiries(true);
        const inquiries = await fetchFrequentInquiries(5);
        setFrequentInquiries(inquiries);
      } catch (e) {
        console.error('Failed to load frequent inquiries', e);
        setFrequentInquiries([]);
      } finally {
        setIsLoadingFrequentInquiries(false);
      }
    };
    loadFrequentInquiries();
  }, []);

  const handleConsultationClick = (consultation: any) => {
    setSelectedConsultation(consultation);
    setIsConsultationModalOpen(true);
  };

  const handleAnnouncementClick = async (announcement: any) => {
    setSelectedAnnouncement(announcement);
    setIsAnnouncementModalOpen(true);

    // ⭐ 조회수 증가 - API 호출 (Real 모드) 또는 Mock 데이터 업데이트
    const result = await incrementViewCount(announcement.id);

    // UI 상태 업데이트
    const newViewCount = result?.viewCount ?? announcement.views + 1;
    setAnnouncements(prev =>
      prev.map(n =>
        n.id === announcement.id ? { ...n, views: newViewCount } : n
      )
    );

    // selectedAnnouncement도 업데이트
    setSelectedAnnouncement({ ...announcement, views: newViewCount });
  };

  const handleNoticeClick = () => {
    if (userRole === 'admin') {
      navigate('/admin/notice');
    } else {
      navigate('/notice');
    }
  };

  const handleFrequentInquiryClick = (inquiry: any) => {
    setSelectedFrequentInquiry(inquiry);
    setIsFrequentInquiryModalOpen(true);
  };

  return (
    <MainLayout>
      {/* 최대 너비 제한 + 중앙 정렬 (큰 화면 대응) */}
      <div className="h-[calc(100vh-60px)] bg-[#F5F5F5] p-3 sm:p-4 lg:p-6 overflow-hidden flex items-center justify-center">
        <div className="w-full max-w-[1920px] h-full grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 overflow-hidden">
          {/* 좌측 영역 (50%) - 내부 스크롤 */}
          <div className="flex flex-col gap-3 sm:gap-4 overflow-y-auto overflow-x-hidden">
            {/* KPI 카운팅 4개 (모바일 4x1, 태블릿+ 1x4) */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 sm:gap-3 flex-shrink-0">
              <div className="bg-white rounded-lg shadow-sm border border-[#E0E0E0] p-3 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-[#666666] mb-1">총 상담</div>
                  <div className="text-xl sm:text-2xl font-bold text-[#0047AB]">{stats.todayCalls}</div>
                </div>
                <div className="w-8 h-8 sm:w-9 sm:h-9 bg-[#E8F1FC] rounded-full flex items-center justify-center">
                  <Clock className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#0047AB]" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-[#E0E0E0] p-3 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-[#666666] mb-1">완료</div>
                  <div className="text-xl sm:text-2xl font-bold text-[#34A853]">{stats.completed}</div>
                </div>
                <div className="w-8 h-8 sm:w-9 sm:h-9 bg-[#E8F5E9] rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#34A853]" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-[#E0E0E0] p-3 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-[#666666] mb-1">대기중</div>
                  <div className="text-xl sm:text-2xl font-bold text-[#FBBC04]">{stats.pending}</div>
                </div>
                <div className="w-8 h-8 sm:w-9 sm:h-9 bg-[#FFF9E6] rounded-full flex items-center justify-center">
                  <Clock className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#FBBC04]" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-[#E0E0E0] p-3 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-[#666666] mb-1">미완료</div>
                  <div className="text-xl sm:text-2xl font-bold text-[#EA4335]">{stats.incomplete}</div>
                </div>
                <div className="w-8 h-8 sm:w-9 sm:h-9 bg-[#FFEBEE] rounded-full flex items-center justify-center">
                  <XCircle className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#EA4335]" />
                </div>
              </div>
            </div>

            {/* 공지사항 + 금주의 이슈 (스크롤 없이 5개 표시) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 flex-shrink-0">
              <div className="bg-white rounded-lg shadow-sm border border-[#E0E0E0] p-3 sm:p-4 flex flex-col">
                <div className="flex items-center justify-between mb-2 sm:mb-3 flex-shrink-0">
                  <h2 className="text-sm sm:text-base font-bold text-[#333333] flex items-center gap-1.5">
                    📢 공지사항
                  </h2>
                  <button 
                    onClick={handleNoticeClick}
                    className="text-[11px] text-[#0047AB] hover:underline flex items-center gap-1"
                  >
                    더보기 <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
                <div className="flex flex-col justify-between gap-2 flex-1">
                  {announcements.slice(0, 5).map((item) => (
                    <div 
                      key={item.id}
                      onClick={() => handleAnnouncementClick(item)}
                      className="p-2 rounded-lg bg-[#F8F9FA] border border-[#E0E0E0] hover:bg-[#E8F1FC] hover:border-[#0047AB] cursor-pointer transition-all"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-[11px] px-2 py-0.5 rounded font-medium ${
                          item.tag === '긴급' ? 'bg-[#FFEBEE] text-[#EA4335]' :
                          item.tag === '시스템' ? 'bg-[#FFF9E6] text-[#FBBC04]' :
                          'bg-[#E8F1FC] text-[#0047AB]'
                        }`}>
                          [{item.tag}]
                        </span>
                        <span className="text-[11px] text-[#999999]">{item.date}</span>
                      </div>
                      <div className="text-xs sm:text-sm text-[#333333] font-medium line-clamp-1">{item.title}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-[#E0E0E0] p-3 sm:p-4 flex flex-col">
                <h2 className="text-sm sm:text-base font-bold text-[#333333] mb-2 sm:mb-3 flex items-center gap-2 flex-shrink-0">
                  <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#0047AB]" />
                  자주 찾는 문의
                </h2>
                <div className="flex flex-col justify-between gap-2 flex-1">
                  {frequentInquiries.slice(0, 5).map((item) => (
                    <div 
                      key={item.id}
                      onClick={() => handleFrequentInquiryClick(item)}
                      className="p-2 rounded-lg bg-[#F8F9FA] border border-[#E0E0E0] hover:bg-[#E8F1FC] hover:border-[#0047AB] cursor-pointer transition-all"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs sm:text-sm text-[#0047AB] font-bold">{item.keyword}</span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] text-[#666666]">인입</span>
                          <span className="text-xs sm:text-sm font-bold text-[#0047AB]">{item.count}건</span>
                          {item.trend === 'up' && <TrendingUp className="w-3.5 h-3.5 text-[#34A853]"/>}
                          {item.trend === 'down' && <TrendingDown className="w-3.5 h-3.5 text-[#EA4335]"/>}
                          {item.trend === 'same' && <Minus className="w-3.5 h-3.5 text-[#999999]"/>}
                        </div>
                      </div>
                      <p className="text-[11px] text-[#666666] line-clamp-1">{item.question}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 우수사원 사례집 */}
            <div className="bg-white rounded-lg shadow-sm border border-[#E0E0E0] p-3 sm:p-4 flex-shrink-0">
              <h2 className="text-sm sm:text-base font-bold text-[#333333] mb-2 flex items-center gap-1.5">
                <Star className="w-4 h-4 text-[#FBBC04]" />
                우수사원 사례집
              </h2>
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {topEmployees.map((item) => (
                  <div 
                    key={item.id}
                    className="bg-[#FFF9E6] border-l-4 border-[#FBBC04] p-2.5 rounded-lg hover:bg-[#FFF5D6] cursor-pointer transition-all"
                  >
                    <div className="flex items-center gap-1 mb-1">
                      <span className="font-bold text-xs sm:text-sm text-[#333333]">{item.name}</span>
                      <span className="text-[11px] text-[#999999]">({item.team})</span>
                    </div>
                    <div className="text-xs text-[#666666] line-clamp-1">{item.title}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* 이번주 목표 달성률 + 팀별 통계 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 flex-shrink-0">
              {/* 이번주 목표 달성률 */}
              <div className="bg-white rounded-lg shadow-sm border border-[#E0E0E0] p-3 sm:p-4">
                <h2 className="text-sm sm:text-base font-bold text-[#333333] mb-3 flex items-center gap-2">
                  <Target className="w-4 h-4 sm:w-5 sm:h-5 text-[#0047AB]" />
                  이번주 목표 달성률
                </h2>
                <div className="space-y-2">
                  <div className="flex items-end justify-between">
                    <div>
                      <div className="text-[11px] text-[#666666] mb-1">진행률</div>
                      <div className="text-3xl font-bold text-[#0047AB]">{weeklyGoal.percentage}%</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[11px] text-[#666666]">달성/목표</div>
                      <div className="text-sm font-bold text-[#333333]">{weeklyGoal.current} / {weeklyGoal.target}</div>
                    </div>
                  </div>
                  <div className="w-full h-3 bg-[#F5F5F5] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#0047AB] to-[#4A90E2] rounded-full transition-all duration-500"
                      style={{ width: `${weeklyGoal.percentage}%` }}
                    ></div>
                  </div>
                  <div className="text-[11px] text-[#666666] text-center">
                    목표까지 <span className="font-bold text-[#0047AB]">{weeklyGoal.target - weeklyGoal.current}건</span> 남음
                  </div>
                </div>
              </div>

              {/* 팀별 통계 */}
              <div className="bg-white rounded-lg shadow-sm border border-[#E0E0E0] p-3 sm:p-4">
                <h2 className="text-sm sm:text-base font-bold text-[#333333] mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 text-[#0047AB]" />
                  팀별 통계
                </h2>
                <div className="space-y-2.5">
                  {teamStats.map((team, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div 
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: team.color }}
                      ></div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs sm:text-sm font-bold text-[#333333]">{team.team}</span>
                          <span className="text-[11px] text-[#666666]">FCR {team.fcr}%</span>
                        </div>
                        <div className="w-full h-2 bg-[#F5F5F5] rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full transition-all duration-500"
                            style={{ 
                              width: `${(team.calls / Math.max(...teamStats.map(t => t.calls))) * 100}%`,
                              backgroundColor: team.color
                            }}
                          ></div>
                        </div>
                        <div className="text-[11px] text-[#999999] mt-1">{team.calls}건</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 교육 시뮬레이션 */}
            <div className="bg-white rounded-lg shadow-sm border border-[#E0E0E0] p-3 sm:p-4 flex-shrink-0">
              <h2 className="text-sm sm:text-base font-bold text-[#333333] mb-3 flex items-center gap-2">
                <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-[#0047AB]" />
                추천 교육 시뮬레이션
              </h2>
              
              <div className="grid grid-cols-2 gap-3">
                {simulationsData.map((sim) => {
                  const iconMap: { [key: string]: any } = {
                    'Target': Target,
                    'Shield': Shield,
                    'Users': Users,
                    'TrendingUp': TrendingUp
                  };
                  const IconComponent = iconMap[sim.icon];
                  
                  return (
                    <div 
                      key={sim.id}
                      className="p-3 rounded-lg border-2 border-[#E0E0E0] hover:border-[#0047AB] hover:shadow-md cursor-pointer transition-all"
                    >
                      <div className="flex items-start gap-2 mb-2">
                        <div 
                          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: `${sim.color}15` }}
                        >
                          <IconComponent className="w-4 h-4" style={{ color: sim.color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[10px] font-bold mb-0.5" style={{ color: sim.color }}>
                            {sim.category}
                          </div>
                          <h3 className="text-xs font-bold text-[#333333] leading-tight line-clamp-2">
                            {sim.title}
                          </h3>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-2 border-t border-[#E0E0E0]">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                            sim.difficulty === '초급' ? 'bg-[#E8F5E9] text-[#34A853]' :
                            sim.difficulty === '중급' ? 'bg-[#FFF9E6] text-[#FBBC04]' :
                            'bg-[#FFEBEE] text-[#EA4335]'
                          }`}>
                            {sim.difficulty}
                          </span>
                          <span className="flex items-center gap-0.5 text-[10px] text-[#666666]">
                            <Clock className="w-3 h-3" />
                            {sim.duration}
                          </span>
                        </div>
                        <button 
                          className="px-2 py-1 rounded text-[10px] font-semibold text-white flex items-center gap-1"
                          style={{ backgroundColor: sim.color }}
                        >
                          <Play className="w-2.5 h-2.5" />
                          시작
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 우측 영역 - 상담 내역 (50%, 전체 높이) */}
          <div className="bg-white rounded-lg shadow-sm border border-[#E0E0E0] p-3 sm:p-4 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between mb-3 flex-shrink-0">
              <h2 className="text-sm sm:text-base font-bold text-[#333333]">📋 상담 내역</h2>
              <button 
                onClick={() => navigate('/consultation/history')}
                className="text-[11px] text-[#0047AB] hover:underline flex items-center gap-1"
              >
                전체보기 <ExternalLink className="w-3 h-3" />
              </button>
            </div>
            
            <div className="flex-1 flex flex-col gap-2 overflow-y-auto overflow-x-hidden">
              {consultationHistory.slice(0, 20).map((item) => {
                return (
                  <div 
                    key={item.id}
                    onClick={() => handleConsultationClick(item)}
                    className="flex items-center gap-2 sm:gap-2.5 p-2 sm:p-2.5 rounded-lg border border-[#F0F0F0] hover:bg-[#F8F9FA] hover:border-[#E0E0E0] cursor-pointer transition-all flex-shrink-0"
                  >
                    <div className={`flex-shrink-0 w-[50px] sm:w-[55px] px-1.5 py-1 rounded text-[11px] font-medium text-center ${
                      item.status === '완료' ? 'bg-[#E8F5E9] text-[#34A853]' :
                      item.status === '진행중' ? 'bg-[#E3F2FD] text-[#0047AB]' :
                      'bg-[#F5F5F5] text-[#999999]'
                    }`}>
                      {item.status}
                    </div>
                    <div className="flex-shrink-0 flex flex-col gap-1 w-[90px] sm:w-[100px]">
                      <span className="text-[10px] px-1.5 py-0.5 bg-[#0047AB]/10 text-[#0047AB] rounded text-center truncate font-medium">
                        {item.categoryMain}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 bg-[#E8F1FC] text-[#0047AB] rounded text-center truncate">
                        {item.categorySub}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs sm:text-sm text-[#333333] line-clamp-1">{item.title}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[11px] text-[#666666] truncate">{item.customer}</span>
                        <span className="text-[11px] text-[#999999]">{item.time}</span>
                      </div>
                    </div>
                    {item.fcr && (
                      <div className="flex-shrink-0 w-5 h-5 bg-[#34A853] text-white rounded-full flex items-center justify-center text-[10px] font-bold">
                        ✓
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {selectedConsultation && (
        <ConsultationDetailModal
          isOpen={isConsultationModalOpen}
          onClose={() => setIsConsultationModalOpen(false)}
          consultation={selectedConsultation}
        />
      )}

      {selectedAnnouncement && (
        <AnnouncementModal
          isOpen={isAnnouncementModalOpen}
          onClose={() => setIsAnnouncementModalOpen(false)}
          announcement={selectedAnnouncement}
        />
      )}

      {selectedFrequentInquiry && (
        <FrequentInquiryModal
          isOpen={isFrequentInquiryModalOpen}
          onClose={() => setIsFrequentInquiryModalOpen(false)}
          inquiry={selectedFrequentInquiry}
          detailData={frequentInquiriesDetailData}
        />
      )}
    </MainLayout>
  );
}