import type { ItemCreateRequest } from '../types';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { createItem, getItems } from '../api/storeApi';
import { storeKeys } from '../api/storeKeys';

export const useItems = (storeId: string) => {
  return useQuery({
    queryFn: () => getItems(storeId),
    queryKey: [...storeKeys.all, storeId],
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
        queryKey: [...storeKeys.all, storeId],
      });
    },
  });
};
