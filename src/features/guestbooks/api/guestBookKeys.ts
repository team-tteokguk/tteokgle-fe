import type { GuestBookParams } from '../types/guestBookParams';

export const guestBookKeys = {
  all: ['guestbooks'] as const,

  infiniteList: (storeId: string, size: number) =>
    [...guestBookKeys.infiniteRoot(storeId), size] as const,

  infiniteRoot: (storeId: string) => [...guestBookKeys.all, 'infinite', storeId] as const,

  list: (storeId: string, params: GuestBookParams) =>
    [...guestBookKeys.lists(), storeId, params] as const,

  listRoot: (storeId: string) => [...guestBookKeys.lists(), storeId] as const,

  lists: () => [...guestBookKeys.all, 'list'] as const,
};
