import readingGlassIcon from '../shared/assets/icons/reading-glass.png';
import activeStar from '../shared/assets/icons/star-active.png';
import whiteStarIcon from '../shared/assets/icons/star-white.png';
import { TitleCard } from '../shared/components/TitleCard';

export const FindFriends = () => {
  return (
    <div>
      <TitleCard sub="친구의 상점을 방문해보세요" title="친구 찾기">
        <div className="mt-4 flex gap-2">
          <button className="find-buddy-button-base text-font-main bg-white">검색</button>
          <button className="find-buddy-button-base bg-white/20 text-white">
            <img alt="subscribe-list-button" className="mr-1.75 w-4.5" src={whiteStarIcon} />
            즐겨찾기
          </button>
        </div>
      </TitleCard>
      <div className="mt-4 flex flex-col gap-4 rounded-4xl border border-white/50 bg-white/90 p-6.25 shadow-xl">
        <div className="border-disabled flex w-full items-center rounded-2xl border-2 pl-[13.5px]">
          <img alt="reading-glass-icon" className="h-5 w-5" src={readingGlassIcon} />
          <input className="w-full px-4 py-3" placeholder="친구 이름으로 검색..." type="text" />
        </div>
        <p className="text-font-main text-[18px] leading-7 font-black tracking-[-0.439px]">
          친구 목록
        </p>
        <ul>
          <li className="border-accent-main bg-grad-item flex items-center rounded-2xl border-2 px-4 py-4">
            <div className="bg-grad-accent mr-3 flex h-12 w-12 items-center justify-center rounded-full">
              ☁️
            </div>
            <div className="flex flex-col">
              <p className="text-font-main text-base leading-6 font-bold tracking-[-0.312px]">
                김민수
              </p>
              <span className="text-font-gray text-xs leading-4">민수의 명절상점</span>
            </div>
            <p className="bg-accent-main/20 text-font-main mr-4 ml-auto rounded-full px-2 py-1 text-xs leading-4 font-bold">
              3개 판매중
            </p>
            <button aria-label="subscribe-button" className="" type="button">
              <img alt="star-icon" className="w-5" src={activeStar} />
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};
