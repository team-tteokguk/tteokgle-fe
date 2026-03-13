import type { NotificationParams } from '../types/notificationParam';

export const notificationKeys = {
  all: ['notifications'] as const,

  listRoot: (memberId: string) => [...notificationKeys.all, 'detail', memberId],

  _lists: (memberId: string, params: NotificationParams) => [
    ...notificationKeys.all,
    'detail',
    memberId,
    params,
  ],
    
  lists: (memberId: string) => [...notificationKeys.all, 'list', memberId] as const,
};
