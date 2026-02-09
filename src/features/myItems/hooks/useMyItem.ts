import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  getItemDetail,
  getPlacedItemList,
  getUnPlacedItemList,
  readItem,
  updateItemPlacement,
} from '../api/myItemApi';
import { myItemKeys } from '../api/myItemKeys';

export const useItemDetail = (itemId: string) => {
  return useQuery({
    enabled: !!itemId,
    queryFn: () => getItemDetail(itemId),
    queryKey: myItemKeys.detail(itemId),
  });
};

export const useUpdateItemPlacement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId: string) => updateItemPlacement(itemId),
    onError: (error) => {
      console.error('아이템 배치 실패', error);
    },
    onSuccess: (_, itemId) => {
      queryClient.invalidateQueries({
        queryKey: myItemKeys.detail(itemId),
      });
      console.log('아이템 배치 완료');
    },
  });
};

export const useReadItem = (itemId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: readItem,
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
  return useQuery({
    queryFn: getPlacedItemList,
    queryKey: myItemKeys.placed(),
  });
};

export const useUnPlacedItemList = () => {
  return useQuery({
    queryFn: getUnPlacedItemList,
    queryKey: myItemKeys.unplaced(),
  });
};
