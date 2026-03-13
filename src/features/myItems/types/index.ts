/**
 * 나의 떡국에서 고명 컨텐츠 조회
 */
export interface ItemDetailResponse extends ItmeBase {
  content: string;
  contentType: string;
  creatorNickname: string;
  isRead: boolean;
  itemType: string;
  mediaUrl: string;
}

/**
 * 나의 떡국에 아이템 배치 정보 업데이트
 */

// RESPONSE

/**
 * 공통 고명 정보 (ItemBase)
 */
export interface ItmeBase {
  id: string;
  imageUrl: string;
  name: string;
}

export interface Page {
  first: boolean;
  hasNext: boolean;
  numberOfElements: number;
  page: number;
  size: number;
}

/**
 * 나의 떡국용 배치된 고명 정보 조회
 */
export interface PlacedItemList extends ItmeBase {
  posX: number;
  posY: number;
  posZ: number;
  read: boolean;
  used: boolean;
}

export interface PlacedItemResponse {
  items: PlacedItemList[];
  page: Page;
}

/**
 * 나의 떡국용 미배치된 고명 정보 조회
 */
export interface UnplacedItemList extends ItmeBase {
  read: boolean;
  used: boolean;
}

export interface UnplacedItemResponse {
  items: UnplacedItemList[];
  page: Page;
}
