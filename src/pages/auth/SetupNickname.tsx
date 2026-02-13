import { BouncingEmojis } from '../../shared/components/BouncingEmojis';

export const SetupNickname = () => {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center">
      <div className="flex w-full max-w-md flex-col items-center">
        <h1 className="text-font-main mb-3 text-4xl leading-10 font-black tracking-[0.369px]">
          떠글보글
        </h1>
        <span className="text-brand-dark text-base leading-6 tracking-[-0.312px]">
          고명을 모아 나만의 떡국을 완성해보세요
        </span>
        <form className="mt-12 mb-8 flex w-full flex-col gap-4 rounded-4xl border border-white/50 bg-white/90 p-8.25 shadow-2xl">
          <label
            className="text-font-main text-sm leading-10 tracking-[-0.15px]"
            htmlFor="nickname"
          >
            닉네임을 입력해주세요
          </label>
          <input
            className="border-disabled/50 focus:border-brand-dark rounded-2xl border-2 bg-white/70 p-4 focus:border-2"
            id="nickname"
            placeholder="닉네임 입력"
            type="text"
          />
          <button
            className="bg-grad-brand disabled:bg-grad-disabled rounded-2xl py-4 text-base leading-6 font-bold tracking-[-0.312px] text-white"
            type="button"
          >
            떡국 꾸미러 가기
          </button>
        </form>
        <BouncingEmojis />
      </div>
    </div>
  );
};
