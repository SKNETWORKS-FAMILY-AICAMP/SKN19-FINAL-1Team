/**
 * ⭐ 고객 DB Mock 데이터
 * 
 * 기존 `/src/data/mockCustomerDB.ts` 파일을 그대로 재export
 * MVP에서는 시나리오와 연결되어 있어 Mock 유지
 * 나중에 DB 연동 가능
 */

export { MOCK_CUSTOMER_DB as mockCustomerDB, getCustomerById, getCustomersByPersona, getTotalCustomerCount } from '../mockCustomerDB';
export type { CustomerPersona } from '../mockCustomerDB';