import { useMyPoint } from '../../features/members/hooks/useMember';
import { NotificationModal } from '../../features/notification/components/NotificationModal';
import {
  useGetAllNotification,
  useNotificationStream,
} from '../../features/notification/hooks/useNotification';
import bellIcon from '../../shared/assets/icons/bell.png';
import { useAuthStore } from '../../store/auth/useAuthStore';
import { useModalStore } from '../../store/useModalStore';

const pointFormatter = new Intl.NumberFormat('ko-KR');
const NOTIFICATION_MEMBER_KEY = 'me';

export const Header = () => {
  const { isAuthenticated, isAuthResolved } = useAuthStore();
  const { openModal } = useModalStore();
  const isNotificationEnabled = isAuthResolved && isAuthenticated;
  const { data: point, isError, isPending } = useMyPoint(isNotificationEnabled);
  const { data: notifications } = useGetAllNotification(
    NOTIFICATION_MEMBER_KEY,
    isNotificationEnabled,
  );

  useNotificationStream(NOTIFICATION_MEMBER_KEY, isNotificationEnabled);

  const unreadCount = notifications?.filter((notification) => !notification.isRead).length ?? 0;
  const pointLabel = isError
    ? '-'
    : `${pointFormatter.format(point ?? 0)}${isPending ? '...' : ''}`;

  return (
    <header className="flex items-center justify-between">
      <div className="flex min-w-28.5 items-center justify-between gap-2 rounded-full border border-white/50 bg-white/90 px-4 shadow-lg">
        <span className="text-[20px] leading-7 tracking-[-0.449px]">🪙</span>
        <p
          aria-busy={isPending}
          className="text-font-main text-[16px] leading-6 font-bold tracking-[-1.312px]"
        >
          {pointLabel} 냥
        </p>
      </div>
      <button
        aria-label="notification-button"
        className="relative h-10 w-10 rounded-full border-white/50 bg-white/90 shadow-xl"
        onClick={() => {
          openModal(<NotificationModal />);
        }}
        type="button"
      >
        <img alt="notification-button-icon" className="mx-auto w-5" src={bellIcon} />
        {unreadCount > 0 && (
          <span className="bg-warning text-font-second absolute -top-1 -right-1 flex aspect-square min-w-5 items-center justify-center rounded-full px-1 py-0.5 text-[10px] leading-3.75 font-bold tracking-[0.117px] text-white">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>
    </header>
  );
};
