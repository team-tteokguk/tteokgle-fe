export interface ItemInfo {
  emoji: string;
  id: string;
  nameKR: string;
}

const ITEM_DATA: Record<string, Omit<ItemInfo, 'id'>> = {
  beef: { emoji: '🥩', nameKR: '소고기' },
  carrot: { emoji: '🥕', nameKR: '당근' },
  chilipepper: { emoji: '🌶️', nameKR: '고추' },
  egg: { emoji: '🥚', nameKR: '계란' },
  garlic: { emoji: '🧄', nameKR: '마늘' },
  gim: { emoji: '🌊', nameKR: '김' },
  mushroom: { emoji: '🍄', nameKR: '버섯' },
  onion: { emoji: '🧅', nameKR: '양파' },
  scallion: { emoji: '🌿', nameKR: '파' },
};

export const getGomyeongInfo = (name: string): ItemInfo => {
  const safeName = name.toLowerCase().trim();

  if (ITEM_DATA[safeName]) {
    return { ...ITEM_DATA[safeName], id: safeName };
  }

  const foundKey = Object.keys(ITEM_DATA).find((key) => ITEM_DATA[key].nameKR === safeName);

  if (foundKey) {
    return { ...ITEM_DATA[foundKey], id: foundKey };
  }

  return {
    emoji: '❓',
    id: 'unknown',
    nameKR: name,
  };
};

export const getItemEmoji = (name: string) => getGomyeongInfo(name).emoji;

export const getItemNameKR = (name: string) => getGomyeongInfo(name).nameKR;

export const getAllGomyeongInfos = (): ItemInfo[] => {
  return Object.entries(ITEM_DATA).map(([id, value]) => ({
    ...value,
    id,
  }));
};
