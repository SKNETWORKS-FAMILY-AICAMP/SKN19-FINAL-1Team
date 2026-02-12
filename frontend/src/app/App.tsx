import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ConsultationHistoryPage from './pages/ConsultationHistoryPage';
import AfterCallWorkPage from './pages/AfterCallWorkPage';
import ProfilePage from './pages/ProfilePage';
import EmployeesPage from './pages/EmployeesPage';
import SimulationPage from './pages/SimulationPage';
import AdminStatsPage from './pages/AdminStatsPage';
import AdminManagePage from './pages/AdminManagePage';
import AdminNoticePage from './pages/AdminNoticePage';
import AdminNoticeCreatePage from './pages/AdminNoticeCreatePage';
import AdminNoticeEditPage from './pages/AdminNoticeEditPage';
import NoticePage from './pages/NoticePage';
import RealTimeConsultationPage from './pages/RealTimeConsultationPage';
import AdminConsultationManagePage from './pages/AdminConsultationManagePage';
import LoadingPage from './pages/LoadingPage'; // ⭐ Phase 8-3: 로딩 페이지
import { SidebarProvider } from './contexts/SidebarContext';
import { employeesData } from '@/data/mock';
import { Toaster } from './components/ui/sonner'; // ⭐ Phase 10-2: Toast 알림
import { toast } from 'sonner';

// ⭐ 개발 모드: 데이터 검증 유틸리티 import
if (import.meta.env.DEV) {
  import('@/utils/dataValidator').then(({ validateAllData, printValidationReport }) => {
    // 앱 시작 시 자동 검증
    const report = validateAllData();
    printValidationReport(report);
  });
}

export default function App() {
  // 앱 초기 로드 시 mockData를 LocalStorage에 저장 (외부 게시 사이트 대응)
  useEffect(() => {
    const savedEmployees = localStorage.getItem('employees');
    if (!savedEmployees) {
      // 초기 데이터가 없으면 mockData 저장
      localStorage.setItem('employees', JSON.stringify(employeesData));
      console.log('✅ Initial employee data loaded to LocalStorage');
    }
  }, []);

  // ⭐ Phase 10-2: ESC 키로 Toast 닫기
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        toast.dismiss(); // 모든 Toast 닫기
      }
    };

    window.addEventListener('keydown', handleEscKey);
    return () => {
      window.removeEventListener('keydown', handleEscKey);
    };
  }, []);

  return (
    <BrowserRouter>
      <SidebarProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          {/* /consultation은 /consultation/live로 리다이렉트 */}
          <Route path="/consultation" element={<Navigate to="/consultation/live" replace />} />
          <Route path="/consultation/history" element={<ProtectedRoute><ConsultationHistoryPage /></ProtectedRoute>} />
          <Route path="/consultation/live" element={<ProtectedRoute><RealTimeConsultationPage /></ProtectedRoute>} />
          <Route path="/acw" element={<ProtectedRoute><AfterCallWorkPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/employees" element={<ProtectedRoute><EmployeesPage /></ProtectedRoute>} />
          <Route path="/simulation" element={<ProtectedRoute><SimulationPage /></ProtectedRoute>} />
          <Route path="/notice" element={<ProtectedRoute><NoticePage /></ProtectedRoute>} />
          <Route path="/admin/stats" element={<ProtectedRoute><AdminStatsPage /></ProtectedRoute>} />
          <Route path="/admin/manage" element={<ProtectedRoute><AdminManagePage /></ProtectedRoute>} />
          <Route path="/admin/notice" element={<ProtectedRoute><AdminNoticePage /></ProtectedRoute>} />
          <Route path="/admin/notice/create" element={<ProtectedRoute><AdminNoticeCreatePage /></ProtectedRoute>} />
          <Route path="/admin/notice/edit/:id" element={<ProtectedRoute><AdminNoticeEditPage /></ProtectedRoute>} />
          <Route path="/admin/consultations" element={<ProtectedRoute><AdminConsultationManagePage /></ProtectedRoute>} />
          {/* ⭐ Phase 8-3: 로딩 페이지 */}
          <Route path="/loading" element={<LoadingPage />} />
        </Routes>
        {/* ⭐ Phase 10-2: Toast 알림 시스템 */}
        <Toaster 
          position="top-center"
          richColors
          closeButton
          duration={3000}
        />
      </SidebarProvider>
    </BrowserRouter>
  );
}