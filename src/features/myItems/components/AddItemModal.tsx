import closeIcon from '../../../shared/assets/icons/x.png';
import { AsyncStateNotice } from '../../../shared/components/AsyncStateNotice';
import { getItemEmoji, getItemNameKR } from '../../../shared/utils/itemUtils';
import { useModalStore } from '../../../store/useModalStore';
import { useUpdateItemPlacement } from '../hooks/useMyItem';
import { useUnPlacedItemList } from '../hooks/useMyItem';

export const AddItemModal = () => {
  const { data, error, isPending } = useUnPlacedItemList();
  const { isPending: isPlacementPending, mutate: placementItem } = useUpdateItemPlacement();
  const { closeModal } = useModalStore();

  const handleItemClick = (id: string) => {
    if (isPlacementPending) return;

    placementItem({ itemId: id });
  };

  return (
    <div className="bottom-sheet max-h-132.25 min-h-69.25">
      <div className="border-disabled flex justify-between border-b px-6 py-6.25">
        <h2 className="text-font-main text-xl leading-7 font-bold tracking-[-0.449px]">
          보유한 고명 ({data?.page.numberOfElements})
        </h2>
        <button aria-label="close-button" onClick={closeModal} type="button">
          <img alt="close-icon" className="w-5" src={closeIcon} />
        </button>
      </div>
      <ul className="flex flex-wrap gap-3 p-6">
        {data &&
          data.items.map((item) => (
            <li key={item.id}>
              <button
                className="bg-grad-accent disabled:bg-grad-disabled relative flex h-31.25 w-31.25 flex-col items-center justify-center gap-2 rounded-2xl shadow-lg disabled:opacity-70"
                disabled={item.used}
                onClick={() => handleItemClick(item.id)}
                type="button"
              >
                {!item.read && (
                  <div
                    aria-label="unread-mark"
                    className="bg-warning absolute -top-1 -right-1 h-3 w-3 rounded-full border-2 border-white"
                  ></div>
                )}
                <p className="text-4xl leading-10 tracking-[0.369px]">{getItemEmoji(item.name)}</p>
                <span className="rounded-full bg-black/20 px-2 py-1 text-[12px] leading-4 font-bold text-white">
                  {getItemNameKR(item.name)}
                </span>
              </button>
            </li>
          ))}
        {data && data.items.length === 0 && !isPending && (
          <div className="flex h-49 w-full flex-col items-center justify-center gap-2">
            <p className="text-font-gray text-base leading-6 tracking-[-0.312px]">
              보유 중인 고명이 없습니다.
            </p>
            <span className="text-font-gray-light text-sm leading-5 tracking-[-0.15px]">
              상점에서 버튼을 눌러 고명을 추가해보세요!
            </span>
          </div>
        )}
        {error && (
          <div className="w-full">
            <AsyncStateNotice message="고명 목록을 불러오지 못했습니다." type="error" />
          </div>
        )}
        {isPending && (
          <div className="w-full">
            <AsyncStateNotice message="고명 목록을 불러오는 중..." type="loading" />
          </div>
        )}
      </ul>
    </div>
  );
};
