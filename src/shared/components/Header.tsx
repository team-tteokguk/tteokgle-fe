import bellIcon from '../../shared/assets/icons/bell.png';

export const Header = ({ coin }: { coin: number }) => {
  return (
    <header className="flex items-center justify-between">
      <div className="flex min-w-28.5 items-center justify-between gap-2 rounded-full border border-white/50 bg-white/90 px-4 shadow-lg">
        <span className="text-[20px] leading-7 tracking-[-0.449px]">🪙</span>
        <p className="text-font-main text-[16px] leading-6 font-bold tracking-[-1.312px]">
          {coin | 0} 냥
        </p>
      </div>
      <button
        aria-label="notification-button"
        className="h-10 w-10 rounded-full border-white/50 bg-white/90 shadow-xl"
        type="button"
      >
        <img alt="notification-button-icon" className="mx-auto w-5" src={bellIcon} />
      </button>
    </header>
  );
};
