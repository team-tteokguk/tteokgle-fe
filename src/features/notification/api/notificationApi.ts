import type { NotificationResponse } from '../types';

import { instance } from '../../../services/axios';

const notificationStreamUrl = `${instance.defaults.baseURL}/notifications/stream`;

// memberId를 사용하지 않더라도 이전 로그인 기록이 영향을 주지 않도록 memberId를 인자로 받는다.
// [GET] 알림 리스트 불러오기
export const getAllNotifications = async (_memberId: string): Promise<NotificationResponse[]> => {
  const { data } = await instance.get('/notifications');
  const list: unknown[] = Array.isArray(data)
    ? data
    : Array.isArray(data?.content)
      ? data.content
      : [];

  return list
    .filter((item: unknown): item is NotificationResponse => isNotificationResponse(item))
    .map((item) => ({
      ...item,
      date: item.date ?? '',
    }));
};

// [PATCH] 알림 일괄 읽음 처리
export const updateNotifications = async (_memberId: string): Promise<void> => {
  const { data } = await instance.patch('/notifications');
  return data;
};

interface NotificationStreamOptions {
  onError?: (event: Event) => void;
  onMessage: (notification: NotificationResponse) => void;
}

const isNotificationResponse = (value: unknown): value is NotificationResponse => {
  if (!value || typeof value !== 'object') return false;

  const candidate = value as Partial<NotificationResponse> & { localDateTime?: string };
  return (
    typeof candidate.content === 'string' &&
    (typeof candidate.date === 'string' || typeof candidate.localDateTime === 'string') &&
    typeof candidate.id === 'string' &&
    typeof candidate.isRead === 'boolean' &&
    typeof candidate.url === 'string'
  );
};

export const connectNotificationStream = ({
  onError,
  onMessage,
}: NotificationStreamOptions): EventSource => {
  const eventSource = new EventSource(notificationStreamUrl, { withCredentials: true });

  const handleMessage = (event: MessageEvent) => {
    if (!event.data) return;

    try {
      const parsed = JSON.parse(event.data) as unknown;
      if (isNotificationResponse(parsed)) {
        onMessage({
          ...parsed,
          date: parsed.date ?? '',
        });
      }
    } catch (error) {
      console.error('알림 스트림 데이터 파싱 실패', error);
    }
  };

  eventSource.addEventListener('message', handleMessage);
  eventSource.onerror = (event) => {
    onError?.(event);
  };

  return eventSource;
};
