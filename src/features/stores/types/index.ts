import type { ItmeBase } from '../../myItems/types';

/**
 * 고명 정보 등록
 */
export interface ItemCreateRequest {
  content: string;
  contentType: string;
  imageUrl: string;
  mediaUrl: string;
  name: string;
}

/**
 * 상점에서 상품 리스트 조회
 */
export interface StoreItemResponse extends ItmeBase {
  cost: number;
  sellCounts: number;
}

/**
 * 상점 정보 불러오기
 */
export interface StoreResponse {
  id: number;
  name: string;
}
