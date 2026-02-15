export const notificationKeys = {
  all: ['notifiations'] as const,

  lists: (memberId: string) => [...notificationKeys.all, 'detail', memberId],
};
