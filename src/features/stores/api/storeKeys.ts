import type { StoreItemsParams } from '../types/storeParams';

export const storeKeys = {
  // 1. 상점과 관련된 키
  all: ['stores'] as const,

  // 특정 상점의 정보
  detail: (storeId: string) => [...storeKeys.details(), storeId] as const,

  details: () => [...storeKeys.all, 'detail'] as const,

  // 1. 상점 자체의 기본 정보
  info: (storeId: string) => [...storeKeys.detail(storeId), 'info'] as const,

  // 3. 상점의 물건 리스트 (최신순)
  items: (storeId: string, params: StoreItemsParams) =>
    [...storeKeys.detail(storeId), 'items', params] as const,

  // 2. 상점의 물건 리스트 (invalidate 용)
  itemsRoot: (storeId: string) => [...storeKeys.detail(storeId), 'items'] as const,

  // 4. 상점에 즐겨찾기 추가
  subscribe: (storeId: string) => [...storeKeys.detail(storeId), 'subscribe'] as const,
};
