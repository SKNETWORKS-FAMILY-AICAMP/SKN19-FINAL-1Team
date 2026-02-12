// ==================== 사원 데이터 (총 50명: 상담1팀 18명, 상담2팀 16명, 상담3팀 16명) ====================
// 순위 기준: 1) consultations 높은 순, 2) fcr 높은 순, 3) avgTime 빠른 순
export const employeesData = [
  // 🥇 1위: 김민수 (상담1팀) - 145건, FCR 96%, 4:15
  { id: 'EMP-002', name: '김민수', team: '상담1팀', position: '사원', consultations: 145, fcr: 96, avgTime: '4:15', rank: 1, trend: 'up' as const, status: 'active' as const, joinDate: '2024-03-01', email: 'kim@teddycard.com', phone: '010-2345-6789' },
  
  // 🥈 2위: 최은정 (상담3팀) - 140건, FCR 96%, 4:18
  { id: 'EMP-034', name: '최은정', team: '상담3팀', position: '대리', consultations: 140, fcr: 96, avgTime: '4:18', rank: 2, trend: 'up' as const, status: 'active' as const, joinDate: '2023-07-15', email: 'choiej@teddycard.com', phone: '010-2345-6701' },
  
  // 🥉 3위: 이영희 (상담2팀) - 138건, FCR 95%, 4:20
  { id: 'EMP-019', name: '이영희', team: '상담2팀', position: '대리', consultations: 138, fcr: 95, avgTime: '4:20', rank: 3, trend: 'same' as const, status: 'active' as const, joinDate: '2023-11-20', email: 'lee@teddycard.com', phone: '010-3456-7890' },
  
  // 4위: 이영표 (상담1팀) - 135건, FCR 95%, 4:28
  { id: 'EMP-018', name: '이영표', team: '상담1팀', position: '과장', consultations: 135, fcr: 95, avgTime: '4:28', rank: 4, trend: 'up' as const, status: 'active' as const, joinDate: '2023-03-12', email: 'leeyp@teddycard.com', phone: '010-3456-7801' },
  
  // 5위: 강민지 (상담2팀) - 134건, FCR 94%, 4:25
  { id: 'EMP-021', name: '강민지', team: '상담2팀', position: '대리', consultations: 134, fcr: 94, avgTime: '4:25', rank: 5, trend: 'up' as const, status: 'active' as const, joinDate: '2023-09-12', email: 'kang@teddycard.com', phone: '010-7890-1234' },
  
  // 6위: 문성민 (상담3팀) - 133건, FCR 95%, 4:30
  { id: 'EMP-040', name: '문성민', team: '상담3팀', position: '과장', consultations: 133, fcr: 95, avgTime: '4:30', rank: 6, trend: 'up' as const, status: 'active' as const, joinDate: '2023-06-18', email: 'moonsm@teddycard.com', phone: '010-8901-2367' },
  
  // 7위: 손흥민 (상담2팀) - 132건, FCR 93%, 4:35
  { id: 'EMP-023', name: '손흥민', team: '상담2팀', position: '대리', consultations: 132, fcr: 93, avgTime: '4:35', rank: 7, trend: 'up' as const, status: 'active' as const, joinDate: '2023-12-10', email: 'son@teddycard.com', phone: '010-1234-5679' },
  
  // 8위: 서지은 (상담3팀) - 131건, FCR 94%, 4:33
  { id: 'EMP-036', name: '서지은', team: '상담3팀', position: '사원', consultations: 131, fcr: 94, avgTime: '4:33', rank: 8, trend: 'up' as const, status: 'active' as const, joinDate: '2023-12-05', email: 'seoje@teddycard.com', phone: '010-4567-8923' },
  
  // 9위: 조현우 (상담1팀) - 130건, FCR 93%, 4:40
  { id: 'EMP-008', name: '조현우', team: '상담1팀', position: '대리', consultations: 130, fcr: 93, avgTime: '4:40', rank: 9, trend: 'up' as const, status: 'active' as const, joinDate: '2023-10-15', email: 'cho@teddycard.com', phone: '010-3456-7891' },
  
  // 10위: 전지현 (상담2팀) - 129건, FCR 94%, 4:42
  { id: 'EMP-026', name: '전지현', team: '상담2팀', position: '대리', consultations: 129, fcr: 94, avgTime: '4:42', rank: 10, trend: 'up' as const, status: 'active' as const, joinDate: '2023-10-08', email: 'jeon@teddycard.com', phone: '010-4567-8923' },
  
  // 11위: 이재성 (상담1팀) - 128건, FCR 94%, 4:38
  { id: 'EMP-015', name: '이재성', team: '상담1팀', position: '대리', consultations: 128, fcr: 94, avgTime: '4:38', rank: 11, trend: 'up' as const, status: 'active' as const, joinDate: '2023-09-20', email: 'leejs@teddycard.com', phone: '010-0123-4568' },
  
  // 12위: 유진희 (상담3팀) - 128건, FCR 93%, 4:41
  { id: 'EMP-044', name: '유진희', team: '상담3팀', position: '대리', consultations: 128, fcr: 93, avgTime: '4:41', rank: 12, trend: 'up' as const, status: 'active' as const, joinDate: '2023-09-22', email: 'yujh@teddycard.com', phone: '010-2345-6701' },
  
  // 13위: 홍길동 (상담1팀) - 127건, FCR 94%, 4:32
  { id: 'EMP-001', name: '홍길동', team: '상담1팀', position: '대리', consultations: 127, fcr: 94, avgTime: '4:32', rank: 13, trend: 'up' as const, status: 'active' as const, joinDate: '2024-01-15', email: 'hong@teddycard.com', phone: '010-1234-5678' },
  
  // 14위: 한동훈 (상담3팀) - 127건, FCR 93%, 4:44
  { id: 'EMP-037', name: '한동훈', team: '상담3팀', position: '대리', consultations: 127, fcr: 93, avgTime: '4:44', rank: 14, trend: 'same' as const, status: 'active' as const, joinDate: '2023-10-20', email: 'handh@teddycard.com', phone: '010-5678-9034' },
  
  // 15위: 유재석 (상담2팀) - 126건, FCR 93%, 4:46
  { id: 'EMP-029', name: '유재석', team: '상담2팀', position: '대리', consultations: 126, fcr: 93, avgTime: '4:46', rank: 15, trend: 'up' as const, status: 'active' as const, joinDate: '2023-11-25', email: 'yoo@teddycard.com', phone: '010-7890-1256' },
  
  // 16위: 김영권 (상담1팀) - 125건, FCR 93%, 4:45
  { id: 'EMP-011', name: '김영권', team: '상담1팀', position: '대리', consultations: 125, fcr: 93, avgTime: '4:45', rank: 16, trend: 'up' as const, status: 'active' as const, joinDate: '2023-11-05', email: 'kimyk@teddycard.com', phone: '010-6789-0124' },
  
  // 17위: 정수진 (상담2팀) - 125건, FCR 93%, 4:45 (동점이지만 joinDate가 늦음)
  { id: 'EMP-020', name: '정수진', team: '상담2팀', position: '사원', consultations: 125, fcr: 93, avgTime: '4:45', rank: 17, trend: 'up' as const, status: 'vacation' as const, joinDate: '2024-02-15', email: 'jung2@teddycard.com', phone: '010-5678-9012' },
  
  // 18위: 정민우 (상담3팀) - 124건, FCR 92%, 4:47
  { id: 'EMP-035', name: '정민우', team: '상담3팀', position: '사원', consultations: 124, fcr: 92, avgTime: '4:47', rank: 18, trend: 'up' as const, status: 'active' as const, joinDate: '2024-01-25', email: 'jungmw@teddycard.com', phone: '010-3456-7812' },
  
  // 19위: 김수현 (상담2팀) - 123건, FCR 92%, 4:48
  { id: 'EMP-025', name: '김수현', team: '상담2팀', position: '사원', consultations: 123, fcr: 92, avgTime: '4:48', rank: 19, trend: 'up' as const, status: 'active' as const, joinDate: '2024-03-22', email: 'kimsh@teddycard.com', phone: '010-3456-7812' },
  
  // 20위: 강하늘 (상담3팀) - 122건, FCR 92%, 4:49
  { id: 'EMP-041', name: '강하늘', team: '상담3팀', position: '사원', consultations: 122, fcr: 92, avgTime: '4:49', rank: 20, trend: 'up' as const, status: 'active' as const, joinDate: '2024-03-11', email: 'kanghn@teddycard.com', phone: '010-9012-3478' },
  
  // 21위: 김태희 (상담2팀) - 122건, FCR 92%, 4:50
  { id: 'EMP-022', name: '김태희', team: '상담2팀', position: '과장', consultations: 122, fcr: 92, avgTime: '4:50', rank: 21, trend: 'up' as const, status: 'active' as const, joinDate: '2023-08-15', email: 'kimth@teddycard.com', phone: '010-9012-3456' },
  
  // 22위: 김진수 (상담1팀) - 121건, FCR 91%, 4:52
  { id: 'EMP-014', name: '김진수', team: '상담1팀', position: '사원', consultations: 121, fcr: 91, avgTime: '4:52', rank: 22, trend: 'up' as const, status: 'active' as const, joinDate: '2024-01-10', email: 'kimjs@teddycard.com', phone: '010-9012-3457' },
  
  // 23위: 신동엽 (상담2팀) - 120건, FCR 91%, 4:55
  { id: 'EMP-031', name: '신동엽', team: '상담2팀', position: '사원', consultations: 120, fcr: 91, avgTime: '4:55', rank: 23, trend: 'up' as const, status: 'active' as const, joinDate: '2024-03-07', email: 'shin@teddycard.com', phone: '010-9012-3478' },
  
  // 24위: 백승호 (상담1팀) - 119건, FCR 92%, 4:50
  { id: 'EMP-010', name: '백승호', team: '상담1팀', position: '사원', consultations: 119, fcr: 92, avgTime: '4:50', rank: 24, trend: 'up' as const, status: 'active' as const, joinDate: '2024-02-20', email: 'baek@teddycard.com', phone: '010-5678-9013' },
  
  // 25위: 최영수 (상담1팀) - 118건, FCR 91%, 4:55
  { id: 'EMP-004', name: '최영수', team: '상담1팀', position: '사원', consultations: 118, fcr: 91, avgTime: '4:55', rank: 25, trend: 'same' as const, status: 'active' as const, joinDate: '2024-04-01', email: 'choi@teddycard.com', phone: '010-6789-0123' },
  
  // 26위: 안수진 (상담3팀) - 118건, FCR 91%, 4:56
  { id: 'EMP-038', name: '안수진', team: '상담3팀', position: '사원', consultations: 118, fcr: 91, avgTime: '4:56', rank: 26, trend: 'up' as const, status: 'active' as const, joinDate: '2024-02-12', email: 'ansj@teddycard.com', phone: '010-6789-0145' },
  
  // 27위: 박서준 (상담2팀) - 117건, FCR 91%, 4:58
  { id: 'EMP-024', name: '박서준', team: '상담2팀', position: '사원', consultations: 117, fcr: 91, avgTime: '4:58', rank: 27, trend: 'same' as const, status: 'active' as const, joinDate: '2024-01-18', email: 'parksj@teddycard.com', phone: '010-2345-6701' },
  
  // 28위: 오수아 (상담3팀) - 116건, FCR 90%, 5:02
  { id: 'EMP-042', name: '오수아', team: '상담3팀', position: '사원', consultations: 116, fcr: 90, avgTime: '5:02', rank: 28, trend: 'same' as const, status: 'active' as const, joinDate: '2024-01-30', email: 'ohsa@teddycard.com', phone: '010-0123-4589' },
  
  // 29위: 권경원 (상담1팀) - 116건, FCR 90%, 5:08
  { id: 'EMP-017', name: '권경원', team: '상담1팀', position: '사원', consultations: 116, fcr: 90, avgTime: '5:08', rank: 29, trend: 'same' as const, status: 'active' as const, joinDate: '2024-02-28', email: 'kwon@teddycard.com', phone: '010-2345-6790' },
  
  // 30위: 박지성 (상담1팀) - 115건, FCR 91%, 5:05
  { id: 'EMP-006', name: '박지성', team: '상담1팀', position: '사원', consultations: 115, fcr: 91, avgTime: '5:05', rank: 30, trend: 'same' as const, status: 'active' as const, joinDate: '2024-05-20', email: 'parkjs@teddycard.com', phone: '010-0123-4567' },
  
  // 31위: 이수근 (상담2팀) - 115건, FCR 90%, 5:08
  { id: 'EMP-033', name: '이수근', team: '상담2팀', position: '사원', consultations: 115, fcr: 90, avgTime: '5:08', rank: 31, trend: 'same' as const, status: 'active' as const, joinDate: '2024-04-20', email: 'leesg@teddycard.com', phone: '010-1234-5690' },
  
  // 32위: 이민호 (상담2팀) - 114건, FCR 90%, 5:05
  { id: 'EMP-028', name: '이민호', team: '상담2팀', position: '사원', consultations: 114, fcr: 90, avgTime: '5:05', rank: 32, trend: 'same' as const, status: 'active' as const, joinDate: '2024-02-09', email: 'leemh@teddycard.com', phone: '010-6789-0145' },
  
  // 33위: 정우영 (상담1팀) - 113건, FCR 90%, 5:00
  { id: 'EMP-012', name: '정우영', team: '상담1팀', position: '사원', consultations: 113, fcr: 90, avgTime: '5:00', rank: 33, trend: 'same' as const, status: 'active' as const, joinDate: '2024-03-15', email: 'jung@teddycard.com', phone: '010-7890-1235' },
  
  // 34위: 박철수 (상담1팀) - 112건, FCR 92%, 5:10
  { id: 'EMP-003', name: '박철수', team: '상담1팀', position: '과장', consultations: 112, fcr: 92, avgTime: '5:10', rank: 34, trend: 'down' as const, status: 'active' as const, joinDate: '2023-05-10', email: 'park@teddycard.com', phone: '010-4567-8901' },
  
  // 35위: 배지현 (상담3팀) - 112건, FCR 89%, 5:11
  { id: 'EMP-039', name: '배지현', team: '상담3팀', position: '사원', consultations: 112, fcr: 89, avgTime: '5:11', rank: 35, trend: 'down' as const, status: 'active' as const, joinDate: '2024-04-08', email: 'baejh@teddycard.com', phone: '010-7890-1256' },
  
  // 36위: 송중기 (상담2팀) - 111건, FCR 89%, 5:12
  { id: 'EMP-027', name: '송중기', team: '상담2팀', position: '사원', consultations: 111, fcr: 89, avgTime: '5:12', rank: 36, trend: 'down' as const, status: 'active' as const, joinDate: '2024-04-14', email: 'song@teddycard.com', phone: '010-5678-9034' },
  
  // 37위: 김채원 (상담3팀) - 110건, FCR 89%, 5:14
  { id: 'EMP-045', name: '김채원', team: '상담3팀', position: '사원', consultations: 110, fcr: 89, avgTime: '5:14', rank: 37, trend: 'down' as const, status: 'active' as const, joinDate: '2024-06-08', email: 'kimcw@teddycard.com', phone: '010-3456-7812' },
  
  // 38위: 이강인 (상담1팀) - 110건, FCR 89%, 5:15
  { id: 'EMP-007', name: '이강인', team: '상담1팀', position: '사원', consultations: 110, fcr: 89, avgTime: '5:15', rank: 38, trend: 'down' as const, status: 'active' as const, joinDate: '2024-06-01', email: 'leekg@teddycard.com', phone: '010-2345-6780' },
  
  // 39위: 강호동 (상담2팀) - 109건, FCR 88%, 5:22
  { id: 'EMP-030', name: '강호동', team: '상담2팀', position: '사원', consultations: 109, fcr: 88, avgTime: '5:22', rank: 39, trend: 'down' as const, status: 'active' as const, joinDate: '2024-05-30', email: 'kanghd@teddycard.com', phone: '010-8901-2367' },
  
  // 40위: 윤서연 (상담1팀) - 108건, FCR 90%, 5:20
  { id: 'EMP-005', name: '윤서연', team: '상담1팀', position: '사원', consultations: 108, fcr: 90, avgTime: '5:20', rank: 40, trend: 'down' as const, status: 'inactive' as const, joinDate: '2024-01-20', email: 'yoon@teddycard.com', phone: '010-8901-2345' },
  
  // 41위: 임윤아 (상담3팀) - 108건, FCR 88%, 5:20
  { id: 'EMP-043', name: '임윤아', team: '상담3팀', position: '사원', consultations: 108, fcr: 88, avgTime: '5:20', rank: 41, trend: 'down' as const, status: 'active' as const, joinDate: '2024-05-17', email: 'imya@teddycard.com', phone: '010-1234-5690' },
  
  // 42위: 나상호 (상담1팀) - 107건, FCR 89%, 5:18
  { id: 'EMP-013', name: '나상호', team: '상담1팀', position: '사원', consultations: 107, fcr: 89, avgTime: '5:18', rank: 42, trend: 'down' as const, status: 'active' as const, joinDate: '2024-04-25', email: 'na@teddycard.com', phone: '010-8901-2346' },
  
  // 43위: 김희철 (상담2팀) - 106건, FCR 87%, 5:28
  { id: 'EMP-032', name: '김희철', team: '상담2팀', position: '사원', consultations: 106, fcr: 87, avgTime: '5:28', rank: 43, trend: 'down' as const, status: 'active' as const, joinDate: '2024-06-15', email: 'kimhc@teddycard.com', phone: '010-0123-4589' },
  
  // 44위: 황희찬 (상담1팀) - 105건, FCR 88%, 5:25
  { id: 'EMP-009', name: '황희찬', team: '상담1팀', position: '사원', consultations: 105, fcr: 88, avgTime: '5:25', rank: 44, trend: 'down' as const, status: 'active' as const, joinDate: '2024-07-10', email: 'hwang@teddycard.com', phone: '010-4567-8902' },
  
  // 45위: 황인범 (상담1팀) - 102건, FCR 87%, 5:30
  { id: 'EMP-016', name: '황인범', team: '상담1팀', position: '사원', consultations: 102, fcr: 87, avgTime: '5:30', rank: 45, trend: 'down' as const, status: 'active' as const, joinDate: '2024-05-05', email: 'hwangib@teddycard.com', phone: '010-1234-5679' },
  
  // ==================== 🆕 신규 사원 5명 (EMP-046 ~ EMP-050) ====================
  // 46위: 배상준 (상담2팀) - 100건, FCR 87%, 5:32
  { id: 'EMP-046', name: '배상준', team: '상담2팀', position: '사원', consultations: 100, fcr: 87, avgTime: '5:32', rank: 46, trend: 'up' as const, status: 'active' as const, joinDate: '2024-08-01', email: 'baesj@teddycard.com', phone: '010-2468-1357' },
  
  // 47위: 박소희 (상담3팀) - 98건, FCR 86%, 5:35
  { id: 'EMP-047', name: '박소희', team: '상담3팀', position: '사원', consultations: 98, fcr: 86, avgTime: '5:35', rank: 47, trend: 'up' as const, status: 'active' as const, joinDate: '2024-08-15', email: 'parksh@teddycard.com', phone: '010-3579-2468' },
  
  // 48위: 안수이 (상담1팀) - 95건, FCR 85%, 5:38
  { id: 'EMP-048', name: '안수이', team: '상담1팀', position: '사원', consultations: 95, fcr: 85, avgTime: '5:38', rank: 48, trend: 'up' as const, status: 'active' as const, joinDate: '2024-09-01', email: 'ansi@teddycard.com', phone: '010-4680-3579' },
  
  // 49위: 오흥재 (상담2팀) - 92건, FCR 84%, 5:42
  { id: 'EMP-049', name: '오흥재', team: '상담2팀', position: '사원', consultations: 92, fcr: 84, avgTime: '5:42', rank: 49, trend: 'up' as const, status: 'active' as const, joinDate: '2024-09-15', email: 'ohhj@teddycard.com', phone: '010-5791-4680' },
  
  // 50위: 왕혁준 (상담3팀) - 88건, FCR 83%, 5:45
  { id: 'EMP-050', name: '왕혁준', team: '상담3팀', position: '사원', consultations: 88, fcr: 83, avgTime: '5:45', rank: 50, trend: 'up' as const, status: 'active' as const, joinDate: '2024-10-01', email: 'wanghj@teddycard.com', phone: '010-6802-5791' },
];
