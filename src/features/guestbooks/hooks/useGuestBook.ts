import type { GuestBookRequest } from '../types';
import type { GuestBookParams } from '../types/guestBookParams';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  createGuestBook,
  deleteGuestBook,
  getGuestBook,
  updateGuestBook,
} from '../api/guestBookApi';
import { guestBookKeys } from '../api/guestBookKeys';

export const useGuestBook = (storeId: string, params: GuestBookParams) => {
  const normalizedParams: GuestBookParams = {
    page: 0,
    size: 20,
    ...params,
  };
  return useQuery({
    queryFn: () => getGuestBook(storeId, normalizedParams),
    queryKey: guestBookKeys.list(storeId, normalizedParams),
  });
};

export const useCreateGuestBook = (storeId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: GuestBookRequest) => createGuestBook(storeId, body),
    onError: (error) => {
      console.error('댓글 등록', error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: guestBookKeys.listRoot(storeId),
      });
    },
  });
};

export const useUpdateGuestBook = (storeId: string, guestbookId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: GuestBookRequest) => updateGuestBook(storeId, guestbookId, body),
    onError: (error) => {
      console.error('댓글 수정 실패', error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: guestBookKeys.listRoot(storeId),
      });
    },
  });
};

export const useDeleteGuestBook = (storeId: string, guestbookId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => deleteGuestBook(storeId, guestbookId),
    onError: (error) => {
      console.error('댓글 삭제 실패', error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: guestBookKeys.listRoot(storeId),
      });
    },
  });
};
