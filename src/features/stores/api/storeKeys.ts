export const storeKeys = {
  // 1. 상점과 관련된 키
  all: ['stores'] as const,

  // 특정 상점의 정보
  detail: (storeId: string) => [...storeKeys.details(), storeId] as const,

  details: () => [...storeKeys.all, 'detail'] as const,

  // 1. 상점 자체의 기본 정보
  info: (storeId: string) => [...storeKeys.detail(storeId), 'info'] as const,

  // 2. 상점의 물건 리스트
  items: (storeId: string) => [...storeKeys.detail(storeId), 'items'] as const,
};
