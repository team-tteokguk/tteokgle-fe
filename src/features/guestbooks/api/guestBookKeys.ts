import type { GuestBookParams } from '../types/guestBookParams';

export const guestBookKeys = {
  all: ['guestbooks'] as const,

  // 특정 상점의 댓글 목록
  list: (storeId: string, params: GuestBookParams) =>
    [...guestBookKeys.lists(), storeId, params] as const,

  listRoot: (storeId: string) => [...guestBookKeys.lists(), storeId] as const,

  // 모든 댓글들
  lists: () => [...guestBookKeys.all, 'list'] as const,
};
