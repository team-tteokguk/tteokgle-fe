import type { NotificationParams } from '../types/notificationParam';

export const notificationKeys = {
  all: ['notifications'] as const,

  listRoot: (memberId: string) => [...notificationKeys.all, 'detail', memberId],

  lists: (memberId: string, params: NotificationParams) => [
    ...notificationKeys.all,
    'detail',
    memberId,
    params,
  ],
};
