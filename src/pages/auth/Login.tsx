import { GOOGLE_AUTH_URL } from '../../features/auth/constants';
import googleIcon from '../../shared/assets/icons/googlle.png';
import kakaoIcon from '../../shared/assets/icons/kakao.png';
import { BouncingEmojis } from '../../shared/components/BouncingEmojis';

export const Login = () => {
  const handleGoogleLogin = () => {
    window.location.href = GOOGLE_AUTH_URL;
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <div className="w-full max-w-md text-center">
        <p className="mb-4 text-8xl leading-24 tracking-[-0.439px]">🍜</p>
        <h1 className="text-font-main mb-3.75 text-5xl leading-12 font-black tracking-[0.352px]">
          떠글보글
        </h1>
        <span className="text-brand-dark text-lg leading-7 tracking-[-0.439px]">
          고명을 모아 나만의 떡국을 완성해보세요
        </span>
        <div className="mt-11 mb-6.25 flex w-full flex-col items-center justify-center gap-3 rounded-4xl border border-white/50 bg-white/90 p-8.25 shadow-2xl">
          <button className="social-login-button-base bg-[#FEE500] text-[#3C1E1E]" type="button">
            <img alt="kakao-icon" className="w-6" src={kakaoIcon} />
            카카오로 시작하기
          </button>
          <button
            className="social-login-button-base text-[#1E2939]"
            onClick={handleGoogleLogin}
            type="button"
          >
            <img alt="google" className="w-6" src={googleIcon} />
            구글로 시작하기
          </button>
        </div>
        <BouncingEmojis />
      </div>
    </div>
  );
};
