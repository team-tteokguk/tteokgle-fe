import type {
  ItemCreateRequest,
  MyStoreItemsRequest,
  MyStoreItemsResponse,
  MyStoreResponse,
  StoreItemResponse,
  StoreResponse,
} from '../types';

import { instance } from '../../../services/axios';

interface PresignRequest {
  contentType: string;
  fileName: string;
}

interface PresignResponse {
  expiresIn: number;
  fileUrl: string;
  key: string;
  method: string;
  uploadUrl: string;
}

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
  const { data } = await instance.post(`/stores/${storeId}/items`, body);
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

// [GET] 내 상점 정보 조회
export const getMyStore = async (): Promise<MyStoreResponse> => {
  const { data } = await instance.get('/stores/me');
  return data;
};

// [GET] 내 상점의 판매 아이템 목록 조회
export const getMyStoreItems = async (
  params: MyStoreItemsRequest,
): Promise<MyStoreItemsResponse> => {
  const { data } = await instance.get('/stores/me/items', { params });
  return data;
};

// [POST] 이미지 업로드 Presigned URL 발급
export const createImagePresignedUrl = async (body: PresignRequest): Promise<PresignResponse> => {
  const { data } = await instance.post('/files/presign', body);
  return data;
};

// [PUT] Presigned URL로 이미지 업로드
export const uploadImageToPresignedUrl = async (
  uploadUrl: string,
  file: File,
  contentType: string,
): Promise<void> => {
  const response = await fetch(uploadUrl, {
    body: file,
    headers: {
      'Content-Type': contentType,
    },
    method: 'PUT',
  });

  if (!response.ok) {
    throw new Error('이미지 업로드에 실패했습니다.');
  }
};
