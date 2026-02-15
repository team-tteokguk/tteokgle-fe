import { InputWithLabel } from '../features/members/components/InputWithLabel';
import logoutIcon from '../shared/assets/icons/logout.png';
import storeIcon from '../shared/assets/icons/store.png';
import warnIcon from '../shared/assets/icons/warn.png';
import { TitleCard } from '../shared/components/TitleCard';

export const Mypage = () => {
  return (
    <>
      <TitleCard sub="내 정보를 관리하세요" title="마이페이지" />
      <div className="mt-4 flex flex-col items-center rounded-4xl border border-white/50 bg-white/90 p-6.25 shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1)]">
        <div className="flex h-24 w-24 items-end justify-end rounded-full border-4 border-white bg-[url(./shared/assets/icons/default-profile.png)] bg-cover bg-center bg-no-repeat">
          <input className="hidden" id="profile" type="file" />
          <label
            className="bg-brand-main block h-8 w-8 rounded-full bg-[url(./shared/assets/icons/camera.png)] bg-size-[16px] bg-center bg-no-repeat shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-4px_rgba(0,0,0,0.1)]"
            htmlFor="profile"
          ></label>
        </div>
        <div className="flex w-full flex-col gap-4">
          <InputWithLabel defaultValue="" id="username" label="닉네임" />
          <InputWithLabel defaultValue="" icon={storeIcon} id="store-name" label="상점 이름" />
        </div>
      </div>
      <div className="mt-4 flex flex-col gap-3 rounded-4xl border border-white/50 bg-white/90 p-6.25 shadow-xl">
        {/* TODO: 모달 제작 완료 후 적용하기 */}
        <button className="mypage-button-base bg-disabled text-font-gray-dark" type="button">
          <img alt="logout-icon" className="w-5" src={logoutIcon} />
          로그아웃
        </button>
        <button className="mypage-button-base text-warning bg-warning-pink" type="button">
          <img alt="withdrawal-icon" className="w-5" src={warnIcon} />
          회원 탈퇴
        </button>
      </div>
    </>
  );
};
