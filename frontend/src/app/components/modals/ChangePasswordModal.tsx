import { X } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useState, useEffect } from 'react';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChangePasswordModal({ isOpen, onClose }: ChangePasswordModalProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // 현재 비밀번호 확인 (현재는 0000 고정)
    if (currentPassword !== '0000') {
      setError('현재 비밀번호가 일치하지 않습니다.');
      return;
    }

    // 새 비밀번호 검증
    if (newPassword.length < 4) {
      setError('새 비밀번호는 최소 4자 이상이어야 합니다.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('새 비밀번호가 일치하지 않습니다.');
      return;
    }

    // 성공 메시지 (실제 구현에서는 LocalStorage 또는 백엔드에 저장)
    import('@/utils/toast').then(({ showSuccess }) => {
      showSuccess('비밀번호가 변경되었습니다.', '※ 현재 베타 버전에서는 비밀번호 변경 기능이 제한됩니다.');
    });
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-md" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#E0E0E0]">
          <h2 className="text-lg font-bold text-[#333333]">비밀번호 변경</h2>
          <button
            onClick={onClose}
            className="text-[#999999] hover:text-[#333333] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <Label htmlFor="currentPassword" className="text-sm font-medium text-[#333333]">
              현재 비밀번호
            </Label>
            <Input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="mt-1.5 h-10"
              placeholder="현재 비밀번호 입력"
              required
            />
          </div>

          <div>
            <Label htmlFor="newPassword" className="text-sm font-medium text-[#333333]">
              새 비밀번호
            </Label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-1.5 h-10"
              placeholder="새 비밀번호 입력 (4자 이상)"
              required
            />
          </div>

          <div>
            <Label htmlFor="confirmPassword" className="text-sm font-medium text-[#333333]">
              새 비밀번호 확인
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1.5 h-10"
              placeholder="새 비밀번호 다시 입력"
              required
            />
          </div>

          {error && (
            <div className="p-3 bg-[#FFEBEE] border border-[#EA4335] rounded-lg">
              <p className="text-sm text-[#EA4335]">{error}</p>
            </div>
          )}

          {/* Beta Notice */}
          <div className="p-3 bg-[#FFF9E6] border border-[#FBBC04] rounded-lg">
            <p className="text-xs text-[#666666]">
              ℹ️ 현재 베타 버전에서는 기본 비밀번호(0000)만 사용 가능합니다.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 h-10"
            >
              취소
            </Button>
            <Button
              type="submit"
              className="flex-1 h-10 bg-[#0047AB] hover:bg-[#003580]"
            >
              변경
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}