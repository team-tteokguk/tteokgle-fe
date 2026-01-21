export const storeKeys = {
  all: ['items'] as const,

  detail: (itemId: string) => [...storeKeys.all, 'detail', itemId],
};
