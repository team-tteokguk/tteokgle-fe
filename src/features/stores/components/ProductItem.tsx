import { getItemEmoji, getItemNameKR } from '../../../shared/utils/itemUtils';

interface ProductItemProps {
  item: {
    name: string;
    sellCounts: number;
  };
}

export const ProductItem = ({ item }: ProductItemProps) => {
  return (
    <li className="border-accent-main/30 bg-grad-store flex aspect-square w-full max-w-30 cursor-pointer flex-col items-center justify-center gap-1 rounded-2xl border-2">
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
