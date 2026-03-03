import type { ItemDetailResponse, PlacedItemResponse, UnplacedItemResponse } from '../types';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useAuthStore } from '../../../store/auth/useAuthStore';
import {
  getItemDetail,
  getPlacedItemList,
  getUnPlacedItemList,
  readItem,
  updateItemPlacement,
} from '../api/myItemApi';
import { myItemKeys } from '../api/myItemKeys';

export const useItemDetail = (itemId: string) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    enabled: !!itemId && isAuthenticated,
    queryFn: () => getItemDetail(itemId),
    queryKey: myItemKeys.detail(itemId),
  });
};

export const useUpdateItemPlacement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ isUsed, itemId }: { isUsed: boolean; itemId: string }) =>
      updateItemPlacement({ isUsed, itemId }),
    onError: (error) => {
      console.error('아이템 배치 실패', error);
    },
    onSuccess: (_, { itemId }) => {
      queryClient.invalidateQueries({ queryKey: myItemKeys.detail(itemId) });
      queryClient.invalidateQueries({ queryKey: myItemKeys.placed() });
      queryClient.invalidateQueries({ queryKey: myItemKeys.unplaced() });
    },
  });
};

export const useReadItem = (itemId: string) => {
  const queryClient = useQueryClient();

  return useMutation<
    ItemDetailResponse,
    Error,
    void,
    {
      previousDetail: ItemDetailResponse | undefined;
      previousPlaced: PlacedItemResponse | undefined;
      previousUnplaced: undefined | UnplacedItemResponse;
    }
  >({
    mutationFn: () => readItem(itemId),
    onError: (error, _variables, context) => {
      console.error('콘텐츠 읽음 처리 실패', error);
      if (!context) return;
      queryClient.setQueryData(myItemKeys.detail(itemId), context.previousDetail);
      queryClient.setQueryData(myItemKeys.placed(), context.previousPlaced);
      queryClient.setQueryData(myItemKeys.unplaced(), context.previousUnplaced);
    },
    onMutate: async () => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: myItemKeys.detail(itemId) }),
        queryClient.cancelQueries({ queryKey: myItemKeys.placed() }),
        queryClient.cancelQueries({ queryKey: myItemKeys.unplaced() }),
      ]);

      const previousDetail = queryClient.getQueryData<ItemDetailResponse>(
        myItemKeys.detail(itemId),
      );
      const previousPlaced = queryClient.getQueryData<PlacedItemResponse>(myItemKeys.placed());
      const previousUnplaced = queryClient.getQueryData<UnplacedItemResponse>(
        myItemKeys.unplaced(),
      );

      queryClient.setQueryData<ItemDetailResponse>(myItemKeys.detail(itemId), (old) =>
        old ? { ...old, isRead: true } : old,
      );
      queryClient.setQueryData<PlacedItemResponse>(myItemKeys.placed(), (old) =>
        old
          ? {
              ...old,
              items: old.items.map((item) => (item.id === itemId ? { ...item, read: true } : item)),
            }
          : old,
      );
      queryClient.setQueryData<UnplacedItemResponse>(myItemKeys.unplaced(), (old) =>
        old
          ? {
              ...old,
              items: old.items.map((item) => (item.id === itemId ? { ...item, read: true } : item)),
            }
          : old,
      );

      return { previousDetail, previousPlaced, previousUnplaced };
    },
    onSuccess: (data) => {
      queryClient.setQueryData<ItemDetailResponse>(myItemKeys.detail(itemId), (old) => {
        if (!old) return data;
        return { ...old, isRead: true };
      });
      console.log('콘텐츠 읽음 처리 성공');
    },
  });
};

export const usePlacedItemList = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    enabled: isAuthenticated,
    queryFn: getPlacedItemList,
    queryKey: myItemKeys.placed(),
  });
};

export const useUnPlacedItemList = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    enabled: isAuthenticated,
    queryFn: getUnPlacedItemList,
    queryKey: myItemKeys.unplaced(),
  });
};
