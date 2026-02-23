import type { StoreListItem } from '../features/stores/types';

import { useEffect, useMemo, useRef, useState } from 'react';

import {
  useGetFavoriteStores,
  useSearchStores,
  useToggleSubscribe,
} from '../features/stores/hooks/useStore';
import readingGlassIcon from '../shared/assets/icons/reading-glass.png';
import activeStar from '../shared/assets/icons/star-active.png';
import disabledStarIcon from '../shared/assets/icons/star-disabled.png';
import whiteStarIcon from '../shared/assets/icons/star-white.png';
import { TitleCard } from '../shared/components/TitleCard';

interface StoreCardProps {
  isFavorite: boolean;
  onFavoriteChanged: (nextFavorite: boolean, storeId: string) => void;
  store: StoreListItem;
}

const StoreCard = ({ isFavorite, onFavoriteChanged, store }: StoreCardProps) => {
  const { isPending: isTogglePending, mutate } = useToggleSubscribe(store.storeId);

  const handleToggleFavorite = () => {
    if (isTogglePending) return;

    const previousFavorite = isFavorite;
    const nextFavorite = !previousFavorite;
    onFavoriteChanged(nextFavorite, store.storeId);

    mutate(previousFavorite, {
      onError: () => {
        onFavoriteChanged(previousFavorite, store.storeId);
      },
    });
  };

  return (
    <li className="border-accent-main bg-grad-item flex items-center rounded-2xl border-2 px-4 py-4">
      {store.profileImage ? (
        <img
          alt={`${store.nickname} profile`}
          className="mr-3 h-12 w-12 rounded-full object-cover"
          src={store.profileImage}
        />
      ) : (
        <div className="bg-grad-accent mr-3 flex h-12 w-12 items-center justify-center rounded-full">
          ☁️
        </div>
      )}
      <div className="flex flex-col">
        <p className="text-font-main text-base leading-6 font-bold tracking-[-0.312px]">
          {store.nickname}
        </p>
        <span className="text-font-gray text-xs leading-4">{store.storeName}</span>
      </div>
      <p className="bg-accent-main/20 text-font-main mr-4 ml-auto rounded-full px-2 py-1 text-xs leading-4 font-bold">
        {store.sellingItemTypeCount}개 판매중
      </p>
      <button
        aria-label="subscribe-button"
        disabled={isTogglePending}
        onClick={handleToggleFavorite}
        type="button"
      >
        <img alt="star-icon" className="w-5" src={isFavorite ? activeStar : disabledStarIcon} />
      </button>
    </li>
  );
};

export const FindFriends = () => {
  const [activeTab, setActiveTab] = useState<'favorites' | 'search'>('search');
  const [hiddenStoreIds, setHiddenStoreIds] = useState<string[]>([]);
  const [optimisticFavorites, setOptimisticFavorites] = useState<Record<string, boolean>>({});
  const [searchInput, setSearchInput] = useState('');
  const [keyword, setKeyword] = useState('');
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const {
    data: searchData,
    error: searchError,
    fetchNextPage: fetchSearchNextPage,
    hasNextPage: hasSearchNextPage,
    isFetching: isSearchFetching,
    isFetchingNextPage: isSearchFetchingNextPage,
    isPending: isSearchPending,
  } = useSearchStores(keyword);

  const {
    data: favoriteData,
    error: favoriteError,
    fetchNextPage: fetchFavoriteNextPage,
    hasNextPage: hasFavoriteNextPage,
    isFetching: isFavoriteFetching,
    isFetchingNextPage: isFavoriteFetchingNextPage,
    isPending: isFavoritePending,
  } = useGetFavoriteStores();

  const searchStores = useMemo(
    () => searchData?.pages.flatMap((page) => page.content) ?? [],
    [searchData?.pages],
  );
  const favoriteStores = useMemo(
    () => favoriteData?.pages.flatMap((page) => page.content) ?? [],
    [favoriteData?.pages],
  );

  const isFavoriteTab = activeTab === 'favorites';
  const hasSearchKeyword = keyword.trim().length > 0;
  const storeList = isFavoriteTab ? favoriteStores : searchStores;
  const hasNextPage = isFavoriteTab ? hasFavoriteNextPage : hasSearchNextPage;
  const isFetchingNextPage = isFavoriteTab ? isFavoriteFetchingNextPage : isSearchFetchingNextPage;
  const fetchNextPage = isFavoriteTab ? fetchFavoriteNextPage : fetchSearchNextPage;
  const hasError = isFavoriteTab ? !!favoriteError : hasSearchKeyword && !!searchError;
  const isPending = isFavoriteTab ? isFavoritePending : hasSearchKeyword && isSearchPending;
  const isFetching = isFavoriteTab ? isFavoriteFetching : hasSearchKeyword && isSearchFetching;
  const visibleStoreList = useMemo(
    () => storeList.filter((store) => !hiddenStoreIds.includes(store.storeId)),
    [hiddenStoreIds, storeList],
  );

  useEffect(() => {
    const target = loadMoreRef.current;
    if (!target) return;

    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;
      if (!entry?.isIntersecting || !hasNextPage || isFetchingNextPage) return;
      void fetchNextPage();
    });

    observer.observe(target);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, visibleStoreList.length]);

  const handleSearch = () => {
    setKeyword(searchInput.trim());
  };

  const handleFavoriteChanged = (nextFavorite: boolean, storeId: string) => {
    setOptimisticFavorites((prev) => ({ ...prev, [storeId]: nextFavorite }));

    if (isFavoriteTab && !nextFavorite) {
      setHiddenStoreIds((prev) => (prev.includes(storeId) ? prev : [...prev, storeId]));
      return;
    }
    setHiddenStoreIds((prev) => prev.filter((id) => id !== storeId));
  };

  const renderEmptyState = () => {
    if (!isFavoriteTab && !keyword.trim()) {
      return (
        <p className="text-font-gray text-center text-sm">닉네임 또는 상점명으로 검색해보세요.</p>
      );
    }

    const emptyLabel = isFavoriteTab ? '즐겨찾기한 상점이 없습니다.' : '검색 결과가 없습니다.';
    return <p className="text-font-gray text-center text-sm">{emptyLabel}</p>;
  };

  return (
    <div>
      <TitleCard sub="친구의 상점을 방문해보세요" title="친구 찾기">
        <div className="mt-4 flex gap-2">
          <button
            className={`find-buddy-button-base ${!isFavoriteTab ? 'text-font-main bg-white' : 'bg-white/20 text-white'}`}
            onClick={() => {
              setActiveTab('search');
              setHiddenStoreIds([]);
            }}
            type="button"
          >
            검색
          </button>
          <button
            className={`find-buddy-button-base ${isFavoriteTab ? 'text-font-main bg-white' : 'bg-white/20 text-white'}`}
            onClick={() => {
              setActiveTab('favorites');
              setHiddenStoreIds([]);
            }}
            type="button"
          >
            <img
              alt="subscribe-list-button"
              className="mr-1.75 w-4.5"
              src={isFavoriteTab ? activeStar : whiteStarIcon}
            />
            즐겨찾기
          </button>
        </div>
      </TitleCard>
      <div className="mt-4 flex flex-col gap-4 rounded-4xl border border-white/50 bg-white/90 p-6.25 shadow-xl">
        <div className="border-disabled flex w-full items-center rounded-2xl border-2 pl-[13.5px]">
          <img alt="reading-glass-icon" className="h-5 w-5" src={readingGlassIcon} />
          <input
            className="w-full px-4 py-3"
            onChange={(event) => setSearchInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                handleSearch();
              }
            }}
            placeholder="친구 이름 또는 상점명으로 검색..."
            type="text"
            value={searchInput}
          />
        </div>
        <p className="text-font-main text-[18px] leading-7 font-black tracking-[-0.439px]">
          {isFavoriteTab ? '즐겨찾기 목록' : '친구 목록'}
        </p>
        {hasError && <p className="text-warning text-sm">목록을 불러오지 못했습니다.</p>}
        {!hasError &&
          visibleStoreList.length === 0 &&
          !isPending &&
          !isFetching &&
          renderEmptyState()}
        <ul className="flex flex-col gap-2">
          {visibleStoreList.map((store) => (
            <StoreCard
              isFavorite={optimisticFavorites[store.storeId] ?? store.favorite}
              key={store.storeId}
              onFavoriteChanged={handleFavoriteChanged}
              store={store}
            />
          ))}
        </ul>
        <div className="h-4 w-full text-center" ref={loadMoreRef} />
        {(isPending || isFetchingNextPage) && (
          <p className="text-font-gray text-sm">불러오는 중...</p>
        )}
      </div>
    </div>
  );
};
