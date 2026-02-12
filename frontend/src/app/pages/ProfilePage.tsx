import MainLayout from '../components/layout/MainLayout';
import { User, Trophy, TrendingUp, Award, Lock } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useState, useEffect } from 'react';
import ChangePasswordModal from '../components/modals/ChangePasswordModal';
import { showSuccess, showError } from '@/utils/toast';
import { badgesData, monthlyStatsData } from '@/data/mock';

// ⭐ Mock 데이터에서 가져오기
const badges = badgesData;
const monthlyStats = monthlyStatsData;

export default function ProfilePage() {
  const employeeName = localStorage.getItem('employeeName') || '홍길동';
  const employeeId = localStorage.getItem('employeeId') || 'EMP-001';
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  const userTeam = localStorage.getItem('userTeam') || '상담1팀';
  const userPosition = localStorage.getItem('userPosition') || '대리';
  const userJoinDate = localStorage.getItem('userJoinDate') || '2024-01-15';
  const userEmail = localStorage.getItem('userEmail') || 'hong@teddycard.com';
  const userPhone = localStorage.getItem('userPhone') || '010-1234-5678';

  const [phone, setPhone] = useState(userPhone);
  const [email, setEmail] = useState(userEmail);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [centerRank, setCenterRank] = useState(3);
  const [totalCount, setTotalCount] = useState(45);

  // 전화번호 자동 포맷팅 함수
  const formatPhoneNumber = (value: string): string => {
    // 숫자만 추출
    const numbers = value.replace(/[^\d]/g, '');
    
    // 길이에 따라 포맷팅
    if (numbers.length <= 3) {
      return numbers;
    } else if (numbers.length <= 7) {
      return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    } else if (numbers.length <= 11) {
      return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7)}`;
    } else {
      return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
    }
  };

  // 전화번호 입력 핸들러
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhone(formatted);
  };

  // 센터 랭킹 계산
  useEffect(() => {
    const savedEmployees = localStorage.getItem('employees');
    if (savedEmployees) {
      try {
        const employees = JSON.parse(savedEmployees);
        setTotalCount(employees.length);

        // 현재 사용자의 FCR 또는 rank를 찾기
        const currentEmployee = employees.find((emp: any) => emp.id === employeeId);
        if (currentEmployee) {
          // rank가 있으면 사용, 없으면 FCR 기준으로 정렬
          if (currentEmployee.rank) {
            setCenterRank(currentEmployee.rank);
          } else {
            // FCR 기준으로 정렬하여 순위 계산
            const sortedByFCR = [...employees].sort((a: any, b: any) => (b.fcr || 0) - (a.fcr || 0));
            const rankPosition = sortedByFCR.findIndex((emp: any) => emp.id === employeeId) + 1;
            setCenterRank(rankPosition);
          }
        }
      } catch (e) {
        console.error('Failed to calculate ranking', e);
      }
    }
  }, [employeeId]);

  const handleSave = () => {
    // LocalStorage 업데이트
    localStorage.setItem('userEmail', email);
    localStorage.setItem('userPhone', phone);
    
    // employees 배열도 업데이트
    const savedEmployees = localStorage.getItem('employees');
    if (savedEmployees) {
      try {
        const employees = JSON.parse(savedEmployees);
        const updatedEmployees = employees.map((emp: any) =>
          emp.id === employeeId ? { ...emp, email, phone } : emp
        );
        localStorage.setItem('employees', JSON.stringify(updatedEmployees));
        showSuccess('저장되었습니다.');
      } catch (e) {
        console.error('Failed to update employees', e);
        showError('저장에 실패했습니다.');
      }
    }
  };

  return (
    <MainLayout>
      <div className="h-[calc(100vh-60px)] overflow-y-auto p-2 sm:p-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 mb-3 sm:mb-4">
            {/* Profile Card */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-[#E0E0E0] p-3 sm:p-4">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#0047AB] rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-base sm:text-lg font-bold text-[#333333] mb-2">{employeeName}</h1>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 text-xs text-[#666666]">
                    <div><span className="font-medium text-[#333333]">사번:</span> {employeeId}</div>
                    <div><span className="font-medium text-[#333333]">소속:</span> {isAdmin ? '관리부' : userTeam}</div>
                    <div><span className="font-medium text-[#333333]">직급:</span> {isAdmin ? '팀장' : userPosition}</div>
                    <div><span className="font-medium text-[#333333]">권한 부여일:</span> {userJoinDate}</div>
                  </div>
                </div>
              </div>

              {/* Badges */}
              <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-[#E0E0E0]">
                <h3 className="text-xs font-semibold text-[#333333] mb-2 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-[#0047AB]" />
                  획득 배지
                </h3>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {badges.map((badge) => (
                    <div 
                      key={badge.id}
                      className="p-2 bg-[#F8F9FA] border-2 rounded-lg text-center hover:scale-105 transition-transform cursor-pointer"
                      style={{ borderColor: badge.color }}
                    >
                      <div className="text-[10px] font-medium line-clamp-1" style={{ color: badge.color }}>
                        {badge.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Center Ranking */}
            <div className="bg-gradient-to-br from-[#FFF9E6] to-[#FFFBF0] rounded-lg shadow-sm border border-[#FBBC04]/30 p-4 flex flex-col items-center justify-center">
              <Trophy className="w-10 h-10 sm:w-12 sm:h-12 text-[#FBBC04] mb-3" />
              <div className="text-center">
                <div className="text-xs text-[#666666] mb-0.5">센터 랭킹</div>
                <div className="text-2xl sm:text-3xl font-bold text-[#0047AB] mb-0.5">{centerRank}위</div>
                <div className="text-xs text-[#999999]">전체 {totalCount}명</div>
              </div>
            </div>
          </div>

          {/* Bottom Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
            {/* Monthly Statistics */}
            <div className="bg-white rounded-lg shadow-sm border border-[#E0E0E0] p-3 sm:p-4">
              <h2 className="text-sm font-bold text-[#333333] mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#0047AB]" />
                1월 성과
              </h2>
              <div className="space-y-2">
                {monthlyStats.map((stat, index) => (
                  <div key={index} className="flex items-center justify-between py-1.5 border-b border-[#F0F0F0] last:border-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#666666]">{stat.label}</span>
                      <span className="text-xs font-semibold text-[#333333]">{stat.value}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-[#999999] hidden sm:inline">{stat.comparison}</span>
                      {stat.status === 'good' && (
                        <div className="w-5 h-5 bg-[#34A853] rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Personal Info Edit */}
            <div className="bg-white rounded-lg shadow-sm border border-[#E0E0E0] p-3 sm:p-4">
              <h2 className="text-sm sm:text-base font-bold text-[#333333] mb-3 sm:mb-4">개인정보 수정</h2>
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <Label htmlFor="phone" className="text-xs sm:text-sm text-[#666666]">연락처</Label>
                  <Input id="phone" type="tel" value={phone} onChange={handlePhoneChange} className="mt-1 h-9 sm:h-10 text-sm" />
                </div>
                <div>
                  <Label htmlFor="email" className="text-xs sm:text-sm text-[#666666]">이메일</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 h-9 sm:h-10 text-sm" />
                </div>
                <div className="pt-2">
                  <Button variant="outline" className="w-full mb-2 h-9 sm:h-10 text-xs sm:text-sm" onClick={() => setIsPasswordModalOpen(true)}>비밀번호 변경</Button>
                  <Button className="w-full bg-[#0047AB] hover:bg-[#003580] h-9 sm:h-10 text-xs sm:text-sm" onClick={handleSave}>저장</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ChangePasswordModal isOpen={isPasswordModalOpen} onClose={() => setIsPasswordModalOpen(false)} />
    </MainLayout>
  );
}