/**
 * ⭐ 상담사 API
 *
 * Feature Flag (mockConfig.ts의 USE_MOCK_DATA)에 따라:
 * - true: Mock 데이터 사용
 * - false: 실제 FastAPI 백엔드 호출
 */

import { USE_MOCK_DATA } from '@/config/mockConfig';
import { employeesData } from '@/data/mock';
import { API_BASE_URL } from '../config/apiConfig';

// API 기본 URL
export interface Employee {
  id: string;
  name: string;
  email?: string;
  role?: string;
  department?: string;
  hireDate?: string;
  status?: string;
  consultations: number;
  fcr: number;
  avgTime: string;
  rank: number;
  // Frontend 호환 필드
  team?: string;      // department와 동일
  position?: string;  // role과 동일
  joinDate?: string;  // hireDate와 동일
  phone?: string;     // 선택적
  trend?: string;     // 선택적 (up/down/same)
}

export interface TopEmployee {
  id: string;
  name: string;
  title: string;
  team: string;
  rank: number;
}

interface EmployeeListResponse {
  success: boolean;
  data: Employee[];
  total: number;
  message: string;
}

interface TopEmployeesResponse {
  success: boolean;
  data: TopEmployee[];
  message: string;
}

/**
 * 상담사 목록 조회
 *
 * @param limit - 조회 개수 (기본 50)
 * @param offset - 오프셋 (페이지네이션용)
 * @returns 상담사 목록
 */
export async function fetchEmployees(limit: number = 50, offset: number = 0): Promise<Employee[]> {
  if (USE_MOCK_DATA) {
    // ⭐ Mock 모드
    console.log('[Mock] Fetching employees:', { limit, offset });
    return new Promise((resolve) => {
      setTimeout(() => {
        const employees = employeesData.slice(offset, offset + limit).map(emp => ({
          ...emp,
          department: emp.team,
        }));
        resolve(employees);
      }, 300);
    });
  } else {
    // ⭐ Real 모드
    try {
      console.log('[API] Fetching employees from backend...');
      const response = await fetch(`${API_BASE_URL}/employees?limit=${limit}&offset=${offset}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.error('[API Error] Failed to fetch employees:', response.status);
        return employeesData.slice(offset, offset + limit);
      }

      const result: EmployeeListResponse = await response.json();
      console.log('[API] Employees fetched:', result.data.length, '명');
      // Frontend 호환 필드 추가
      return result.data.map(emp => ({
        ...emp,
        team: emp.team || emp.department,
        position: emp.position || emp.role,
        joinDate: emp.joinDate || emp.hireDate,
        phone: emp.phone || '',
        trend: emp.trend || 'same',
      }));
    } catch (error) {
      console.error('[API Error] fetchEmployees:', error);
      return employeesData.slice(offset, offset + limit);
    }
  }
}

/**
 * 우수 상담사 조회 (대시보드용)
 *
 * @param limit - 조회 개수 (기본 3)
 * @returns 우수 상담사 목록
 */
export async function fetchTopEmployees(limit: number = 3): Promise<TopEmployee[]> {
  if (USE_MOCK_DATA) {
    // ⭐ Mock 모드
    console.log('[Mock] Fetching top employees:', { limit });
    return new Promise((resolve) => {
      setTimeout(() => {
        const topEmployees = employeesData
          .filter(emp => emp.rank > 0 && emp.rank <= limit)
          .sort((a, b) => a.rank - b.rank)
          .map((emp, index) => {
            const titles = [
              `FCR ${emp.fcr}% 달성`,
              `평균 ${emp.avgTime} 처리 시간`,
              `월간 ${emp.consultations}건 상담`
            ];
            return {
              id: emp.id,
              name: emp.name,
              title: titles[index] || `FCR ${emp.fcr}% 달성`,
              team: emp.team,
              rank: emp.rank
            };
          });
        resolve(topEmployees);
      }, 300);
    });
  } else {
    // ⭐ Real 모드
    try {
      console.log('[API] Fetching top employees from backend...');
      const response = await fetch(`${API_BASE_URL}/employees/top?limit=${limit}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.error('[API Error] Failed to fetch top employees:', response.status);
        // 폴백: Mock 데이터 사용
        const topEmployees = employeesData
          .filter(emp => emp.rank > 0 && emp.rank <= limit)
          .sort((a, b) => a.rank - b.rank)
          .slice(0, limit)
          .map((emp, index) => {
            const titles = [
              `FCR ${emp.fcr}% 달성`,
              `평균 ${emp.avgTime} 처리 시간`,
              `월간 ${emp.consultations}건 상담`
            ];
            return {
              id: emp.id,
              name: emp.name,
              title: titles[index] || `FCR ${emp.fcr}% 달성`,
              team: emp.team,
              rank: emp.rank
            };
          });
        return topEmployees;
      }

      const result: TopEmployeesResponse = await response.json();
      console.log('[API] Top employees fetched:', result.data.length, '명');
      return result.data;
    } catch (error) {
      console.error('[API Error] fetchTopEmployees:', error);
      // 폴백: Mock 데이터 사용
      const topEmployees = employeesData
        .filter(emp => emp.rank > 0 && emp.rank <= limit)
        .sort((a, b) => a.rank - b.rank)
        .slice(0, limit)
        .map((emp, index) => {
          const titles = [
            `FCR ${emp.fcr}% 달성`,
            `평균 ${emp.avgTime} 처리 시간`,
            `월간 ${emp.consultations}건 상담`
          ];
          return {
            id: emp.id,
            name: emp.name,
            title: titles[index] || `FCR ${emp.fcr}% 달성`,
            team: emp.team,
            rank: emp.rank
          };
        });
      return topEmployees;
    }
  }
}

/**
 * 특정 상담사 조회
 *
 * @param employeeId - 상담사 ID
 * @returns 상담사 상세 정보
 */
export async function fetchEmployeeById(employeeId: string): Promise<Employee | null> {
  if (USE_MOCK_DATA) {
    // ⭐ Mock 모드
    console.log('[Mock] Fetching employee by ID:', employeeId);
    return new Promise((resolve) => {
      setTimeout(() => {
        const employee = employeesData.find((e) => e.id === employeeId);
        resolve(employee ? { ...employee, department: employee.team } : null);
      }, 200);
    });
  } else {
    // ⭐ Real 모드
    try {
      const response = await fetch(`${API_BASE_URL}/employees/${employeeId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.error('[API Error] Failed to fetch employee:', response.status);
        return null;
      }

      const result = await response.json();
      return { ...result.data, team: result.data.department };
    } catch (error) {
      console.error('[API Error] fetchEmployeeById:', error);
      return null;
    }
  }
}


// ==============================================================================
// CRUD Functions (Create, Update, Delete)
// ==============================================================================

export interface CreateEmployeeData {
  id?: string;
  name: string;
  email?: string;
  phone?: string;
  role?: string;       // position과 동일
  department?: string; // team과 동일
  hireDate?: string;   // joinDate와 동일
  status?: string;
}

export interface UpdateEmployeeData {
  name?: string;
  email?: string;
  phone?: string;
  role?: string;
  department?: string;
  hireDate?: string;
  status?: string;
}

/**
 * 사원 생성
 */
export async function createEmployee(data: CreateEmployeeData): Promise<Employee | null> {
  if (USE_MOCK_DATA) {
    console.log('[Mock] Creating employee:', data);
    return new Promise((resolve) => {
      setTimeout(() => {
        const newEmployee: Employee = {
          id: data.id || `EMP-${Date.now()}`,
          name: data.name,
          email: data.email,
          phone: data.phone,
          role: data.role,
          department: data.department,
          team: data.department,
          position: data.role,
          hireDate: data.hireDate,
          joinDate: data.hireDate,
          status: data.status || 'active',
          consultations: 0,
          fcr: 0,
          avgTime: '0:00',
          rank: 0,
        };
        resolve(newEmployee);
      }, 300);
    });
  } else {
    try {
      console.log('[API] Creating employee...');
      const response = await fetch(`${API_BASE_URL}/employees`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('[API Error] Failed to create employee:', error);
        return null;
      }

      const result = await response.json();
      console.log('[API] Employee created:', result.data.id);
      return {
        ...result.data,
        team: result.data.department,
        position: result.data.role,
        joinDate: result.data.hireDate,
      };
    } catch (error) {
      console.error('[API Error] createEmployee:', error);
      return null;
    }
  }
}

/**
 * 사원 정보 수정
 */
export async function updateEmployee(employeeId: string, data: UpdateEmployeeData): Promise<Employee | null> {
  if (USE_MOCK_DATA) {
    console.log('[Mock] Updating employee:', employeeId, data);
    return new Promise((resolve) => {
      setTimeout(() => {
        const employee = employeesData.find((e) => e.id === employeeId);
        if (employee) {
          resolve({ ...employee, ...data, team: data.department || employee.team });
        } else {
          resolve(null);
        }
      }, 300);
    });
  } else {
    try {
      console.log('[API] Updating employee:', employeeId);
      const response = await fetch(`${API_BASE_URL}/employees/${employeeId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('[API Error] Failed to update employee:', error);
        return null;
      }

      const result = await response.json();
      console.log('[API] Employee updated:', employeeId);
      return {
        ...result.data,
        team: result.data.department,
        position: result.data.role,
        joinDate: result.data.hireDate,
      };
    } catch (error) {
      console.error('[API Error] updateEmployee:', error);
      return null;
    }
  }
}

/**
 * 사원 삭제 (soft delete)
 */
export async function deleteEmployee(employeeId: string): Promise<boolean> {
  if (USE_MOCK_DATA) {
    console.log('[Mock] Deleting employee:', employeeId);
    return new Promise((resolve) => {
      setTimeout(() => resolve(true), 300);
    });
  } else {
    try {
      console.log('[API] Deleting employee:', employeeId);
      const response = await fetch(`${API_BASE_URL}/employees/${employeeId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('[API Error] Failed to delete employee:', error);
        return false;
      }

      console.log('[API] Employee deleted:', employeeId);
      return true;
    } catch (error) {
      console.error('[API Error] deleteEmployee:', error);
      return false;
    }
  }
}
