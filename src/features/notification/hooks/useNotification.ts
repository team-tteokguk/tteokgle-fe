import type { NotificationParams } from '../types/notificationParam';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { getAllNotifications, updateNotifications } from '../api/notificationApi';
import { notificationKeys } from '../api/notificationKeys';

export const useGetAllNotification = (memberId: string, params: NotificationParams = {}) => {
  const normalizedParams: NotificationParams = {
    page: 0,
    size: 20,
    ...params,
  };
  return useQuery({
    queryFn: () => getAllNotifications(memberId, normalizedParams),
    queryKey: notificationKeys.lists(memberId, normalizedParams),
  });
};

export const useUpdateNotification = (memberId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => updateNotifications(memberId),
    onError: (error) => {
      console.error('알림 업데이트', error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: notificationKeys.listRoot(memberId),
      });
      console.log('알림 읽음 처리 완료');
    },
  });
};
