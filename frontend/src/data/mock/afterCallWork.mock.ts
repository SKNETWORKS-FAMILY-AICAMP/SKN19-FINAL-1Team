/**
 * ⭐ 후처리 데이터 Mock (ACW - After Call Work)
 * 
 * 기존 `/src/data/afterCallWorkData/index.ts` 파일을 그대로 재export
 * MVP에서는 시나리오와 연결되어 있어 Mock 유지
 * 나중에 DB 연동 가능
 */

export { getACWDataByCategory, getAllACWData } from '../afterCallWorkData';
export type { ACWData } from '../afterCallWorkData/types';
