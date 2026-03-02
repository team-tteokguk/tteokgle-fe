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
    .map(normalizeNotification);
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

const normalizeNotification = (item: NotificationResponse): NotificationResponse => {
  const candidate = item as NotificationResponse & { localDateTime?: string };
  return {
    ...item,
    date: item.date ?? candidate.localDateTime ?? '',
  };
};

const streamSubscribers = new Set<NotificationStreamOptions>();
let sharedEventSource: EventSource | null = null;

const dispatchMessage = (event: MessageEvent) => {
  if (!event.data || event.data === 'keep-alive') return;

  try {
    const parsed = JSON.parse(event.data) as unknown;
    if (!isNotificationResponse(parsed)) return;

    const normalized = normalizeNotification(parsed);
    streamSubscribers.forEach((subscriber) => {
      subscriber.onMessage(normalized);
    });
  } catch (_error) {
    // 서버 keep-alive 문자열 등 JSON 이외 payload는 무시한다.
    return;
  }
};

const dispatchError = (event: Event) => {
  // EventSource는 브라우저가 자동 재연결하므로 로깅/모니터링만 수행한다.
  streamSubscribers.forEach((subscriber) => {
    subscriber.onError?.(event);
  });
};

export const connectNotificationStream = ({
  onError,
  onMessage,
}: NotificationStreamOptions): (() => void) => {
  const subscriber = { onError, onMessage };
  streamSubscribers.add(subscriber);

  if (!sharedEventSource) {
    sharedEventSource = new EventSource(notificationStreamUrl, { withCredentials: true });
    sharedEventSource.addEventListener('message', dispatchMessage as EventListener);
    // 백엔드가 custom event 이름으로 전송해도 수신 가능하도록 보강
    sharedEventSource.addEventListener('notification', dispatchMessage as EventListener);
    sharedEventSource.onerror = dispatchError;
  }

  return () => {
    streamSubscribers.delete(subscriber);
    if (streamSubscribers.size === 0 && sharedEventSource) {
      sharedEventSource.close();
      sharedEventSource = null;
    }
  };
};

export const disconnectNotificationStream = (unsubscribe: () => void) => {
  try {
    unsubscribe();
  } catch (error) {
    console.error('알림 스트림 데이터 파싱 실패', error);
  }
};

if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    streamSubscribers.clear();
    if (sharedEventSource) {
      sharedEventSource.close();
      sharedEventSource = null;
    }
  });
}
