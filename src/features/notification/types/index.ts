/**
 * 알림 조회
 */
export interface NotificationResponse {
  content: string;
  id: string;
  isRead: boolean;
  localDateTime: string;
  url: string;
}
