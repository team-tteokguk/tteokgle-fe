import type { PlacedItemList } from '../types';

import { getItemEmoji } from '../../../shared/utils/itemUtils';

interface PlacedItemProps {
  item: PlacedItemList;
  onClick: (itemId: string) => void;
}

export const PlacedItem = ({ item, onClick }: PlacedItemProps) => {
  return (
    <button
      className="absolute flex animate-bounce items-center justify-center text-4xl"
      onClick={() => onClick(item.id)}
      style={{
        left: `${item.posX}px`,
        top: `${item.posY}px`,
        transform: 'translate(-50%, -50%)',
        zIndex: item.posZ,
      }}
      type="button"
    >
      {!item.read && (
        <div
          aria-label="unread-mark"
          className="bg-warning absolute -top-1 -right-1 h-3 w-3 rounded-full border-2 border-white shadow-[0_4px_12px_0_rgba(0,0,0,0.3)]"
        ></div>
      )}
      <span
        aria-label={item.name}
        className="text-[36px] leading-10 font-normal tracking-[0.369px] drop-shadow-[0_4px_12px_rgba(0,0,0,0.3)]"
        role="img"
      >
        {getItemEmoji(item.name)}
      </span>
    </button>
  );
};
