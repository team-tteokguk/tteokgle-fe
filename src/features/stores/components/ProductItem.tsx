import trashcanIcon from '../../../shared/assets/icons/trashcan-red.png';
import { getItemEmoji, getItemNameKR } from '../../../shared/utils/itemUtils';
import { useDeleteItem } from '../hooks/useStore';

interface ProductItemProps {
  item: {
    id: string;
    name: string;
    sellCounts: number;
  };
  storeId: string;
}

export const ProductItem = ({ item, storeId }: ProductItemProps) => {
  const { isPending: isDeletePending, mutate: deleteItem } = useDeleteItem(storeId, item.id);

  const handleDelete = () => {
    if (!storeId || isDeletePending) return;
    deleteItem();
  };

  return (
    <li className="border-accent-main/30 bg-grad-store relative flex aspect-square w-full max-w-30 flex-col items-center justify-center gap-1 rounded-2xl border-2">
      <button
        aria-label="판매 고명 삭제"
        className="border-warning absolute top-1 right-1 rounded-full border p-1 disabled:opacity-50"
        disabled={!storeId || isDeletePending}
        onClick={handleDelete}
        type="button"
      >
        <img alt="delete-item-icon" className="w-3.5" src={trashcanIcon} />
      </button>
      <p className="text-4xl leading-10 tracking-[0.369px]">{getItemEmoji(item.name)}</p>
      <span className="text-brand-dark text-xs leading-3.75 font-bold">
        {getItemNameKR(item.name)}
      </span>
      <span className="text-font-gray text-[10px] leading-3.75 tracking-[0.117px]">
        재고: {item.sellCounts} 개
      </span>
    </li>
  );
};
