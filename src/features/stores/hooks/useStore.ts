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

export const useGetStore = (storeId: string) => {
  return useQuery({
    queryFn: () => getStore(storeId),
    queryKey: storeKeys.detail(storeId),
  });
};

export const useGetItems = (storeId: string, params: StoreItemsParams = {}) => {
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
// useStore.ts

export const useToggleSubscribe = (storeId: string) => {
  const queryClient = useQueryClient();
  const queryKey = storeKeys.subscribe(storeId);

  // 리턴 타입을 위해 인터페이스 정의 (선택 사항이지만 권장)
  interface MutationContext {
    previousStatus: boolean | undefined;
  }

  return useMutation<void, Error, boolean, MutationContext>({
    mutationFn: (isSubscribed: boolean) =>
      isSubscribed ? unsubscribe(storeId) : subscribe(storeId),

    // 세 번째 인자인 context를 통해 previousStatus에 접근합니다.
    onError: (error, isSubscribed, context) => {
      console.log(`isSubscribed ${isSubscribed}`);
      console.error('즐겨찾기 상태 변경 실패', error);

      // context가 존재하고 previousStatus가 있다면 롤백 진행
      if (context?.previousStatus !== undefined) {
        queryClient.setQueryData(queryKey, context.previousStatus);
      }
    },

    onMutate: async (isSubscribed) => {
      await queryClient.cancelQueries({ queryKey });

      const previousStatus = queryClient.getQueryData<boolean>(queryKey);

      // 낙관적 업데이트
      queryClient.setQueryData(queryKey, !isSubscribed);

      // 여기서 리턴하는 객체가 onError의 context가 됩니다.
      return { previousStatus };
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
};
