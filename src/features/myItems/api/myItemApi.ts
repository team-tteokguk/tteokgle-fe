import type { ItemDetailResponse, PlacedItemResponse, UnplacedItemResponse } from '../types';

import { instance } from '../../../services/axios';

// [GET] 고명 컨텐츠 조회
export const getItemDetail = async (itemId: string): Promise<ItemDetailResponse> => {
  const { data } = await instance.get(`/tteokguk/me/items/${itemId}`);
  return data;
};

// [PATCH] 고명 배치 및 수납
export const updateItemPlacement = async (itemId: string): Promise<void> => {
  const { data } = await instance.patch(`/tteokguk/me/items/${itemId}`, {});
  return data;
};

// [PATCH] 고명 읽음 처리
export const readItem = async (itemId: string): Promise<ItemDetailResponse> => {
  const { data } = await instance.patch(`/tteokguk/me/items/${itemId}/read`);
  return data;
};

// [GET] 인벤토리 고명 리스트 조회
export const getPlacedItemList = async (): Promise<PlacedItemResponse> => {
  const { data } = await instance.get(`/tteokguk/me/items/placed`);
  return data;
};

// [GET] 배치된 고명 리스트 조회
export const getUnPlacedItemList = async (): Promise<UnplacedItemResponse> => {
  const { data } = await instance.get(`/tteokguk/me/items/unplaced`);
  return data;
};
