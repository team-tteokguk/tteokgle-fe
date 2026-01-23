import type { ItemCreateRequest, StoreItemResponse, StoreResponse } from '../types';

import { instance } from '../../../services/axios';

// [GET] 상점 정보 불러오기
export const getStore = async (storeId: string): Promise<StoreResponse> => {
  const { data } = await instance.get(`/store/${storeId}`);
  return data;
};

// [GET] 상점 고명 리스트 조회하기
export const getItems = async (storeId: string): Promise<StoreItemResponse[]> => {
  const { data } = await instance.get(`/store/${storeId}/items`);
  return data;
};

// [POST] 고명 등록하기
export const createItem = async (
  storeId: string,
  body: ItemCreateRequest,
): Promise<StoreItemResponse> => {
  const { data } = await instance.post(`/store/${storeId}/items`, body);
  return data;
};

// [DELETE] 고명 삭제하기
export const deleteItem = async (storeId: string, itemId: string): Promise<void> => {
  await instance.delete(`/store/${storeId}/items/${itemId}`);
};

// [POST] 즐겨찾기 추가
export const subscribe = async (storeId: string): Promise<void> => {
  await instance.post(`/store/${storeId}/subscription`);
};

// [POST] 즐겨찾기 해제
export const unsubscribe = async (storeId: string): Promise<void> => {
  await instance.delete(`/store/${storeId}/subscription`);
};
