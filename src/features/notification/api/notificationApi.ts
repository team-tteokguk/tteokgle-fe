import type { NotificationResponse } from '../types';

import { instance } from '../../../services/axios';

// memberId를 사용하지 않더라도 이전 로그인 기록이 영향을 주지 않도록 memberId를 인자로 받는다.
// [GET] 알림 리스트 불러오기
export const getAllNotifications = async (_memberId: string): Promise<NotificationResponse[]> => {
  const { data } = await instance.get('notifications');
  return data;
};

// [PATCH] 알림 일괄 읽음 처리
export const updateNotifications = async (_memberId: string): Promise<NotificationResponse[]> => {
  const { data } = await instance.patch('notifications');
  return data;
};
