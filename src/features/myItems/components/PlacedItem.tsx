import type { PlacedItemList } from '../types';

import { getItemEmoji } from '../../../shared/utils/itemUtils';

interface PlacedItemProps {
  item: PlacedItemList;
  onClick: (itemId: string) => void;
}

const POSITION_SOURCE_SIZE = 360;
const POSITION_TARGET_SIZE = 278;
const CIRCLE_CENTER = POSITION_TARGET_SIZE / 2;
const ITEM_SAFE_RADIUS = 22;

export const PlacedItem = ({ item, onClick }: PlacedItemProps) => {
  const scaledX = (item.posX / POSITION_SOURCE_SIZE) * POSITION_TARGET_SIZE;
  const scaledY = (item.posY / POSITION_SOURCE_SIZE) * POSITION_TARGET_SIZE;
  const deltaX = scaledX - CIRCLE_CENTER;
  const deltaY = scaledY - CIRCLE_CENTER;
  const distance = Math.hypot(deltaX, deltaY);
  const maxDistance = CIRCLE_CENTER - ITEM_SAFE_RADIUS;
  const ratio = distance > maxDistance && distance > 0 ? maxDistance / distance : 1;
  const normalizedLeft = CIRCLE_CENTER + deltaX * ratio;
  const normalizedTop = CIRCLE_CENTER + deltaY * ratio;

  return (
    <button
      className="absolute flex items-center justify-center text-4xl"
      onClick={() => onClick(item.id)}
      style={{
        left: `${normalizedLeft}px`,
        top: `${normalizedTop}px`,
        transform: 'translate(-50%, -50%)',
        zIndex: item.posZ,
      }}
      type="button"
    >
      <div className="relative animate-bounce">
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
      </div>
    </button>
  );
};
