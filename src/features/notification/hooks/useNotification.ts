import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { getAllNotifications, updateNotifications } from '../api/notificationApi';
import { notificationKeys } from '../api/notificationKeys';

export const useGetAllNotification = (memberId: string) => {
  return useQuery({
    queryFn: () => getAllNotifications(memberId),
    queryKey: notificationKeys.lists(memberId),
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
        queryKey: notificationKeys.lists(memberId),
      });
      console.log('알림 읽음 처리 완료');
    },
  });
};
