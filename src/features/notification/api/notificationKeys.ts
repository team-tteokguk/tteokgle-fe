export const notificationKeys = {
  all: ['notifications'] as const,
  lists: (memberId: string) => [...notificationKeys.all, 'list', memberId] as const,
};
