import type { ItemPlacementRequest } from '../types';

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
    mutationFn: ({ body, itemId }: { body: ItemPlacementRequest; itemId: string }) =>
      updateItemPlacement(itemId, body),
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

  return useMutation({
    mutationFn: () => readItem(itemId),
    onError: (error) => {
      console.error('콘텐츠 읽음 처리 실패', error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: myItemKeys.detail(itemId),
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
