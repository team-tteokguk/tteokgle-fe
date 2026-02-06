import type { ReactNode } from 'react';

interface TitleCardProps {
  children?: ReactNode;
  sub: string;
  title: string;
}

export const TitleCard = ({ children, sub, title }: TitleCardProps) => {
  return (
    <div className="bg-grad-title-card h-full w-full rounded-4xl p-6 shadow-xl">
      <h1 className="mb-1 text-2xl leading-8 font-black tracking-[0.07px] text-white">{title}</h1>
      <p className="text-sm leading-5 tracking-[-0.15px] text-white/80">{sub}</p>
      {children}
    </div>
  );
};
