import type { PlacedItemResponse } from '../types';

const GOMYEONG_MAP: Record<string, string> = {
  beef: '🥩',
  carrot: '🥕',
  chilipepper: '🌶️',
  egg: '🥚',
  garlic: '🧄',
  gim: '🌊',
  mushroom: '🍄',
  onion: '🧅',
  scallion: '🌿',
};

interface PlacedItemProps {
  item: PlacedItemResponse;
}

export const PlacedItem = ({ item }: PlacedItemProps) => {
  const safeName = item.name.toLowerCase().trim();
  const emoji = GOMYEONG_MAP[safeName] || '❓';

  return (
    <div
      className="absolute flex animate-bounce items-center justify-center text-4xl"
      style={{
        left: `${item.posX}%`,
        top: `${item.posY}%`,
        transform: 'translate(-50%, -50%)',
        zIndex: item.posZ,
      }}
    >
      {item.read && (
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
        {emoji}
      </span>
    </div>
  );
};
