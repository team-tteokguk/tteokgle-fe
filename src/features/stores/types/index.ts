import type { ItmeBase } from '../../myItems/types';

/**
 * 고명 정보 등록
 */
export interface ItemCreateRequest {
  content: string;
  contentType: 'NONE' | 'PHOTO' | 'VIDEO';
  imageUrl: null | string;
  mediaUrl: null | string;
  name: string;
}

export interface MyStoreItem extends ItmeBase {
  cost: number;
  sellCounts: number;
}

export interface MyStoreItemsPage {
  first: boolean;
  hasNext: boolean;
  numberOfElements: number;
  page: number;
  size: number;
}

export interface MyStoreItemsRequest {
  page: number;
  size: number;
  sort: string[];
}

export interface MyStoreItemsResponse {
  items: MyStoreItem[];
  page: MyStoreItemsPage;
  sellingItemCount: number;
  storeName: string;
}

export interface MyStoreResponse {
  id: string;
  name: string;
}

export interface MyStoreUpdateRequest {
  name: string;
}

export interface StoreFavoritesRequest {
  page?: number;
  size?: number;
  sort?: string;
}

/**
 * 상점에서 상품 리스트 조회
 */
export interface StoreItemResponse extends ItmeBase {
  cost: number;
  sellCounts: number;
}

export interface StoreListItem {
  favorite: boolean;
  nickname: string;
  profileImage: string;
  sellingItemTypeCount: number;
  storeId: string;
  storeName: string;
}

export interface StoreListSliceResponse {
  content: StoreListItem[];
  empty: boolean;
  first: boolean;
  last: boolean;
  number: number;
  size: number;
}

/**
 * 상점 정보 불러오기
 */
export interface StoreResponse {
  id: number;
  name: string;
}

export interface StoreSearchRequest {
  keyword: string;
  page?: number;
  size?: number;
  sort?: string;
}
