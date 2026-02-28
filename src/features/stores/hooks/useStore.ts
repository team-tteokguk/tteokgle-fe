import type { ItemCreateRequest, MyStoreItemsRequest, StoreListSliceResponse } from '../types';
import type { InfiniteData, QueryKey } from '@tanstack/react-query';

import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  createItem,
  deleteItem,
  getItems,
  getMyFavoriteStores,
  getMyStore,
  getMyStoreItems,
  getStore,
  searchStores,
  subscribe,
  unsubscribe,
  updateMyStore,
} from '../api/storeApi';
import { storeKeys } from '../api/storeKeys';

const DEFAULT_STORE_LIST_SIZE = 4;
const DEFAULT_STORE_LIST_SORT = 'createdAt,desc';

export const useGetStore = (storeId: string) => {
  return useQuery({
    queryFn: () => getStore(storeId),
    queryKey: storeKeys.detail(storeId),
  });
};

export const useGetItems = (storeId: string) => {
  return useQuery({
    queryFn: () => getItems(storeId),
    queryKey: storeKeys.items(storeId),
  });
};

export const useGetMyStore = () => {
  return useQuery({
    queryFn: getMyStore,
    queryKey: storeKeys.me(),
  });
};

export const useUpdateMyStore = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMyStore,
    onError: (error) => {
      console.error('상점 이름 변경 실패', error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: storeKeys.me(),
      });
    },
  });
};

export const useGetMyStoreItems = (params: MyStoreItemsRequest) => {
  return useQuery({
    queryFn: () => getMyStoreItems(params),
    queryKey: storeKeys.meItems(params),
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
        queryKey: storeKeys.items(storeId),
      });
      queryClient.invalidateQueries({
        queryKey: storeKeys.me(),
      });
      queryClient.invalidateQueries({
        queryKey: [...storeKeys.me(), 'items'],
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
        queryKey: storeKeys.items(storeId),
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
      queryClient.invalidateQueries({ queryKey: storeKeys.favoriteLists() });
      queryClient.invalidateQueries({ queryKey: storeKeys.searchLists() });
    },
  });
};

export const useSearchStores = (keyword: string, size = DEFAULT_STORE_LIST_SIZE) => {
  const trimmedKeyword = keyword.trim();

  return useInfiniteQuery<
    StoreListSliceResponse,
    Error,
    InfiniteData<StoreListSliceResponse, number>,
    ReturnType<typeof storeKeys.searchList>,
    number
  >({
    enabled: trimmedKeyword.length > 0,
    getNextPageParam: (lastPage) => (lastPage.last ? undefined : lastPage.number + 1),
    initialPageParam: 0,
    queryFn: ({ pageParam }) =>
      searchStores({
        keyword: trimmedKeyword,
        page: pageParam,
        size,
        sort: DEFAULT_STORE_LIST_SORT,
      }),
    queryKey: storeKeys.searchList({
      keyword: trimmedKeyword,
      size,
      sort: DEFAULT_STORE_LIST_SORT,
    }),
  });
};

export const useGetFavoriteStores = (size = DEFAULT_STORE_LIST_SIZE) => {
  return useInfiniteQuery<
    StoreListSliceResponse,
    Error,
    InfiniteData<StoreListSliceResponse, number>,
    ReturnType<typeof storeKeys.favoriteList>,
    number
  >({
    getNextPageParam: (lastPage) => (lastPage.last ? undefined : lastPage.number + 1),
    initialPageParam: 0,
    queryFn: ({ pageParam }) =>
      getMyFavoriteStores({
        page: pageParam,
        size,
        sort: DEFAULT_STORE_LIST_SORT,
      }),
    queryKey: storeKeys.favoriteList({
      size,
      sort: DEFAULT_STORE_LIST_SORT,
    }),
  });
};

const mapStoreFavorite = (
  page: StoreListSliceResponse,
  storeId: string,
  nextFavorite: boolean,
  removeOnUnfavorite: boolean,
): StoreListSliceResponse => {
  const mappedContent = page.content
    .map((store) => (store.storeId === storeId ? { ...store, favorite: nextFavorite } : store))
    .filter((store) => !(removeOnUnfavorite && !nextFavorite && store.storeId === storeId));

  return {
    ...page,
    content: mappedContent,
    empty: mappedContent.length === 0,
  };
};

const updateFavoriteQueries = (
  data: InfiniteData<StoreListSliceResponse, number> | undefined,
  storeId: string,
  nextFavorite: boolean,
  removeOnUnfavorite: boolean,
) => {
  if (!data) return data;

  return {
    ...data,
    pages: data.pages.map((page) =>
      mapStoreFavorite(page, storeId, nextFavorite, removeOnUnfavorite),
    ),
  };
};

interface ToggleFavoriteMutationContext {
  previousFavoriteQueries: Array<
    [QueryKey, InfiniteData<StoreListSliceResponse, number> | undefined]
  >;
  previousSearchQueries: Array<
    [QueryKey, InfiniteData<StoreListSliceResponse, number> | undefined]
  >;
}

interface ToggleFavoriteMutationVariables {
  isFavorite: boolean;
  storeId: string;
}

export const useToggleStoreFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, ToggleFavoriteMutationVariables, ToggleFavoriteMutationContext>({
    mutationFn: ({ isFavorite, storeId }) =>
      isFavorite ? unsubscribe(storeId) : subscribe(storeId),
    onError: (error, _variables, context) => {
      console.error('즐겨찾기 상태 변경 실패', error);

      context?.previousSearchQueries.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
      context?.previousFavoriteQueries.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
    },
    onMutate: async ({ isFavorite, storeId }) => {
      const nextFavorite = !isFavorite;

      await Promise.all([
        queryClient.cancelQueries({ queryKey: storeKeys.searchLists() }),
        queryClient.cancelQueries({ queryKey: storeKeys.favoriteLists() }),
      ]);

      const previousSearchQueries = queryClient.getQueriesData<
        InfiniteData<StoreListSliceResponse, number> | undefined
      >({
        queryKey: storeKeys.searchLists(),
      });
      const previousFavoriteQueries = queryClient.getQueriesData<
        InfiniteData<StoreListSliceResponse, number> | undefined
      >({
        queryKey: storeKeys.favoriteLists(),
      });

      queryClient.setQueriesData<InfiniteData<StoreListSliceResponse, number> | undefined>(
        { queryKey: storeKeys.searchLists() },
        (oldData) => updateFavoriteQueries(oldData, storeId, nextFavorite, false),
      );

      queryClient.setQueriesData<InfiniteData<StoreListSliceResponse, number> | undefined>(
        { queryKey: storeKeys.favoriteLists() },
        (oldData) => updateFavoriteQueries(oldData, storeId, nextFavorite, true),
      );

      const subscribeQueryKey = storeKeys.subscribe(storeId);
      queryClient.setQueryData<boolean>(subscribeQueryKey, nextFavorite);

      return { previousFavoriteQueries, previousSearchQueries };
    },
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({
        queryKey: storeKeys.searchLists(),
      });
      queryClient.invalidateQueries({
        queryKey: storeKeys.favoriteLists(),
      });
      queryClient.invalidateQueries({
        queryKey: storeKeys.subscribe(variables.storeId),
      });
    },
  });
};
