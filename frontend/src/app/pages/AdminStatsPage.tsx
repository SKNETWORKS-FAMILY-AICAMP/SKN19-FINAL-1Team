import MainLayout from '../components/layout/MainLayout';
import { TrendingUp, Users, Phone, Clock, CheckCircle, AlertTriangle, BarChart3 } from 'lucide-react';
import { useMemo } from 'react';
import { employeesData, consultationsData } from '@/data/mock';

export default function AdminStatsPage() {
  // ⭐ Mock 데이터에서 동적으로 통계 계산
  const stats = useMemo(() => {
    const totalCalls = consultationsData.length;
    const totalEmployees = employeesData.length;
    
    // FCR 평균 계산
    const avgFCR = Math.round(
      employeesData.reduce((sum, emp) => sum + (emp.fcr || 0), 0) / employeesData.length
    );
    
    // 평균 처리 시간 계산 (mm:ss 형식)
    const avgSeconds = employeesData.reduce((sum, emp) => {
      const [min, sec] = (emp.avgTime || '0:00').split(':').map(Number);
      return sum + (min * 60 + sec);
    }, 0) / employeesData.length;
    const avgTime = `${Math.floor(avgSeconds / 60)}:${String(Math.floor(avgSeconds % 60)).padStart(2, '0')}`;
    
    return {
      totalCalls,
      totalEmployees,
      avgFCR,
      avgHandleTime: avgTime,
      todayCallsChange: +12,
      fcrChange: +2,
    };
  }, []);

  // ⭐ 팀별 통계 동적 생성
  const teamStats = useMemo(() => {
    const teams = ['상담1팀', '상담2팀', '상담3팀'];
    
    return teams.map(teamName => {
      const teamMembers = employeesData.filter(emp => emp.team === teamName);
      const members = teamMembers.length;
      
      // 팀 상담 건수 (가중 계산)
      const calls = teamMembers.reduce((sum, emp) => sum + (emp.consultations || 0), 0);
      
      // 팀 평균 FCR
      const fcr = members > 0
        ? Math.round(teamMembers.reduce((sum, emp) => sum + (emp.fcr || 0), 0) / members)
        : 0;
      
      // 팀 평균 처리 시간
      const avgSeconds = teamMembers.reduce((sum, emp) => {
        const [min, sec] = (emp.avgTime || '0:00').split(':').map(Number);
        return sum + (min * 60 + sec);
      }, 0) / (members || 1);
      const avgTime = `${Math.floor(avgSeconds / 60)}:${String(Math.floor(avgSeconds % 60)).padStart(2, '0')}`;
      
      // 팀장 찾기 (position이 '팀장'인 사람)
      const leader = teamMembers.find(emp => emp.position === '팀장')?.name || '미정';
      
      return { team: teamName, members, calls, fcr, avgTime, leader };
    });
  }, []);

  // ⭐ 주간 추이 데이터 (실제로는 API에서 가져와야 하지만 Mock으로 생성)
  const dailyTrend = useMemo(() => {
    return [
      { date: '01-01', calls: 198, fcr: 91 },
      { date: '01-02', calls: 215, fcr: 92 },
      { date: '01-03', calls: 234, fcr: 93 },
      { date: '01-04', calls: 256, fcr: 94 },
      { date: '01-05', calls: 287, fcr: 93 },
    ];
  }, []);

  // ⭐ 알림 데이터
  const issueAlerts = useMemo(() => {
    return [
      { type: 'warning', message: '상담3팀 평균 처리시간 목표 초과', time: '2시간 전' },
      { type: 'info', message: '오늘 상담 건수 전일 대비 12% 증가', time: '3시간 전' },
      { type: 'success', message: '상담1팀 FCR 목표 달성 (94%)', time: '5시간 전' },
    ];
  }, []);

  const maxCalls = Math.max(...dailyTrend.map(d => d.calls));

  return (
    <MainLayout>
      <div className="min-h-[calc(100vh-60px)] flex flex-col p-6 gap-4 bg-[#F5F5F5] pb-20">
        {/* Header + KPI Cards in same row */}
        <div className="grid grid-cols-5 gap-4 flex-shrink-0">
          {/* Header Card */}
          <div className="bg-gradient-to-r from-[#0047AB] to-[#003580] text-white rounded-lg shadow-md p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold">총괄 현황</h1>
            </div>
            <p className="text-[11px] opacity-90">실시간 센터 운영 현황</p>
          </div>

          {/* KPI Card 1 */}
          <div className="bg-white rounded-lg shadow-sm p-2.5 border border-[#E0E0E0]">
            <div className="flex items-center justify-between mb-1.5">
              <div className="w-7 h-7 bg-[#E8F1FC] rounded flex items-center justify-center">
                <Phone className="w-3.5 h-3.5 text-[#0047AB]" />
              </div>
              <div className={`text-[10px] px-1.5 py-0.5 rounded ${
                stats.todayCallsChange > 0 ? 'bg-[#E8F5E9] text-[#34A853]' : 'bg-[#FFEBEE] text-[#EA4335]'
              }`}>
                {stats.todayCallsChange > 0 ? '+' : ''}{stats.todayCallsChange}%
              </div>
            </div>
            <div className="text-xl font-bold text-[#333333] mb-0.5">{stats.totalCalls}</div>
            <div className="text-[10px] text-[#666666]">총 상담 건수 (오늘)</div>
          </div>

          {/* KPI Card 2 */}
          <div className="bg-white rounded-lg shadow-sm p-2.5 border border-[#E0E0E0]">
            <div className="flex items-center justify-between mb-1.5">
              <div className="w-7 h-7 bg-[#E8F5E9] rounded flex items-center justify-center">
                <Users className="w-3.5 h-3.5 text-[#34A853]" />
              </div>
            </div>
            <div className="text-xl font-bold text-[#333333] mb-0.5">{stats.totalEmployees}</div>
            <div className="text-[10px] text-[#666666]">총 상담사 수</div>
          </div>

          {/* KPI Card 3 */}
          <div className="bg-white rounded-lg shadow-sm p-2.5 border border-[#E0E0E0]">
            <div className="flex items-center justify-between mb-1.5">
              <div className="w-7 h-7 bg-[#FFF9E6] rounded flex items-center justify-center">
                <CheckCircle className="w-3.5 h-3.5 text-[#FBBC04]" />
              </div>
              <div className={`text-[10px] px-1.5 py-0.5 rounded ${
                stats.fcrChange > 0 ? 'bg-[#E8F5E9] text-[#34A853]' : 'bg-[#FFEBEE] text-[#EA4335]'
              }`}>
                {stats.fcrChange > 0 ? '+' : ''}{stats.fcrChange}%
              </div>
            </div>
            <div className="text-xl font-bold text-[#333333] mb-0.5">{stats.avgFCR}%</div>
            <div className="text-[10px] text-[#666666]">평균 FCR</div>
          </div>

          {/* KPI Card 4 */}
          <div className="bg-white rounded-lg shadow-sm p-2.5 border border-[#E0E0E0]">
            <div className="flex items-center justify-between mb-1.5">
              <div className="w-7 h-7 bg-[#FCE4EC] rounded flex items-center justify-center">
                <Clock className="w-3.5 h-3.5 text-[#E91E63]" />
              </div>
            </div>
            <div className="text-xl font-bold text-[#333333] mb-0.5">{stats.avgHandleTime}</div>
            <div className="text-[10px] text-[#666666]">평균 처리 시간</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 flex-1 min-h-0">
          {/* Team Stats + Chart */}
          <div className="col-span-2 bg-white rounded-xl shadow-sm border border-[#E0E0E0] flex flex-col overflow-hidden">
            <div className="px-5 py-2.5 border-b border-[#E0E0E0] flex-shrink-0">
              <h2 className="font-bold text-[#333333]">팀별 성과</h2>
            </div>
            
            <div className="flex-shrink-0 p-3">
              <table className="w-full">
                <thead className="border-b-2 border-[#E0E0E0]">
                  <tr>
                    <th className="text-left text-xs font-semibold text-[#666666] pb-2">팀명</th>
                    <th className="text-left text-xs font-semibold text-[#666666] pb-2">팀장</th>
                    <th className="text-center text-xs font-semibold text-[#666666] pb-2">인원</th>
                    <th className="text-center text-xs font-semibold text-[#666666] pb-2">상담 건수</th>
                    <th className="text-center text-xs font-semibold text-[#666666] pb-2">FCR</th>
                    <th className="text-center text-xs font-semibold text-[#666666] pb-2">평균 시간</th>
                  </tr>
                </thead>
                <tbody>
                  {teamStats.map((team) => (
                    <tr 
                      key={team.team}
                      className="border-b border-[#F0F0F0] hover:bg-[#F8F9FA]"
                    >
                      <td className="py-2">
                        <span className="font-semibold text-sm text-[#333333]">{team.team}</span>
                      </td>
                      <td className="py-2">
                        <span className="text-sm text-[#666666]">{team.leader}</span>
                      </td>
                      <td className="py-2 text-center">
                        <span className="text-sm text-[#333333]">{team.members}명</span>
                      </td>
                      <td className="py-2 text-center">
                        <span className="text-sm font-semibold text-[#0047AB]">{team.calls}</span>
                      </td>
                      <td className="py-2 text-center">
                        <span className={`text-sm font-semibold ${
                          team.fcr >= 93 ? 'text-[#34A853]' :
                          team.fcr >= 90 ? 'text-[#FBBC04]' :
                          'text-[#EA4335]'
                        }`}>
                          {team.fcr}%
                        </span>
                      </td>
                      <td className="py-2 text-center">
                        <span className="text-sm text-[#666666] font-mono">{team.avgTime}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Daily Trend Chart - 높이 더 낮춤 */}
            <div className="p-3 border-t border-[#E0E0E0] flex-shrink-0">
              <h3 className="text-sm font-semibold text-[#333333] mb-2">주간 추이</h3>
              <div className="flex items-end justify-between h-20 gap-3">
                {dailyTrend.map((day, index) => {
                  const barHeight = (day.calls / maxCalls) * 100;
                  return (
                    <div key={day.date} className="flex-1 flex flex-col items-center">
                      {/* Bar */}
                      <div className="w-full flex flex-col justify-end" style={{ height: '60px' }}>
                        <div 
                          className="w-full bg-gradient-to-t from-[#0047AB] to-[#4A90E2] rounded-t-lg transition-all hover:opacity-80 cursor-pointer relative group"
                          style={{ height: `${barHeight}%` }}
                        >
                          {/* Tooltip */}
                          <div className="absolute -top-14 left-1/2 -translate-x-1/2 bg-[#333333] text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                            <div className="font-semibold">{day.calls}건</div>
                            <div className="text-[10px]">FCR: {day.fcr}%</div>
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-[#333333]"></div>
                          </div>
                          {/* FCR Indicator */}
                          <div 
                            className="absolute top-0 right-0 w-2 h-full bg-[#34A853] rounded-tr-lg"
                            style={{ opacity: day.fcr / 100 }}
                          ></div>
                        </div>
                      </div>
                      {/* Labels */}
                      <div className="text-[10px] text-[#666666] mt-1.5 font-mono">{day.date}</div>
                      <div className="text-[10px] font-semibold text-[#0047AB]">{day.calls}</div>
                    </div>
                  );
                })}
              </div>
              {/* Legend */}
              <div className="flex items-center justify-center gap-4 mt-2 text-xs text-[#666666]">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-[#0047AB] rounded"></div>
                  <span>상담 건수</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-[#34A853] rounded"></div>
                  <span>FCR 달성도</span>
                </div>
              </div>
            </div>
          </div>

          {/* Alerts */}
          <div className="bg-white rounded-xl shadow-sm border border-[#E0E0E0] flex flex-col overflow-hidden">
            <div className="px-5 py-2.5 border-b border-[#E0E0E0] flex-shrink-0">
              <h2 className="font-bold text-[#333333] flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-[#FBBC04]" />
                알림
              </h2>
            </div>
            
            <div className="flex-1 overflow-y-auto p-3">
              <div className="space-y-2.5">
                {issueAlerts.map((alert, index) => (
                  <div 
                    key={index}
                    className={`p-3 rounded-lg border-l-4 ${
                      alert.type === 'warning' ? 'bg-[#FFF9E6] border-[#FBBC04]' :
                      alert.type === 'success' ? 'bg-[#E8F5E9] border-[#34A853]' :
                      'bg-[#E8F1FC] border-[#0047AB]'
                    }`}
                  >
                    <div className="text-sm font-medium text-[#333333] mb-1">{alert.message}</div>
                    <div className="text-xs text-[#666666]">{alert.time}</div>
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