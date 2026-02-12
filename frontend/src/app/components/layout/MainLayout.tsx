import { ReactNode, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import { useSidebar } from '../../contexts/SidebarContext';

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const { isSidebarExpanded, setIsSidebarExpanded, isPinned, setIsPinned } = useSidebar();
  const location = useLocation();

  // ⭐ 상담 페이지 여부 확인 (헤더를 포함한 전체 화면 사용)
  const isConsultationPage = 
    location.pathname === '/consultation' || 
    location.pathname === '/consultation/live' || 
    location.pathname === '/consultation/after-call-work' || 
    location.pathname === '/acw';

  // ⭐ 교육 시뮬레이션 페이지 (헤더 아래 고정 레이아웃)
  const isSimulationPage = location.pathname === '/simulation';

  // ⭐ body 스크롤 제거 (상담 + 교육 시뮬레이션)
  useEffect(() => {
    if (isConsultationPage || isSimulationPage) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }

    // cleanup
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [isConsultationPage, isSimulationPage]);

  // 최초 호버 시 자동으로 고정
  const handleMouseEnter = () => {
    setIsSidebarExpanded(true);
    setIsPinned(true);
  };

  const handleMouseLeave = () => {
    // 호버로 자동 고정되므로 mouseLeave는 아무 동작 안 함
  };

  // 메인 콘텐츠 클릭 시 사이드바 숨김
  const handleMainClick = () => {
    if (isPinned) {
      setIsPinned(false);
      setIsSidebarExpanded(false);
    }
  };

  return (
    <div className={`bg-[#F5F5F5] ${isConsultationPage ? 'h-screen overflow-hidden' : 'min-h-screen'}`}>
      <Header />
      
      <Sidebar 
        isExpanded={isSidebarExpanded}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />
      
      {/* 사이드바가 항상 표시되므로 메인 콘텐츠에 왼쪽 마진 추가 (데스크톱만) */}
      <main 
        className={`
          ${!isConsultationPage ? 'mt-[60px]' : ''} 
          transition-all duration-300 
          ${!isConsultationPage ? (isSidebarExpanded ? 'lg:ml-[200px]' : 'lg:ml-[56px]') : ''}
          ${(isConsultationPage || isSimulationPage) ? 'overflow-hidden' : ''}
        `}
        onClick={handleMainClick}
      >
        {children}
      </main>
    </div>
  );
}