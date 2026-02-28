import type { NotificationResponse } from '../types';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import {
  connectNotificationStream,
  getAllNotifications,
  updateNotifications,
} from '../api/notificationApi';
import { notificationKeys } from '../api/notificationKeys';

export const useGetAllNotification = (memberId: string, enabled = true) => {
  return useQuery({
    enabled,
    queryFn: () => getAllNotifications(memberId),
    queryKey: notificationKeys.lists(memberId),
  });
};

export const useNotificationStream = (memberId: string, enabled = true) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!enabled) return;

    const eventSource = connectNotificationStream({
      onError: () => {
        console.error('알림 스트림 연결 오류');
      },
      onMessage: (incomingNotification) => {
        queryClient.setQueryData<NotificationResponse[]>(
          notificationKeys.lists(memberId),
          (previousNotifications) => {
            const notifications = previousNotifications ?? [];
            const alreadyExists = notifications.some(
              (notification) => notification.id === incomingNotification.id,
            );

            if (alreadyExists) return notifications;
            return [incomingNotification, ...notifications];
          },
        );
      },
    });

    return () => {
      eventSource.close();
    };
  }, [enabled, memberId, queryClient]);
};

export const useUpdateNotification = (memberId: string) => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, void, { previousNotifications: NotificationResponse[] }>({
    mutationFn: () => updateNotifications(memberId),
    onError: (error, _variables, context) => {
      console.error('알림 업데이트', error);
      queryClient.setQueryData(notificationKeys.lists(memberId), context?.previousNotifications);
    },
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: notificationKeys.lists(memberId),
      });

      const previousNotifications =
        queryClient.getQueryData<NotificationResponse[]>(notificationKeys.lists(memberId)) ?? [];

      queryClient.setQueryData<NotificationResponse[]>(
        notificationKeys.lists(memberId),
        previousNotifications.map((notification) => ({ ...notification, isRead: true })),
      );

      return { previousNotifications };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: notificationKeys.lists(memberId),
      });
      console.log('알림 읽음 처리 완료');
    },
  });
};
