import { useEffect, useRef } from 'react';

import closeIcon from '../../../shared/assets/icons/x.png';
import { formatNotificationDate } from '../../../shared/utils/dateUtils';
import { useAuthStore } from '../../../store/auth/useAuthStore';
import { useModalStore } from '../../../store/useModalStore';
import { useGetAllNotification, useUpdateNotification } from '../hooks/useNotification';

const NOTIFICATION_MEMBER_KEY = 'me';

export const NotificationModal = () => {
  const { isAuthenticated } = useAuthStore();
  const { closeModal } = useModalStore();
  const {
    data: notifications,
    isError,
    isPending,
  } = useGetAllNotification(NOTIFICATION_MEMBER_KEY, isAuthenticated);
  const { mutate: readAllNotifications } = useUpdateNotification(NOTIFICATION_MEMBER_KEY);

  const notificationList = notifications ?? [];
  const unreadCount = notificationList.filter((notification) => !notification.isRead).length;
  const unreadCountRef = useRef(unreadCount);

  useEffect(() => {
    unreadCountRef.current = unreadCount;
  }, [unreadCount]);

  useEffect(() => {
    return () => {
      if (unreadCountRef.current > 0) {
        readAllNotifications();
      }
    };
  }, [readAllNotifications]);

  return (
    <article className="w-min-[448px] h-75.5 w-full rounded-4xl bg-white shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]">
      <div className="border-disabled flex items-center justify-between border-b px-6 py-4">
        <div className="flex flex-col">
          <h2 className="text-font-main text-[20px] leading-7 font-bold tracking-[-0.449px]">
            알림
          </h2>
          <span className="text-font-gray text-xs leading-4">새 알림 {unreadCount}개</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-1.5" onClick={closeModal} type="button">
            <img alt="close-icon" className="w-5" src={closeIcon} />
          </button>
        </div>
      </div>
      <ul className="flex max-h-96 flex-col gap-2 overflow-y-auto p-4">
        {isPending && <li className="text-font-gray px-2 py-8 text-sm">불러오는 중...</li>}
        {isError && <li className="text-warning px-2 py-8 text-sm">알림을 불러오지 못했습니다.</li>}
        {!isPending && !isError && notificationList.length === 0 && (
          <li className="text-font-gray px-2 py-8 text-sm">새로운 알림이 없습니다.</li>
        )}
        {!isPending &&
          !isError &&
          notificationList.map((notification) => (
            <li
              className={`flex items-center gap-3 rounded-2xl border-2 px-4 py-3 ${notification.isRead ? 'border-disabled bg-disabled/15' : 'border-accent-main/30 bg-grad-notification'}`}
              key={notification.id}
            >
              <p className="text-[26px] leading-8 tracking-[0.396px]">🔔</p>
              <div className="flex w-full flex-col gap-1">
                <p className="text-font-main text-sm leading-5 font-medium tracking-[-0.15px]">
                  {notification.content}
                </p>
                <span className="text-font-gray-light text-xs leading-4">
                  {formatNotificationDate(notification.date)}
                </span>
              </div>
            </li>
          ))}
      </ul>
    </article>
  );
};
