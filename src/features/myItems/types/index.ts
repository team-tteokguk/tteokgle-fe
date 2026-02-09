/**
 * 나의 떡국에서 고명 컨텐츠 조회
 */
export interface ItemDetailResponse extends ItmeBase {
  content: string;
  contentType: string;
  isRead: boolean;
  mediaUrl: string;
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
  posX: number;
  posY: number;
  posZ: number;
  used: boolean;
}

/**
 * 나의 떡국용 미배치된 고명 정보 조회
 */
export interface UnplacedItemResponse extends ItmeBase {
  read: boolean;
}
