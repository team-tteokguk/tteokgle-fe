import type { MyItemParams } from '../types/myItemParams';

export const myItemKeys = {
  all: ['items'] as const,

  detail: (itemId: string) => [...myItemKeys.all, 'detail', itemId],

  placed: () => [...myItemKeys.all, 'placed'] as const,

  unplaced: (params: MyItemParams) => [...myItemKeys.all, 'unplaced', params] as const,

  unplacedRoot: () => [...myItemKeys.all, 'unplaced'] as const,
};
