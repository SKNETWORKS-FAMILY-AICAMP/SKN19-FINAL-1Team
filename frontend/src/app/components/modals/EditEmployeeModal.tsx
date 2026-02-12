import { X } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useState, useEffect } from 'react';

interface EditEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (employeeData: any) => void;
  employee: any | null;
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

export default function EditEmployeeModal({ isOpen, onClose, onEdit, employee }: EditEmployeeModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    team: '',
    position: '',
    email: '', // 앞부분만 저장
    phone: '',
    status: 'active' as 'active' | 'vacation' | 'inactive',
  });

  // employee가 변경될 때 formData 업데이트
  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name || '',
        team: employee.team || '',
        position: employee.position || '',
        email: employee.email ? employee.email.split('@')[0] : '', // @teddycard.com 제거
        phone: employee.phone || '',
        status: employee.status || 'active',
      });
    }
  }, [employee]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 간단한 유효성 검사
    if (!formData.name || !formData.team || !formData.position || !formData.email || !formData.phone) {
      import('@/utils/toast').then(({ showWarning }) => {
        showWarning('모든 필수 항목을 입력해주세요.');
      });
      return;
    }

    // 수정된 사원 데이터
    const updatedEmployee = {
      ...employee,
      name: formData.name,
      team: formData.team.replace(/\s+/g, ''), // 팀 이름 정규화 (띄워쓰기 제거)
      position: formData.position,
      email: `${formData.email}@teddycard.com`, // 자동으로 도메인 추가
      phone: formData.phone,
      status: formData.status,
    };

    onEdit(updatedEmployee);
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
          <h2 className="text-base font-bold text-[#333333]">사원 정보 수정</h2>
          <button
            onClick={onClose}
            className="w-6 h-6 flex items-center justify-center hover:bg-[#F5F5F5] rounded transition-colors"
          >
            <X className="w-4 h-4 text-[#666666]" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-3">
          {/* 사번 (읽기 전용) */}
          <div>
            <Label className="text-xs text-[#666666] mb-1.5 block">사번</Label>
            <Input
              value={employee?.id || ''}
              className="h-9 text-xs bg-[#F5F5F5]"
              disabled
            />
          </div>

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
              onChange={(e) => setFormData({ ...formData, phone: formatPhoneNumber(e.target.value) })}
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

          {/* 입사일 (읽기 전용) */}
          <div>
            <Label className="text-xs text-[#666666] mb-1.5 block">입사일</Label>
            <Input
              value={employee?.joinDate || ''}
              className="h-9 text-xs bg-[#F5F5F5]"
              disabled
            />
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
              수정
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}