import type { GuestBookRequest, GuestBookResponse } from '../types';
import type { GuestBookParams } from '../types/guestBookParams';

import { instance } from '../../../services/axios';

// [GET] 방명록 불러오기
export const getGuestBook = async (
  storeId: string,
  params: GuestBookParams,
): Promise<GuestBookResponse[]> => {
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
  const { data } = await instance.post(`/store/${storeId}/guestbooks`, body);
  return data;
};

// [PUT] 방명록 수정하기
export const updateGuestBook = async (
  storeId: string,
  guestbookId: string,
  body: GuestBookRequest,
): Promise<GuestBookResponse> => {
  const { data } = await instance.put(`/store/${storeId}/guestbooks/${guestbookId}`, body);
  return data;
};

// [DELETE] 방명록 삭제하기
export const deleteGuestBook = async (
  storeId: string,
  guestbookId: string,
): Promise<GuestBookResponse> => {
  const { data } = await instance.delete(`/store/${storeId}/guestbooks/${guestbookId}`);
  return data;
};
