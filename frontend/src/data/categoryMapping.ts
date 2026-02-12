// ⭐ Phase 14: 8개 대분류 - 중분류 카테고리 매핑 시스템

// 8개 대분류 카테고리
export const MAIN_CATEGORIES = [
  '분실/도난',
  '한도',
  '결제/승인',
  '이용내역',
  '수수료/연체',
  '포인트/혜택',
  '정부지원',
  '기타',
] as const;

export type MainCategory = typeof MAIN_CATEGORIES[number];

// 중분류 카테고리 매핑
export const SUB_CATEGORIES: Record<MainCategory, string[]> = {
  '분실/도난': [
    '분실신고',
    '도난신고',
    '카드재발급',
    '긴급정지',
    '해제요청',
  ],
  '한도': [
    '한도조회',
    '한도증액',
    '일시불한도',
    '현금서비스한도',
    '한도감액',
  ],
  '결제/승인': [
    '해외결제',
    '승인오류',
    '결제취소',
    '선결제',
    '자동이체',
  ],
  '이용내역': [
    '이용내역조회',
    '명세서발급',
    '거래내역확인',
    '미출금내역',
    '청구서문의',
  ],
  '수수료/연체': [
    '연회비문의',
    '할부수수료',
    '연체문의',
    '연체이자',
    '수수료환불',
    '납부방법',
  ],
  '포인트/혜택': [
    '포인트조회',
    '포인트사용',
    '마일리지',
    '캐시백',
    '프로모션',
    '이벤트',
  ],
  '정부지원': [
    '정부지원카드',
    '바우처',
    '등유바우처',
    '임신출산바우처',
    '육아바우처',
    '복지카드',
  ],
  '기타': [
    '결제일변경',
    '자동이체',
    '카드발급',
    '일반문의',
    '서비스안내',
    '계좌변경',
  ],
};

// 구 카테고리를 새 카테고리로 매핑
export const LEGACY_CATEGORY_MAPPING: Record<string, { main: MainCategory; sub: string }> = {
  '카드분실': { main: '분실/도난', sub: '분실신고' },
  '도난': { main: '분실/도난', sub: '도난신고' },
  '해외결제': { main: '결제/승인', sub: '해외결제' },
  '수수료문의': { main: '수수료/연체', sub: '연회비문의' },
  '연회비': { main: '수수료/연체', sub: '연회비문의' },
  '한도조회': { main: '한도', sub: '한도조회' },
  '한도증액': { main: '한도', sub: '한도증액' },
  '포인트': { main: '포인트/혜택', sub: '포인트조회' },
  '프로모션': { main: '포인트/혜택', sub: '프로모션' },
  '연체문의': { main: '수수료/연체', sub: '연체문의' },
  '결제일변경': { main: '기타', sub: '결제일변경' },
  '기타': { main: '기타', sub: '일반문의' },
  '일반문의': { main: '기타', sub: '일반문의' },
};

// 카테고리 변환 헬퍼 함수
export function convertLegacyCategory(legacyCategory: string): { main: MainCategory; sub: string } {
  return LEGACY_CATEGORY_MAPPING[legacyCategory] || { main: '기타', sub: '일반문의' };
}

// 카테고리 표시 형식
export function formatCategory(main: MainCategory, sub: string): string {
  return `${main} > ${sub}`;
}

// 카테고리 파싱 (역방향)
export function parseCategory(formatted: string): { main: MainCategory; sub: string } | null {
  const parts = formatted.split(' > ');
  if (parts.length === 2) {
    const main = parts[0] as MainCategory;
    if (MAIN_CATEGORIES.includes(main)) {
      return { main, sub: parts[1] };
    }
  }
  return null;
}
