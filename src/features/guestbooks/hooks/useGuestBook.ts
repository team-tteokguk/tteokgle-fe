import type { GuestBookRequest } from '../types';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  createGuestBook,
  deleteGuestBook,
  getGuestBook,
  updateGuestBook,
} from '../api/guestbookApi';
import { guestBookKeys } from '../api/guestBookKeys';

export const useGuestBook = (storeId: string) => {
  return useQuery({
    queryFn: () => getGuestBook(storeId),
    queryKey: guestBookKeys.list(storeId),
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
        queryKey: guestBookKeys.list(storeId),
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
        queryKey: guestBookKeys.list(storeId),
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
        queryKey: guestBookKeys.list(storeId),
      });
    },
  });
};
