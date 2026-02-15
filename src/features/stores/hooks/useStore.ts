import type { ItemCreateRequest } from '../types';
import type { StoreItemsParams } from '../types/storeParams';

import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  createItem,
  deleteItem,
  getItems,
  getStore,
  subscribe,
  unsubscribe,
} from '../api/storeApi';
import { storeKeys } from '../api/storeKeys';

export const useStore = (storeId: string) => {
  return useQuery({
    queryFn: () => getStore(storeId),
    queryKey: storeKeys.detail(storeId),
  });
};

export const useItems = (storeId: string, params: StoreItemsParams = {}) => {
  const normalizedParams: StoreItemsParams = {
    page: 0,
    size: 20,
    ...params,
  };

  return useQuery({
    placeholderData: keepPreviousData,
    queryFn: () => getItems(storeId, normalizedParams),
    queryKey: storeKeys.items(storeId, normalizedParams),
  });
};

export const useCreateItem = (storeId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: ItemCreateRequest) => createItem(storeId, body),
    onError: (error) => {
      console.error('고명 등록 실패', error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: storeKeys.itemsRoot(storeId),
      });
    },
  });
};

export const useDeleteItem = (storeId: string, itemId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => deleteItem(storeId, itemId),
    onError: (error) => {
      console.error('고명 삭제 실패', error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: storeKeys.itemsRoot(storeId),
      });
    },
  });
};

export const useToggleSubscribe = (storeId: string) => {
  const queryClient = useQueryClient();
  const queryKey = storeKeys.subscribe(storeId);

  return useMutation({
    mutationFn: (isSubscribed: boolean) =>
      isSubscribed ? unsubscribe(storeId) : subscribe(storeId),

    onError: (error) => {
      console.error('즐겨찾기 상태 변경 실패', error);
    },

    onMutate: async (isSubscribed) => {
      // 진행 중인 refetch 중지
      await queryClient.cancelQueries({ queryKey });

      // 롤백을 위한 백업
      const previousStatus = queryClient.getQueryData(queryKey);

      // 캐시 즉시 업데이트
      queryClient.setQueryData(queryKey, !isSubscribed);

      return { previousStatus };
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
};
