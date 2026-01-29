export const notificationKeys = {
  all: ['notifiations'] as const,

  list: (memberId: string, filters: string) =>
    [...notificationKeys.lists(memberId), { filters }] as const,

  lists: (memberId: string) => [...notificationKeys.all, 'detail', memberId],
};
