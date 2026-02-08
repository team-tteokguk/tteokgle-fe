/**
 * 나의 떡국에서 고명 컨텐츠 조회
 */
export interface ItemDetailResponse extends ItmeBase {
  content: string;
  contentType: string;
  isRead: boolean;
  mediaUrl: string;
}

/**
 * 나의 떡국에 아이템 배치 정보 업데이트
 */
export interface ItemPlacementRequest {
  isUsed: boolean;
  posX: number;
  posY: number;
  posZ: number;
}

// RESPONSE

/**
 * 공통 고명 정보 (ItemBase)
 */
export interface ItmeBase {
  id: string;
  imageUrl: string;
  name: string;
}

/**
 * 나의 떡국용 배치된 고명 정보 조회
 */
export interface PlacedItemResponse extends ItmeBase {
  isUsed: boolean;
  posX: number;
  posY: number;
  posZ: number;
}

/**
 * 나의 떡국용 미배치된 고명 정보 조회
 */
export interface UnplacedItemResponse extends ItmeBase {
  isRead: boolean;
}
