import { X } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useState, useEffect } from 'react';

interface AddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (employeeData: any) => void;
}

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

// 다음 사번 생성 함수
const getNextEmployeeId = (): string => {
  const savedEmployees = localStorage.getItem('employees');
  let maxId = 45; // 기본값: EMP-045
  
  if (savedEmployees) {
    try {
      const employees = JSON.parse(savedEmployees);
      employees.forEach((emp: any) => {
        const match = emp.id.match(/EMP-(\d+)/);
        if (match) {
          const num = parseInt(match[1], 10);
          if (num > maxId) maxId = num;
        }
      });
    } catch (e) {
      console.error('Failed to parse employees', e);
    }
  }
  
  const nextId = maxId + 1;
  return `EMP-${String(nextId).padStart(3, '0')}`;
};

export default function AddEmployeeModal({ isOpen, onClose, onAdd }: AddEmployeeModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    team: '',
    position: '',
    email: '', // 앞부분만 저장
    phone: '',
    status: 'active' as 'active' | 'vacation' | 'inactive',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 간단한 유효성 검사
    if (!formData.name || !formData.team || !formData.position || !formData.email || !formData.phone) {
      import('@/utils/toast').then(({ showWarning }) => {
        showWarning('모든 필수 항목을 입력해주세요.');
      });
      return;
    }

    // 이름 유효성 검사 (한글, 영문만 허용)
    const namePattern = /^[가-힣a-zA-Z\s]+$/;
    if (!namePattern.test(formData.name)) {
      import('@/utils/toast').then(({ showWarning }) => {
        showWarning('이름은 한글 또는 영문만 입력 가능합니다.');
      });
      return;
    }

    // 이메일 유효성 검사 (영문, 숫자, 일부 특수문자만)
    const emailPattern = /^[a-zA-Z0-9._-]+$/;
    if (!emailPattern.test(formData.email)) {
      import('@/utils/toast').then(({ showWarning }) => {
        showWarning('이메일은 영문, 숫자, 특수문자(. _ -)만 입력 가능합니다.');
      });
      return;
    }

    // 전화번호 유효성 검사 (숫자와 하이픈만)
    const phoneNumbers = formData.phone.replace(/[^0-9]/g, '');
    if (phoneNumbers.length < 10 || phoneNumbers.length > 11) {
      import('@/utils/toast').then(({ showWarning }) => {
        showWarning('올바른 전화번호를 입력해주세요. (10-11자리)');
      });
      return;
    }

    // 새 사원 데이터 생성
    const newEmployee = {
      id: getNextEmployeeId(), // 다음 사번 생성
      name: formData.name,
      team: formData.team.replace(/\s+/g, ''), // 팀 이름 정규화 (띄워쓰기 제거)
      position: formData.position,
      email: `${formData.email}@teddycard.com`, // 자동으로 도메인 추가
      phone: formatPhoneNumber(formData.phone), // 전화번호 포맷팅
      status: formData.status,
      joinDate: new Date().toISOString().split('T')[0], // YYYY-MM-DD
    };

    onAdd(newEmployee);
    
    // 폼 초기화
    setFormData({
      name: '',
      team: '',
      position: '',
      email: '',
      phone: '',
      status: 'active',
    });
    
    onClose();
  };

  // ⭐ Phase 8-3: ESC 키로 모달 닫기
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#E0E0E0]">
          <h2 className="text-base font-bold text-[#333333]">신규 사원 추가</h2>
          <button
            onClick={onClose}
            className="w-6 h-6 flex items-center justify-center hover:bg-[#F5F5F5] rounded transition-colors"
          >
            <X className="w-4 h-4 text-[#666666]" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-3">
          {/* 이름 */}
          <div>
            <Label className="text-xs text-[#666666] mb-1.5 block">
              이름 <span className="text-[#EA4335]">*</span>
            </Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="h-9 text-xs"
              placeholder="홍길동"
              required
            />
          </div>

          {/* 소속팀 */}
          <div>
            <Label className="text-xs text-[#666666] mb-1.5 block">
              소속팀 <span className="text-[#EA4335]">*</span>
            </Label>
            <select
              value={formData.team}
              onChange={(e) => setFormData({ ...formData, team: e.target.value })}
              className="w-full h-9 px-3 border border-[#E0E0E0] rounded-md text-xs"
              required
            >
              <option value="">선택하세요</option>
              <option value="상담1팀">상담1팀</option>
              <option value="상담2팀">상담2팀</option>
              <option value="상담3팀">상담3팀</option>
              <option value="관리팀">관리팀</option>
              <option value="IT팀">IT팀</option>
              <option value="교육팀">교육팀</option>
            </select>
          </div>

          {/* 직급 */}
          <div>
            <Label className="text-xs text-[#666666] mb-1.5 block">
              직급 <span className="text-[#EA4335]">*</span>
            </Label>
            <select
              value={formData.position}
              onChange={(e) => setFormData({ ...formData, position: e.target.value })}
              className="w-full h-9 px-3 border border-[#E0E0E0] rounded-md text-xs"
              required
            >
              <option value="">선택하세요</option>
              <option value="사원">사원</option>
              <option value="주임">주임</option>
              <option value="대리">대리</option>
              <option value="과장">과장</option>
              <option value="차장">차장</option>
              <option value="부장">부장</option>
              <option value="이사">이사</option>
            </select>
          </div>

          {/* 이메일 */}
          <div>
            <Label className="text-xs text-[#666666] mb-1.5 block">
              이메일 <span className="text-[#EA4335]">*</span>
            </Label>
            <div className="flex items-center gap-1">
              <Input
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="h-9 text-xs flex-1"
                placeholder="hong"
                required
              />
              <span className="text-xs text-[#666666] whitespace-nowrap">@teddycard.com</span>
            </div>
          </div>

          {/* 연락처 */}
          <div>
            <Label className="text-xs text-[#666666] mb-1.5 block">
              연락처 <span className="text-[#EA4335]">*</span>
            </Label>
            <Input
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="h-9 text-xs"
              placeholder="010-1234-5678"
              required
            />
          </div>

          {/* 상태 */}
          <div>
            <Label className="text-xs text-[#666666] mb-1.5 block">상태</Label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              className="w-full h-9 px-3 border border-[#E0E0E0] rounded-md text-xs"
            >
              <option value="active">재직</option>
              <option value="vacation">휴가</option>
              <option value="inactive">비활성</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex gap-2 pt-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 h-9 text-xs"
            >
              취소
            </Button>
            <Button
              type="submit"
              className="flex-1 h-9 text-xs bg-[#0047AB] hover:bg-[#003580]"
            >
              추가
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}