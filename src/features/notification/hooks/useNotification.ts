import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { getAllNotifications, updateNotifications } from '../api/notificationApi';
import { notificationKeys } from '../api/notificationKeys';

export const useAllNotifications = (memberId: string) => {
  return useQuery({
    enabled: !!memberId,
    queryFn: () => getAllNotifications(memberId),
    queryKey: notificationKeys.list(memberId, 'all'),
  });
};

export const useUpdateNotifications = (memberId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => updateNotifications(memberId),
    onError: (error) => {
      console.error('알림 읽음 처리 실패', error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: notificationKeys.lists(memberId),
      });
      console.log('알림 읽음 처리 완료');
    },
  });
};
