import type { ItemCreateRequest, StoreItemResponse } from '../types';

import { instance } from '../../../services/axios';

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
