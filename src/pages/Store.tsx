import { useParams } from 'react-router';

import { ConfirmModal } from '../features/members/components/ConfirmModal';
import { GuestBookModal } from '../features/stores/components/GuestBookModal';
import { useGetItems, usePurchaseItem } from '../features/stores/hooks/useStore';
import { AsyncStateNotice } from '../shared/components/AsyncStateNotice';
import { LoadingSpinner } from '../shared/components/LoadingSpinner';
import { TitleCard } from '../shared/components/TitleCard';
import { getItemEmoji, getItemNameKR } from '../shared/utils/itemUtils';
import { useModalStore } from '../store/useModalStore';

export const Store = () => {
  const { storeId } = useParams<{ storeId: string }>();
  const safeStoreId = storeId ?? '';

  const {
    data: store,
    isError: isStoreError,
    isPending: isStorePending,
  } = useGetItems(safeStoreId);
  const { isPending: isPurchasePending, mutateAsync: purchaseItem } = usePurchaseItem(safeStoreId);

  const { openModal } = useModalStore();

  const handleViewGuestBookClick = () => {
    openModal(<GuestBookModal storeId={safeStoreId} />);
  };

  const handlePurchaseClick = (itemId: string, itemName: string, itemCost: number) => {
    openModal(
      <ConfirmModal
        confirmText="구매하기"
        description={`${itemName}을(를) 구매하시겠습니까?\n${itemCost}냥이 사용됩니다.`}
        onConfirm={async () => {
          await purchaseItem(itemId);
        }}
        title="고명 구매"
        type="cart"
      />,
    );
  };

  if (!storeId) {
    return <p className="text-warning text-sm">잘못된 상점 경로입니다.</p>;
  }

  return (
    <div className="w-full">
      <TitleCard sub="친구 상점을 둘러보세요" title={store?.storeName ?? '상점'} />
      <div className="mt-4 mb-4.25 min-h-133 rounded-4xl border border-white/50 bg-white/90 p-6.25 shadow-xl">
        {isStorePending && (
          <LoadingSpinner className="min-h-139" label="상점 정보를 불러오는 중..." />
        )}
        {isStoreError && (
          <AsyncStateNotice message="상점 정보를 불러오지 못했습니다." type="error" />
        )}
        {!isStorePending && !isStoreError && (
          <>
            <p className="text-font-main text-base font-bold">
              판매 중인 고명 {store?.items?.length ?? 0}개
            </p>
            {store.items.length === 0 && (
              <div className="text-font-gray flex h-full w-full items-center justify-center text-sm">
                판매 중인 아이템이 없습니다.
              </div>
            )}
            {store.items.length > 0 && (
              <ul className="mt-4 grid grid-cols-3 gap-3">
                {store.items?.map((item) => {
                  const isSoldOut = item.sellCounts === 0;
                  const isLowStock = item.sellCounts > 0 && item.sellCounts <= 2;

                  return (
                    <li
                      aria-disabled={isSoldOut}
                      className={`border-accent-main/20 relative flex aspect-square w-30 flex-col items-center gap-0.75 rounded-2xl border-2 pt-2 pb-2.25 ${isSoldOut ? 'bg-disabled/20 opacity-70' : 'bg-grad-item cursor-pointer'}`}
                      key={item.id}
                      onClick={() => {
                        if (isSoldOut) return;
                        handlePurchaseClick(item.id, getItemNameKR(item.name), item.cost);
                      }}
                    >
                      <p className="text-4xl leading-10 tracking-[0.369px]">
                        {getItemEmoji(item.name)}
                      </p>
                      <p className="text-font-main text-xs leading-3.75 font-bold">
                        {getItemNameKR(item.name)}
                      </p>
                      <span className="text-font-gray text-[10px] leading-3.75 tracking-[0.117px]">
                        재고: {item.sellCounts}
                      </span>
                      <p className="bg-grad-accent rounded-full px-3 py-1 text-xs leading-4 font-black text-white shadow-lg">
                        {item.cost}냥
                      </p>
                      {isLowStock && (
                        <p className="bg-warning absolute -top-2 -right-2 rounded-full px-3 py-1 text-xs font-bold text-white">
                          품절 임박
                        </p>
                      )}
                      {isSoldOut && (
                        <p className="bg-font-gray absolute -top-2 -right-2 rounded-full px-3 py-1 text-xs font-bold text-white">
                          품절
                        </p>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </>
        )}
        {isPurchasePending && (
          <div className="mt-3">
            <AsyncStateNotice message="구매를 처리하는 중..." type="loading" />
          </div>
        )}
      </div>
      <div className="rounded-4xl bg-white/90 p-6.25 shadow-2xl">
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
