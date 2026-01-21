export const myItemKeys = {
  all: ['items'] as const,

  detail: (itemId: string) => [...myItemKeys.all, 'detail', itemId],

  placed: () => [...myItemKeys.all, 'placed'] as const,

  unplaced: () => [...myItemKeys.all, 'unplaced'] as const,
};
