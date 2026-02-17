import { CreateNewItemModal } from '../features/stores/components/CreateNewItemModal';
import { GuestBookModal } from '../features/stores/components/GuestBookModal';
import { ProductItem } from '../features/stores/components/ProductItem';
import { useGetMyStore, useGetMyStoreItems } from '../features/stores/hooks/useStore';
import plusIcon from '../shared/assets/icons/plus.png';
import { TitleCard } from '../shared/components/TitleCard';
import { useModalStore } from '../store/useModalStore';

export const MyStore = () => {
  const { data: myStore, error: myStoreError, isPending: isMyStorePending } = useGetMyStore();
  const { openModal } = useModalStore();

  const handleCreateClick = () => {
    openModal(<CreateNewItemModal />);
  };

  const handleViewGuestBookClick = () => {
    openModal(<GuestBookModal />);
  };

  const {
    data: myStoreItems,
    error: myStoreItemsError,
    isPending: isMyStoreItemsPending,
  } = useGetMyStoreItems({
    page: 0,
    size: 9,
    sort: ['createdAt,desc'],
  });

  const isPending = isMyStorePending || isMyStoreItemsPending;
  const hasError = !!myStoreError || !!myStoreItemsError;
  const hasItems = (myStoreItems?.items.length ?? 0) > 0;

  return (
    <div className="w-full">
      <TitleCard sub="고명을 추가해보세요" title={myStore?.name ? myStore.name : '내 상점'} />
      <div className="mt-4 mb-4 rounded-4xl border border-white/50 bg-white/90 p-6.25 shadow-xl">
        <h2 className="text-font-main mb-4 text-lg leading-7 font-bold">
          판매 중인 고명 {myStoreItems?.sellingItemCount ?? 0}개
        </h2>
        {isPending && <p className="text-font-gray mt-4 text-sm">불러오는 중...</p>}
        {hasError && <p className="text-warning mt-4 text-sm">상점 정보를 불러오지 못했습니다.</p>}
        {hasItems && (
          <ul className="mt-4 grid grid-cols-3 gap-3">
            {myStoreItems?.items.map((item) => (
              <ProductItem item={item} key={item.id} />
            ))}
          </ul>
        )}
        {!isPending && !hasError && !hasItems && (
          <div className="flex w-full flex-col items-center justify-center gap-3 py-12">
            <p className="text-5xl leading-12 tracking-[0.352px]">🍜</p>
            <span className="text-font-gray text-base leading-7 tracking-[-0.312px]">
              아직 고명이 없습니다
            </span>
            <span className="text-font-gray-light text-sm leading-5 tracking-[-0.15px]">
              아래에서 새 고명을 추가해보세요
            </span>
          </div>
        )}
      </div>
      <div className="flex w-full flex-col items-center gap-3 rounded-4xl border border-white/50 bg-white/90 p-6.25 shadow-xl">
        <button
          className="mypage-button-base bg-grad-brand text-white"
          onClick={handleCreateClick}
          type="button"
        >
          <img alt="plus" className="w-5" src={plusIcon} />
          새로운 고명 추가하기
        </button>
        <button
          className="mypage-button-base bg-grad-button text-brand-dark"
          onClick={handleViewGuestBookClick}
          type="button"
        >
          📖 방명록 보기
        </button>
      </div>
    </div>
  );
};
