import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';

import { instance } from '../../services/axios';
import { useAuthStore } from '../../store/auth/useAuthStore';

export const KakaoCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState<null | string>(null);

  const setAuthenticated = useAuthStore((state) => state.setAuthenticated);

  useEffect(() => {
    const code = searchParams.get('code');
    const errorParam = searchParams.get('error');

    if (errorParam) {
      console.error('OAuth error:', errorParam);
      navigate('/login', { replace: true });
      return;
    }

    if (!code) {
      navigate('/login', { replace: true });
      return;
    }

    const handleKakaoLogin = async () => {
      try {
        const { data } = await instance.post('/auth/login/KAKAO', null, {
          params: { code },
        });

        setAuthenticated(true);

        if (data.newMember) {
          navigate('/setup-nickname', { replace: true });
        } else {
          navigate('/my-tteok', { replace: true });
        }
      } catch (err) {
        console.error('카카오 로그인 에러:', err);

        const errorMessage =
          err instanceof Error && 'response' in err
            ? (err as any).response?.data?.message || '서버 연결에 실패했어요'
            : '카카오 로그인 중 문제가 발생했어요';

        setError(errorMessage);
        setTimeout(() => navigate('/login'), 2000);
      }
    };

    handleKakaoLogin();
  }, [navigate, searchParams, setAuthenticated]);

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      {error ? (
        <>
          <p className="text-2xl">😢</p>
          <p className="text-brand-dark text-xl">{error}</p>
          <p className="text-sm text-gray-500">잠시 후 로그인 페이지로 이동해요...</p>
        </>
      ) : (
        <>
          <p className="text-brand-dark animate-pulse text-2xl">
            카카오에서 떡국 재료 가져오는 중... 🥚🥩🌿
          </p>
          <div className="mt-4 h-2 w-48 overflow-hidden rounded-full bg-gray-200">
            <div className="bg-brand-dark h-full animate-pulse" style={{ width: '60%' }} />
          </div>
        </>
      )}
    </div>
  );
};
