import { TrendingUp, TrendingDown, Trophy, ChevronLeft, ChevronRight, Search, UserPlus } from 'lucide-react';
import { useState, useEffect } from 'react';
import MainLayout from '../components/layout/MainLayout';
import { employeesData } from '@/data/mock';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Pagination } from '../components/ui/pagination_component';
import { fetchEmployees, type Employee } from '@/api/employeesApi';
import { USE_MOCK_DATA } from '@/config/mockConfig';

const itemsPerPage = 20; // 페이지당 표시할 사원 수

export default function EmployeesPage() {
  const [employees, setEmployees] = useState(employeesData);
  const [searchTerm, setSearchTerm] = useState('');
  const [teamFilter, setTeamFilter] = useState('전체 팀');
  const [positionFilter, setPositionFilter] = useState('전체 직급');
  const [sortBy, setSortBy] = useState<'rank' | 'consultations' | 'fcr' | 'avgTime'>('rank');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);

  const [isLoading, setIsLoading] = useState(true);

  // ⭐ API에서 사원 목록 불러오기
  useEffect(() => {
    const loadEmployees = async () => {
      try {
        setIsLoading(true);
        const data = await fetchEmployees(200); // 전체 사원 로드

        // 팀 이름 정규화 및 기본값 설정
        const normalizedEmployees = data.map((emp: any, index: number) => ({
          ...emp,
          team: (emp.team || emp.department || '').replace(/\s+/g, ''),
          position: emp.position || emp.role || '사원',
          rank: emp.rank || data.length - index,
          consultations: emp.consultations || 0,
          fcr: emp.fcr || 0,
          avgTime: emp.avgTime || '0:00',
          trend: emp.trend || 'same',
        }));

        setEmployees(normalizedEmployees);
        console.log(`[EmployeesPage] ${USE_MOCK_DATA ? 'Mock' : 'Real'} 데이터 로드: ${normalizedEmployees.length}명`);
      } catch (error) {
        console.error('Failed to load employees:', error);
        // 폴백: Mock 데이터 사용
        setEmployees(employeesData);
      } finally {
        setIsLoading(false);
      }
    };
    loadEmployees();
  }, []);

  // 팀, 직급 목록 추출
  const teams = ['전체 팀', ...Array.from(new Set(employees.map(emp => emp.team)))];
  const positions = ['전체 직급', ...Array.from(new Set(employees.map(emp => emp.position)))];

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.includes(searchTerm) || 
                         emp.id.includes(searchTerm) ||
                         emp.team.includes(searchTerm);
    const matchesTeam = teamFilter === '전체 팀' || emp.team === teamFilter;
    const matchesPosition = positionFilter === '전체 직급' || emp.position === positionFilter;
    return matchesSearch && matchesTeam && matchesPosition;
  });

  // Top 3는 항상 전체 데이터에서 각각 한 명씩 가져옴 (rank 1, 2, 3)
  const topPerformers = [1, 2, 3].map(rank => 
    employees.find(emp => emp.rank === rank)
  ).filter(Boolean);

  // 정렬 함수
  const handleSort = (column: 'rank' | 'consultations' | 'fcr' | 'avgTime') => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('asc');
    }
  };

  // 정렬된 데이터
  const sortedEmployees = [...filteredEmployees].sort((a, b) => {
    let aValue: any = a[sortBy as keyof typeof a];
    let bValue: any = b[sortBy as keyof typeof b];

    // 평균 시간은 문자열이므로 숫자로 변환 (mm:ss -> 초)
    if (sortBy === 'avgTime') {
      const aSeconds = parseInt(aValue.split(':')[0]) * 60 + parseInt(aValue.split(':')[1]);
      const bSeconds = parseInt(bValue.split(':')[0]) * 60 + parseInt(bValue.split(':')[1]);
      aValue = aSeconds;
      bValue = bSeconds;
    }

    // 추이는 정렬 불가능하므로 순위로 처리
    if (sortBy === 'trend') {
      return 0;
    }

    if (typeof aValue === 'string') {
      return aValue.localeCompare(bValue);
    }
    return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
  });

  // Reset to page 1 when search changes
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  // Pagination
  const totalPages = Math.ceil(sortedEmployees.length / itemsPerPage);
  const currentEmployees = sortedEmployees.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <MainLayout>
      <div className="h-[calc(100vh-60px)] flex flex-col p-3 gap-3 bg-[#F5F5F5] overflow-hidden">
        {/* Header with Top 3 + Search Box (Search on the right) */}
        <div className="grid grid-cols-4 gap-3 flex-shrink-0">
          {/* Top 3 Performers - 컴팩트 카드 */}
          {topPerformers.map((emp, index) => (
            <div 
              key={emp.id}
              className={`bg-gradient-to-br rounded-lg shadow-md p-2 text-white relative overflow-hidden ${
                index === 0 ? 'from-[#FBBC04] to-[#F9A825]' :
                index === 1 ? 'from-[#9E9E9E] to-[#757575]' :
                'from-[#CD7F32] to-[#A0522D]'
              }`}
            >
              {/* 메달 아이콘과 이름 - 최상단 */}
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <div className="text-xl">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                  </div>
                  <div className="font-bold text-sm">{emp.name}</div>
                </div>
                
                {/* 우측 상단에 사번과 팀 배치 */}
                <div className="text-right">
                  <div className="text-[9px] opacity-90 leading-tight">{emp.id}</div>
                  <div className="text-[9px] opacity-90 leading-tight">{emp.team}</div>
                </div>
              </div>
              
              {/* 상담건수, FCR, 평균시간 - 3개 컬럼 */}
              <div className="grid grid-cols-3 gap-1 text-[10px]">
                <div className="text-center">
                  <div className="opacity-70">상담</div>
                  <div className="font-bold text-xs">{emp.consultations}</div>
                </div>
                <div className="text-center">
                  <div className="opacity-70">FCR</div>
                  <div className="font-bold text-xs">{emp.fcr}%</div>
                </div>
                <div className="text-center">
                  <div className="opacity-70">평균</div>
                  <div className="font-bold text-xs">{emp.avgTime}</div>
                </div>
              </div>
            </div>
          ))}

          {/* Search Box - 우측 */}
          <div className="bg-white rounded-lg shadow-sm border border-[#E0E0E0] p-2.5 flex flex-col justify-center">
            <h2 className="text-sm font-bold text-[#333333] mb-0.5">사원 검색</h2>
            <p className="text-[9px] text-[#999999] mb-1.5">총 {employees.length}명</p>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#999999]" />
              <Input 
                className="pl-8 h-8 text-xs placeholder:text-[10px]" 
                placeholder="사원명, 사번, 팀 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Employee Table - 스크롤 없이, 내용 아래로 쭉 표시 */}
        <div className="flex-1 bg-white rounded-lg shadow-sm border border-[#E0E0E0] overflow-hidden flex flex-col min-h-0">
          <div className="px-5 py-2.5 border-b border-[#E0E0E0] flex-shrink-0 flex items-center justify-between">
            <h2 className="text-base font-bold text-[#333333]">전체 사원 현황</h2>
            
            {/* 필터 컨트롤 */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-[#666666]">팀</span>
              <Select value={teamFilter} onValueChange={(value) => { setTeamFilter(value); }}>
                <SelectTrigger className="w-[120px] h-8 text-xs border-[#E0E0E0]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {teams.map(team => (
                    <SelectItem key={team} value={team} className="text-xs">{team}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <span className="text-[11px] text-[#666666]">직급</span>
              <Select value={positionFilter} onValueChange={(value) => { setPositionFilter(value); }}>
                <SelectTrigger className="w-[100px] h-8 text-xs border-[#E0E0E0]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {positions.map(position => (
                    <SelectItem key={position} value={position} className="text-xs">{position}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <span className="text-[11px] text-[#999999]">(검색: {filteredEmployees.length}명)</span>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-3">
            <table className="w-full">
              <thead className="border-b-2 border-[#E0E0E0]">
                <tr>
                  <th 
                    className="text-center text-[11px] font-semibold text-[#666666] pb-2 w-[60px] cursor-pointer hover:bg-[#F8F9FA] transition-colors px-2"
                    onClick={() => handleSort('rank')}
                  >
                    순위
                  </th>
                  <th 
                    className="text-left text-[11px] font-semibold text-[#666666] pb-2 w-[120px] cursor-pointer hover:bg-[#F8F9FA] transition-colors px-2"
                    onClick={() => handleSort('id')}
                  >
                    사번
                  </th>
                  <th 
                    className="text-left text-[11px] font-semibold text-[#666666] pb-2 w-[100px] cursor-pointer hover:bg-[#F8F9FA] transition-colors px-2"
                    onClick={() => handleSort('name')}
                  >
                    이름
                  </th>
                  <th 
                    className="text-left text-[11px] font-semibold text-[#666666] pb-2 w-[100px] cursor-pointer hover:bg-[#F8F9FA] transition-colors px-2"
                    onClick={() => handleSort('team')}
                  >
                    소속
                  </th>
                  <th 
                    className="text-left text-[11px] font-semibold text-[#666666] pb-2 w-[80px] cursor-pointer hover:bg-[#F8F9FA] transition-colors px-2"
                    onClick={() => handleSort('position')}
                  >
                    직급
                  </th>
                  <th 
                    className="text-left text-[11px] font-semibold text-[#666666] pb-2 w-[160px] cursor-pointer hover:bg-[#F8F9FA] transition-colors px-2"
                    onClick={() => handleSort('email')}
                  >
                    이메일
                  </th>
                  <th 
                    className="text-center text-[11px] font-semibold text-[#666666] pb-2 w-[100px] cursor-pointer hover:bg-[#F8F9FA] transition-colors px-2"
                    onClick={() => handleSort('consultations')}
                  >
                    상담 건수
                  </th>
                  <th 
                    className="text-center text-[11px] font-semibold text-[#666666] pb-2 w-[80px] cursor-pointer hover:bg-[#F8F9FA] transition-colors px-2"
                    onClick={() => handleSort('fcr')}
                  >
                    FCR
                  </th>
                  <th 
                    className="text-center text-[11px] font-semibold text-[#666666] pb-2 w-[100px] cursor-pointer hover:bg-[#F8F9FA] transition-colors px-2"
                    onClick={() => handleSort('avgTime')}
                  >
                    평균 시간
                  </th>
                  <th className="text-center text-[11px] font-semibold text-[#666666] pb-2 w-[80px] px-2">
                    추이
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentEmployees.map((emp) => (
                  <tr 
                    key={emp.id}
                    className="border-b border-[#F0F0F0] hover:bg-[#F8F9FA] cursor-pointer transition-colors"
                  >
                    <td className="py-1.5 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {emp.rank <= 3 && <Trophy className="w-3.5 h-3.5 text-[#FBBC04]" />}
                        <span className="font-semibold text-[#0047AB] text-[13px]">{emp.rank}</span>
                      </div>
                    </td>
                    <td className="py-1.5">
                      <span className="text-[13px] text-[#666666] font-mono">{emp.id}</span>
                    </td>
                    <td className="py-1.5">
                      <span className="text-[13px] font-semibold text-[#333333]">{emp.name}</span>
                    </td>
                    <td className="py-1.5">
                      <span className="text-[13px] text-[#666666]">{emp.team}</span>
                    </td>
                    <td className="py-1.5">
                      <span className="text-[11px] px-2 py-0.5 bg-[#E8F1FC] text-[#0047AB] rounded">
                        {emp.position}
                      </span>
                    </td>
                    <td className="py-1.5">
                      <span className="text-[13px] text-[#666666] font-mono">{emp.email}</span>
                    </td>
                    <td className="py-1.5 text-center">
                      <span className="text-[13px] font-semibold text-[#333333]">{emp.consultations}</span>
                    </td>
                    <td className="py-1.5 text-center">
                      <span className={`text-[13px] font-semibold ${
                        emp.fcr >= 95 ? 'text-[#34A853]' :
                        emp.fcr >= 90 ? 'text-[#FBBC04]' :
                        'text-[#EA4335]'
                      }`}>
                        {emp.fcr}%
                      </span>
                    </td>
                    <td className="py-1.5 text-center">
                      <span className="text-[13px] text-[#666666] font-mono">{emp.avgTime}</span>
                    </td>
                    <td className="py-1.5 text-center">
                      {emp.trend === 'up' && <TrendingUp className="w-3.5 h-3.5 text-[#34A853] mx-auto" />}
                      {emp.trend === 'down' && <TrendingDown className="w-3.5 h-3.5 text-[#EA4335] mx-auto" />}
                      {emp.trend === 'same' && <span className="text-[#999999]">-</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination Controls */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={filteredEmployees.length}
            itemsPerPage={itemsPerPage}
          />
        </div>
      </div>
    </MainLayout>
  );
}