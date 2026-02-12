import { useState, useEffect } from 'react';
import MainLayout from '../components/layout/MainLayout';
import { UserPlus, Edit2, Trash2, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { employeesData } from '@/data/mock';
import AddEmployeeModal from '../components/modals/AddEmployeeModal';
import EditEmployeeModal from '../components/modals/EditEmployeeModal';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Pagination } from '../components/ui/pagination_component';
import { toast } from 'sonner';
import { fetchEmployees, createEmployee, updateEmployee, deleteEmployee as deleteEmployeeApi } from '@/api/employeesApi';
import { USE_MOCK_DATA } from '@/config/mockConfig';

const itemsPerPage = 20; // 페이지당 표시할 사원 수

export default function AdminManagePage() {
  const [employees, setEmployees] = useState(employeesData);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [teamFilter, setTeamFilter] = useState('전체 팀');
  const [positionFilter, setPositionFilter] = useState('전체 직급');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'vacation' | 'inactive'>('all');
  const [sortColumn, setSortColumn] = useState('id');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<any>(null);

  const [isLoading, setIsLoading] = useState(true);

  // ⭐ API에서 사원 목록 불러오기
  useEffect(() => {
    const loadEmployees = async () => {
      try {
        setIsLoading(true);
        const data = await fetchEmployees(200); // 전체 사원 로드

        // 팀 이름 정규화 및 기본값 설정
        const normalizedEmployees = data.map((emp: any) => ({
          ...emp,
          team: (emp.team || emp.department || '').replace(/\s+/g, ''),
          position: emp.position || emp.role || '사원',
          joinDate: emp.joinDate || emp.hireDate || '',
          phone: emp.phone || '',
          status: emp.status || 'active',
        }));

        setEmployees(normalizedEmployees);
        console.log(`[AdminManagePage] ${USE_MOCK_DATA ? 'Mock' : 'Real'} 데이터 로드: ${normalizedEmployees.length}명`);
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

  // ⭐ 사원 추가 (API 호출)
  const handleAddEmployee = async (newEmployee: any) => {
    try {
      const result = await createEmployee({
        name: newEmployee.name,
        email: newEmployee.email,
        phone: newEmployee.phone,
        role: newEmployee.position,
        department: newEmployee.team,
        hireDate: newEmployee.joinDate,
        status: newEmployee.status || 'active',
      });

      if (result) {
        // Frontend 형식으로 변환하여 추가
        const employeeWithDefaults = {
          ...result,
          team: result.team || result.department,
          position: result.position || result.role,
          joinDate: result.joinDate || result.hireDate,
        };
        setEmployees(prev => [employeeWithDefaults, ...prev]);
        toast.success('사원이 추가되었습니다.', {
          description: `${result.name} (${result.id})`,
          duration: 3000,
        });
      } else {
        toast.error('사원 추가에 실패했습니다.');
      }
    } catch (error) {
      console.error('Failed to add employee:', error);
      toast.error('사원 추가 중 오류가 발생했습니다.');
    }
  };

  // ⭐ 사원 수정 (API 호출)
  const handleEditEmployee = async (updatedEmployee: any) => {
    try {
      const result = await updateEmployee(updatedEmployee.id, {
        name: updatedEmployee.name,
        email: updatedEmployee.email,
        phone: updatedEmployee.phone,
        role: updatedEmployee.position,
        department: updatedEmployee.team,
        hireDate: updatedEmployee.joinDate,
        status: updatedEmployee.status,
      });

      if (result) {
        setEmployees(prev => prev.map(emp =>
          emp.id === updatedEmployee.id
            ? { ...emp, ...updatedEmployee, team: updatedEmployee.team, position: updatedEmployee.position }
            : emp
        ));
        toast.success('사원 정보가 수정되었습니다.', {
          description: `${updatedEmployee.name} (${updatedEmployee.id})`,
          duration: 3000,
        });
      } else {
        toast.error('사원 수정에 실패했습니다.');
      }
    } catch (error) {
      console.error('Failed to update employee:', error);
      toast.error('사원 수정 중 오류가 발생했습니다.');
    }
  };

  // 사원 삭제 확인 시작
  const handleDeleteClick = (employee: any) => {
    setEmployeeToDelete(employee);
    setIsDeleteConfirmOpen(true);
  };

  // ⭐ 사원 삭제 실행 (API 호출)
  const handleDeleteEmployee = async () => {
    if (employeeToDelete) {
      try {
        const success = await deleteEmployeeApi(employeeToDelete.id);

        if (success) {
          setEmployees(prev => prev.filter(emp => emp.id !== employeeToDelete.id));
          toast.success('사원이 삭제되었습니다.', {
            description: `${employeeToDelete.name} (${employeeToDelete.id})`,
            duration: 3000,
          });
        } else {
          toast.error('사원 삭제에 실패했습니다.');
        }
      } catch (error) {
        console.error('Failed to delete employee:', error);
        toast.error('사원 삭제 중 오류가 발생했습니다.');
      } finally {
        setIsDeleteConfirmOpen(false);
        setEmployeeToDelete(null);
      }
    }
  };

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

  // 정렬 함수
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  // 정렬된 데이터
  const sortedEmployees = [...filteredEmployees].sort((a, b) => {
    let aValue: any = a[sortColumn as keyof typeof a];
    let bValue: any = b[sortColumn as keyof typeof b];

    if (sortDirection === 'asc') {
      if (typeof aValue === 'string') {
        return aValue.localeCompare(bValue);
      }
      return aValue - bValue;
    } else {
      if (typeof aValue === 'string') {
        return bValue.localeCompare(aValue);
      }
      return bValue - aValue;
    }
  });

  // 정렬 아이콘 렌더링
  const renderSortIcon = (column: string) => {
    // 화살표 아이콘 제거 (깔끔한 UI를 위해)
    return null;
  };

  // 페이징 처리
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const currentEmployees = sortedEmployees.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <MainLayout>
      <div className="h-[calc(100vh-60px)] flex flex-col p-3 gap-3 bg-[#F5F5F5] overflow-hidden">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-[#E0E0E0] p-3 flex-shrink-0">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-bold text-[#333333]">사원 관리</h1>
            <Button className="bg-[#0047AB] hover:bg-[#003580] h-7 text-[10px] px-2.5" onClick={() => setIsAddModalOpen(true)}>
              <UserPlus className="w-3 h-3 mr-1" />
              사원 추가
            </Button>
          </div>
        </div>
        
        {/* Stats Cards + 검색/필터 */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Stats Cards - 왼쪽 50% (배경 위에) */}
          <div className="w-1/2 flex items-center gap-2">
            <div className="flex-1 bg-white rounded-lg shadow-sm p-2.5 text-center border border-[#E0E0E0]">
              <div className="text-xl font-bold text-[#0047AB] mb-0.5">
                {employees.length}
              </div>
              <div className="text-[10px] text-[#666666]">전체 사원</div>
            </div>
            <div className="flex-1 bg-white rounded-lg shadow-sm p-2.5 text-center border border-[#E0E0E0]">
              <div className="text-xl font-bold text-[#34A853] mb-0.5">
                {employees.filter(e => e.status === 'active').length}
              </div>
              <div className="text-[10px] text-[#666666]">재직 중</div>
            </div>
            <div className="flex-1 bg-white rounded-lg shadow-sm p-2.5 text-center border border-[#E0E0E0]">
              <div className="text-xl font-bold text-[#FBBC04] mb-0.5">
                {employees.filter(e => e.status === 'vacation').length}
              </div>
              <div className="text-[10px] text-[#666666]">휴가 중</div>
            </div>
            <div className="flex-1 bg-white rounded-lg shadow-sm p-2.5 text-center border border-[#E0E0E0]">
              <div className="text-xl font-bold text-[#EA4335] mb-0.5">
                {employees.filter(e => e.status === 'inactive').length}
              </div>
              <div className="text-[10px] text-[#666666]">비활성</div>
            </div>
          </div>

          {/* 검색/필터 영역 - 우측 50% (하얀 박스) */}
          <div className="w-1/2 bg-white rounded-lg shadow-sm border border-[#E0E0E0] p-3">
            <div className="flex items-center gap-2">
              {/* 검색창 */}
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#999999]" />
                <Input 
                  className="pl-8 h-8 text-xs placeholder:text-xs" 
                  placeholder="이름, 사번, 소속 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* 필터 */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#666666] whitespace-nowrap">팀</span>
                <Select value={teamFilter} onValueChange={setTeamFilter}>
                  <SelectTrigger className="w-[120px] h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {teams.map(team => (
                      <SelectItem key={team} value={team} className="text-xs">{team}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-[#666666] whitespace-nowrap">직급</span>
                <Select value={positionFilter} onValueChange={setPositionFilter}>
                  <SelectTrigger className="w-[100px] h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {positions.map(position => (
                      <SelectItem key={position} value={position} className="text-xs">{position}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* 상태 필터 버튼 */}
              <div className="flex items-center gap-1 ml-2">
                <Button
                  variant={filterStatus === 'all' ? 'default' : 'outline'}
                  size="sm"
                  className={`h-8 text-[10px] px-2.5 ${
                    filterStatus === 'all' 
                      ? 'bg-[#0047AB] hover:bg-[#003580] text-white' 
                      : 'text-[#666666]'
                  }`}
                  onClick={() => setFilterStatus('all')}
                >
                  전체
                </Button>
                <Button
                  variant={filterStatus === 'active' ? 'default' : 'outline'}
                  size="sm"
                  className={`h-8 text-[10px] px-2.5 ${
                    filterStatus === 'active' 
                      ? 'bg-[#34A853] hover:bg-[#2d8e47] text-white' 
                      : 'text-[#666666]'
                  }`}
                  onClick={() => setFilterStatus('active')}
                >
                  재직
                </Button>
                <Button
                  variant={filterStatus === 'vacation' ? 'default' : 'outline'}
                  size="sm"
                  className={`h-8 text-[10px] px-2.5 ${
                    filterStatus === 'vacation' 
                      ? 'bg-[#FBBC04] hover:bg-[#e0a803] text-white' 
                      : 'text-[#666666]'
                  }`}
                  onClick={() => setFilterStatus('vacation')}
                >
                  휴가
                </Button>
                <Button
                  variant={filterStatus === 'inactive' ? 'default' : 'outline'}
                  size="sm"
                  className={`h-8 text-[10px] px-2.5 ${
                    filterStatus === 'inactive' 
                      ? 'bg-[#EA4335] hover:bg-[#d33b2e] text-white' 
                      : 'text-[#666666]'
                  }`}
                  onClick={() => setFilterStatus('inactive')}
                >
                  비활성
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Employee Table/List */}
        <div className="flex-1 bg-white rounded-lg shadow-sm border border-[#E0E0E0] flex flex-col overflow-hidden min-h-0 flex-shrink-0">
          <div className="px-3 py-2 border-b border-[#E0E0E0] flex-shrink-0">
            <h2 className="text-sm font-bold text-[#333333]">
              사원 목록 ({filteredEmployees.length}명)
            </h2>
          </div>
          
          {/* 데스크톱 테이블 */}
          <div className="hidden lg:block flex-1 overflow-y-auto overflow-x-auto">
            <table className="w-full">
              <thead className="border-b-2 border-[#E0E0E0] sticky top-0 bg-white">
                <tr>
                  <th className="text-center text-[11px] font-semibold text-[#666666] py-2 px-3 w-[100px] cursor-pointer align-middle" onClick={() => handleSort('id')}>
                    사번 {renderSortIcon('id')}
                  </th>
                  <th className="text-center text-[11px] font-semibold text-[#666666] py-2 px-3 w-[100px] cursor-pointer align-middle" onClick={() => handleSort('name')}>
                    이름 {renderSortIcon('name')}
                  </th>
                  <th className="text-center text-[11px] font-semibold text-[#666666] py-2 px-3 w-[100px] cursor-pointer align-middle" onClick={() => handleSort('team')}>
                    소속 {renderSortIcon('team')}
                  </th>
                  <th className="text-center text-[11px] font-semibold text-[#666666] py-2 px-3 w-[80px] cursor-pointer align-middle" onClick={() => handleSort('position')}>
                    직급 {renderSortIcon('position')}
                  </th>
                  <th className="text-center text-[11px] font-semibold text-[#666666] py-2 px-3 w-[100px] cursor-pointer align-middle" onClick={() => handleSort('status')}>
                    상태 {renderSortIcon('status')}
                  </th>
                  <th className="text-center text-[11px] font-semibold text-[#666666] py-2 px-3 w-[180px] cursor-pointer align-middle" onClick={() => handleSort('email')}>
                    이메일 {renderSortIcon('email')}
                  </th>
                  <th className="text-center text-[11px] font-semibold text-[#666666] py-2 px-3 w-[120px] cursor-pointer align-middle" onClick={() => handleSort('phone')}>
                    연락처 {renderSortIcon('phone')}
                  </th>
                  <th className="text-center text-[11px] font-semibold text-[#666666] py-2 px-3 w-[100px] cursor-pointer align-middle" onClick={() => handleSort('joinDate')}>
                    입사일 {renderSortIcon('joinDate')}
                  </th>
                  <th className="text-center text-[11px] font-semibold text-[#666666] py-2 px-3 w-[120px] align-middle">관리</th>
                </tr>
              </thead>
              <tbody>
                {currentEmployees.map((emp) => (
                  <tr 
                    key={emp.id}
                    className="border-b border-[#F0F0F0] hover:bg-[#F8F9FA] transition-colors"
                  >
                    <td className="py-1.5 px-2 text-center align-middle">
                      <span className="text-[13px] text-[#666666] font-mono">{emp.id}</span>
                    </td>
                    <td className="py-1.5 px-2 text-center align-middle">
                      <span className="text-[13px] font-semibold text-[#333333]">{emp.name}</span>
                    </td>
                    <td className="py-1.5 px-2 text-center align-middle">
                      <span className="text-[13px] text-[#666666]">{emp.team}</span>
                    </td>
                    <td className="py-1.5 px-2 text-center align-middle">
                      <span className="text-[11px] px-2 py-0.5 bg-[#E8F1FC] text-[#0047AB] rounded">
                        {emp.position}
                      </span>
                    </td>
                    <td className="py-1.5 px-2 text-center align-middle">
                      <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-medium ${
                        emp.status === 'active' ? 'bg-[#E8F5E9] text-[#34A853]' :
                        emp.status === 'vacation' ? 'bg-[#FFF9E6] text-[#FBBC04]' :
                        'bg-[#F5F5F5] text-[#999999]'
                      }`}>
                        {emp.status === 'active' ? '재직' : emp.status === 'vacation' ? '휴가' : '비활성'}
                      </div>
                    </td>
                    <td className="py-1.5 px-2 text-center align-middle">
                      <span className="text-[13px] text-[#666666]">{emp.email}</span>
                    </td>
                    <td className="py-1.5 px-2 text-center align-middle">
                      <span className="text-[13px] text-[#666666] font-mono">{emp.phone}</span>
                    </td>
                    <td className="py-1.5 px-2 text-center align-middle">
                      <span className="text-[13px] text-[#666666]">{emp.joinDate}</span>
                    </td>
                    <td className="py-1.5 px-2 align-middle">
                      <div className="flex items-center justify-center gap-1.5">
                        <Button variant="outline" size="sm" className="h-7 w-7 p-0" onClick={() => { setSelectedEmployee(emp); setIsEditModalOpen(true); }}>
                          <Edit2 className="w-3.5 h-3.5" />
                        </Button>
                        <Button variant="outline" size="sm" className="h-7 w-7 p-0 text-[#EA4335] hover:text-[#EA4335] hover:bg-[#FFEBEE]" onClick={() => handleDeleteClick(emp)}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 모바일/태블릿 카드 뷰 */}
          <div className="lg:hidden flex-1 overflow-y-auto p-3">
            <div className="space-y-3">
              {currentEmployees.map((emp) => (
                <div 
                  key={emp.id}
                  className="bg-white border border-[#E0E0E0] rounded-lg p-3 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-bold text-[#333333]">{emp.name}</span>
                        <span className="text-xs px-2 py-0.5 bg-[#E8F1FC] text-[#0047AB] rounded">
                          {emp.position}
                        </span>
                      </div>
                      <div className="text-[10px] text-[#999999] font-mono">{emp.id}</div>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-[10px] font-medium ${
                      emp.status === 'active' ? 'bg-[#E8F5E9] text-[#34A853]' :
                      emp.status === 'vacation' ? 'bg-[#FFF9E6] text-[#FBBC04]' :
                      'bg-[#F5F5F5] text-[#999999]'
                    }`}>
                      {emp.status === 'active' ? '재직' : emp.status === 'vacation' ? '휴가' : '비활성'}
                    </div>
                  </div>

                  <div className="space-y-1.5 mb-3">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-[#999999] w-12">소속:</span>
                      <span className="text-[#333333]">{emp.team}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-[#999999] w-12">이메일:</span>
                      <span className="text-[#333333] truncate">{emp.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-[#999999] w-12">연락처:</span>
                      <span className="text-[#333333] font-mono">{emp.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-[#999999] w-12">입사일:</span>
                      <span className="text-[#333333]">{emp.joinDate}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2 border-t border-[#E0E0E0]">
                    <Button variant="outline" size="sm" className="flex-1 h-8 text-xs" onClick={() => { setSelectedEmployee(emp); setIsEditModalOpen(true); }}>
                      <Edit2 className="w-3 h-3 mr-1" />
                      수정
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 h-8 text-xs text-[#EA4335] hover:text-[#EA4335] hover:bg-[#FFEBEE]" onClick={() => handleDeleteClick(emp)}>
                      <Trash2 className="w-3 h-3 mr-1" />
                      삭제
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 페이징 버튼 */}
          <div className="px-3 py-2 border-t border-[#E0E0E0] flex-shrink-0">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={filteredEmployees.length}
              itemsPerPage={itemsPerPage}
            />
          </div>
        </div>
      </div>
      <AddEmployeeModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onAdd={handleAddEmployee} />
      <EditEmployeeModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} employee={selectedEmployee} onEdit={handleEditEmployee} />
      
      {/* 삭제 확인 모달 */}
      {isDeleteConfirmOpen && employeeToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]" onClick={() => setIsDeleteConfirmOpen(false)}>
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-[#FFEBEE] rounded-full flex items-center justify-center flex-shrink-0">
                <Trash2 className="w-6 h-6 text-[#EA4335]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#333333]">사원 삭제</h3>
                <p className="text-sm text-[#666666]">정말 삭제하시겠습니까?</p>
              </div>
            </div>
            
            <div className="bg-[#F5F5F5] rounded-lg p-3 mb-4">
              <div className="text-sm font-bold text-[#333333] mb-1">{employeeToDelete.name}</div>
              <div className="text-xs text-[#666666]">{employeeToDelete.id} / {employeeToDelete.team} / {employeeToDelete.position}</div>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setIsDeleteConfirmOpen(false);
                  setEmployeeToDelete(null);
                }}
              >
                취소
              </Button>
              <Button
                className="flex-1 bg-[#EA4335] hover:bg-[#C62828]"
                onClick={handleDeleteEmployee}
              >
                삭제
              </Button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}