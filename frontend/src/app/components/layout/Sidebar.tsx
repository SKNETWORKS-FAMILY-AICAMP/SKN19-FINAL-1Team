import {
  Home,
  Phone,
  BookOpen,
  Users,
  BarChart3,
  Settings,
  Megaphone,
  Database,
  FlaskConical
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { DEV_MODE, USE_MOCK_DATA, toggleMockMode } from '@/config/mockConfig';

interface SidebarProps {
  isExpanded: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export default function Sidebar({ isExpanded, onMouseEnter, onMouseLeave }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    const adminStatus = localStorage.getItem('isAdmin') === 'true';
    console.log('Sidebar - userRole:', role, 'isAdmin:', adminStatus);
    setIsAdmin(adminStatus);
  }, [location.pathname]); // location 변경 시에도 체크

  const menuItems = [
    { id: 'dashboard', label: '대시보드', icon: Home, path: '/dashboard', highlight: false },
    { id: 'consultation', label: '상담 시작', icon: Phone, path: '/consultation/live', highlight: true },
    { id: 'simulation', label: '교육 시뮬레이션', icon: BookOpen, path: '/simulation', highlight: false },
    { id: 'employees', label: '사원 목록', icon: Users, path: '/employees', highlight: false },
  ];

  const adminMenuItems = [
    { id: 'admin-stats', label: '총괄 현황', icon: BarChart3, path: '/admin/stats', highlight: false },
    { id: 'admin-manage', label: '사원 관리', icon: Settings, path: '/admin/manage', highlight: false },
    { id: 'admin-consultations', label: '상담 관리', icon: Phone, path: '/admin/consultations', highlight: false },
    { id: 'admin-notice', label: '공지사항 관리', icon: Megaphone, path: '/admin/notice', highlight: false },
  ];

  return (
    <aside 
      className={`h-[calc(100vh-60px)] bg-white border-r border-[#E0E0E0] fixed left-0 top-[60px] overflow-hidden transition-all duration-300 z-50 shadow-lg hidden lg:block ${
        isExpanded ? 'w-[200px]' : 'w-[56px]'
      }`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <nav className="p-2 space-y-1 overflow-y-auto h-full">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`
                w-full h-11 px-3 rounded-md flex items-center gap-3 transition-all overflow-hidden whitespace-nowrap
                ${isActive
                  ? 'bg-[#0047AB] text-white font-semibold'
                  : 'text-[#333333] hover:bg-[#F5F5F5]'
                }
              `}
              title={!isExpanded ? item.label : ''}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span className={`text-sm transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0 w-0'}`}>
                {item.label}
              </span>
            </button>
          );
        })}

        {/* Admin Section */}
        {isAdmin && (
          <>
            <div className="h-px bg-[#E0E0E0] my-3"></div>
            {isExpanded && (
              <div className="px-3 py-1">
                <span className="text-[10px] text-[#999999] uppercase whitespace-nowrap">관리자</span>
              </div>
            )}
            {adminMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <button
                  key={item.id}
                  onClick={() => navigate(item.path)}
                  className={`
                    w-full h-11 px-3 rounded-md flex items-center gap-3 transition-all overflow-hidden whitespace-nowrap
                    ${isActive
                      ? 'bg-[#0047AB] text-white font-semibold'
                      : 'text-[#333333] hover:bg-[#F5F5F5]'
                    }
                  `}
                  title={!isExpanded ? item.label : ''}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className={`text-sm transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0 w-0'}`}>
                    {item.label}
                  </span>
                </button>
              );
            })}
          </>
        )}

        {/* ⭐ Mock/Real 토글 버튼 (개발자 모드에서만 표시) */}
        {DEV_MODE && (
          <>
            <div className="h-px bg-[#E0E0E0] my-3"></div>
            <button
              onClick={toggleMockMode}
              className={`
                w-full h-11 px-3 rounded-md flex items-center gap-3 transition-all overflow-hidden whitespace-nowrap
                ${USE_MOCK_DATA
                  ? 'bg-[#FFF3E0] text-[#E65100] hover:bg-[#FFE0B2]'
                  : 'bg-[#E8F5E9] text-[#2E7D32] hover:bg-[#C8E6C9]'
                }
              `}
              title={!isExpanded ? (USE_MOCK_DATA ? 'Mock 모드' : 'Real DB') : ''}
            >
              {USE_MOCK_DATA ? (
                <FlaskConical className="w-5 h-5 flex-shrink-0" />
              ) : (
                <Database className="w-5 h-5 flex-shrink-0" />
              )}
              <span className={`text-sm font-medium transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0 w-0'}`}>
                {USE_MOCK_DATA ? 'Mock 모드' : 'Real DB'}
              </span>
            </button>
          </>
        )}
      </nav>
    </aside>
  );
}