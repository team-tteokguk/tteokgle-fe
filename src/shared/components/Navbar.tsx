import { Link, useLocation } from 'react-router';

interface ButtonItem {
  emoji: string;
  idx: number;
  label: string;
  path: string;
}

export const Navbar = () => {
  const location = useLocation();

  const buttonList: ButtonItem[] = [
    { emoji: '🥣', idx: 1, label: '나의 떡국', path: '/my-tteok' },
    { emoji: '🏪', idx: 2, label: '고명 상점', path: '/my-store' },
    { emoji: '👥', idx: 3, label: '친구 찾기', path: '/find-buddy' },
    { emoji: '👤', idx: 4, label: '마이페이지', path: '/mypage' },
  ];

  return (
    <nav className="flex w-full items-center rounded-4xl border border-white/50 bg-white/90 p-4.25 shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1)]">
      {buttonList.map((item) => {
        const isActive = location.pathname === item.path;

        return (
          <Link
            className="flex w-[102.5px] cursor-pointer flex-col items-center"
            key={item.idx}
            to={item.path}
          >
            <span
              className={`flex h-[52.8px] w-[52.8px] items-center justify-center rounded-2xl text-2xl leading-8 tracking-[0.07px] ${isActive ? 'bg-nav-clicked/10' : ''}`}
            >
              {item.emoji}
            </span>
            <p
              className={`mt-2 text-xs leading-4 font-bold transition-colors ${
                isActive ? 'text-nav-clicked' : 'text-nav-unclicked'
              }`}
            >
              {item.label}
            </p>
          </Link>
        );
      })}
    </nav>
  );
};
