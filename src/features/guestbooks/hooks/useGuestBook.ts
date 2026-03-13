import type { GuestBookRequest, GuestBookResponse } from '../types';
import type { GuestBookParams, PageResponse } from '../types/guestBookParams';

import {
  type InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import {
  createGuestBook,
  deleteGuestBook,
  getGuestBook,
  updateGuestBook,
} from '../api/guestBookApi';
import { guestBookKeys } from '../api/guestBookKeys';

export const useGuestBook = (storeId: string, params: GuestBookParams) => {
  const size = params.size ?? 20;
  return useInfiniteQuery<
    PageResponse<GuestBookResponse>,
    Error,
    InfiniteData<PageResponse<GuestBookResponse>>,
    ReturnType<typeof guestBookKeys.infiniteList>,
    number
  >({
    getNextPageParam: (lastPage) => (lastPage.last ? undefined : lastPage.number + 1),
    initialPageParam: 0,
    queryFn: ({ pageParam }) => getGuestBook(storeId, { page: pageParam, size }),
    queryKey: guestBookKeys.infiniteList(storeId, size),
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
        queryKey: guestBookKeys.infiniteRoot(storeId),
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
        queryKey: guestBookKeys.infiniteRoot(storeId),
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
        queryKey: guestBookKeys.infiniteRoot(storeId),
      });
    },
  });
};
