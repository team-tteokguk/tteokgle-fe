import type { GuestBookRequest, GuestBookResponse } from '../types';
import type { GuestBookParams, PageResponse } from '../types/guestBookParams';

import { instance } from '../../../services/axios';

const normalizeGuestBookList = (data: any): GuestBookResponse[] => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.content)) return data.content;
  return [];
};

// [GET] 방명록 불러오기
export const getGuestBook = async (
  storeId: string,
  params: GuestBookParams,
): Promise<PageResponse<GuestBookResponse>> => {
  const { data } = await instance.get(`/store/${storeId}/guestbooks`, {
    params: {
      ...params,
      sort: 'createdAt,desc', // spring pageable 형태 고정
    },
  });
  return data;
};

// [POST] 방명록 작성하기
export const createGuestBook = async (
  storeId: string,
  body: GuestBookRequest,
): Promise<GuestBookResponse> => {
  const { data } = await instance.post(`/stores/${storeId}/guestbooks`, body);
  return data;
};

// [PUT] 방명록 수정하기
export const updateGuestBook = async (
  storeId: string,
  guestbookId: string,
  body: GuestBookRequest,
): Promise<GuestBookResponse> => {
  const { data } = await instance.put(`/stores/${storeId}/guestbooks/${guestbookId}`, body);
  return data;
};

// [DELETE] 방명록 삭제하기
export const deleteGuestBook = async (
  storeId: string,
  guestbookId: string,
): Promise<GuestBookResponse> => {
  const { data } = await instance.delete(`/stores/${storeId}/guestbooks/${guestbookId}`);
  return data;
};
