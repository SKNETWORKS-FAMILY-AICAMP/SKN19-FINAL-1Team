import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { employeesData } from '@/data/mock';

export default function LoginPage() {
  const navigate = useNavigate();
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // LocalStorage에서 사원 목록 가져오기
    const savedEmployees = localStorage.getItem('employees');
    let employees = [];
    
    if (savedEmployees) {
      try {
        employees = JSON.parse(savedEmployees);
        
        // 50명 미만이면 mockData로 초기화
        if (employees.length < 50) {
          console.log('LoginPage: LocalStorage 데이터가 50명 미만입니다. mockData로 초기화합니다.');
          employees = employeesData;
          localStorage.setItem('employees', JSON.stringify(employeesData));
        }
      } catch (e) {
        console.error('Failed to parse employees', e);
        employees = employeesData;
        localStorage.setItem('employees', JSON.stringify(employeesData));
      }
    } else {
      // LocalStorage에 데이터가 없으면 mockData로 초기화
      console.log('LoginPage: LocalStorage가 비어있습니다. mockData로 초기화합니다.');
      employees = employeesData;
      localStorage.setItem('employees', JSON.stringify(employeesData));
    }

    // 관리자 계정 확인 (ADMIN-001)
    if (employeeId === 'ADMIN-001' && password === '0000') {
      localStorage.setItem('userRole', 'admin');
      localStorage.setItem('employeeId', 'ADMIN-001');
      localStorage.setItem('employeeName', '관리자');
      localStorage.setItem('isAdmin', 'true');
      localStorage.setItem('userTeam', '관리부');
      localStorage.setItem('userPosition', '팀장');
      localStorage.setItem('userEmail', 'admin@teddycard.com');
      localStorage.setItem('userPhone', '010-0000-0000');
      localStorage.setItem('userJoinDate', '2020-01-01');
      navigate('/dashboard');
      return;
    }

    // 사원 계정 확인 (LocalStorage 기반)
    const foundEmployee = employees.find((emp: any) => emp.id === employeeId);
    
    if (foundEmployee && password === '0000') {
      // 최초 비밀번호는 0000으로 고정 (추후 변경 가능하도록 확장 가능)
      const isAdminUser = foundEmployee.position === '팀장' || foundEmployee.position === '부장' || foundEmployee.position === '이사';
      
      localStorage.setItem('userRole', isAdminUser ? 'admin' : 'employee');
      localStorage.setItem('employeeId', foundEmployee.id);
      localStorage.setItem('employeeName', foundEmployee.name);
      localStorage.setItem('isAdmin', isAdminUser.toString());
      localStorage.setItem('userTeam', foundEmployee.team);
      localStorage.setItem('userPosition', foundEmployee.position);
      localStorage.setItem('userEmail', foundEmployee.email);
      localStorage.setItem('userPhone', foundEmployee.phone);
      localStorage.setItem('userJoinDate', foundEmployee.joinDate);
      navigate('/dashboard');
    } else if (employeeId && password) {
      setError('입력된 정보가 올바르지 않습니다. (기본 비밀번호: 0000)');
    } else {
      setError('사번과 비밀번호를 입력하세요.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0047AB] via-[#4A90E2] to-[#0047AB] relative px-4">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
      
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-[440px] p-6 sm:p-12">
        {/* Logo */}
        <div className="text-center mb-8 sm:mb-10">
          <h1 className="text-4xl sm:text-5xl font-black text-[#0047AB] mb-2">
            CALL<span className="text-[#FBBC04]">:</span>ACT
          </h1>
          <p className="text-xs sm:text-sm text-[#666666] tracking-wide">
            상담사 지원 시스템
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4 sm:space-y-5">
          <div>
            <Label htmlFor="employeeId" className="text-[#333333] mb-2 block font-semibold text-sm">
              사번
            </Label>
            <Input
              id="employeeId"
              type="text"
              placeholder="사번을 입력하세요"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              className="h-11 sm:h-12 border-[#E0E0E0] text-sm sm:text-base"
            />
          </div>

          <div>
            <Label htmlFor="password" className="text-[#333333] mb-2 block font-semibold text-sm">
              비밀번호
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11 sm:h-12 border-[#E0E0E0] text-sm sm:text-base"
            />
          </div>

          <Button
            type="submit"
            className="w-full h-11 sm:h-12 bg-[#0047AB] hover:bg-[#003580] text-white rounded-lg mt-6 sm:mt-8 font-bold text-sm sm:text-base"
          >
            로그인
          </Button>
        </form>

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-2.5 sm:p-3 bg-[#FEE] border border-[#EA4335] rounded-lg flex items-center gap-2">
            <svg
              className="w-4 h-4 text-[#EA4335] flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-xs sm:text-sm text-[#EA4335]">{error}</p>
          </div>
        )}

        {/* Demo Accounts */}
        <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-[#E0E0E0]">
          <p className="text-xs text-[#999999] text-center mb-3">데모 계정</p>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center bg-[#F5F5F5] p-2.5 sm:p-3 rounded-lg">
              <span className="text-[#666666]">일반 사원</span>
              <span className="font-mono font-semibold text-[#333333]">EMP-001 / 0000</span>
            </div>
            <div className="flex justify-between items-center bg-[#F5F5F5] p-2.5 sm:p-3 rounded-lg">
              <span className="text-[#666666]">관리자</span>
              <span className="font-mono font-semibold text-[#333333]">ADMIN-001 / 0000</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}