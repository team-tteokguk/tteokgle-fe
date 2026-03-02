import { QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router';

import { router } from './router.tsx';
import { instance } from './services/axios.ts';
import { queryClient } from './services/queryClient.ts';
import { GlobalModal } from './shared/components/GlobalModal.tsx';
import { useAuthStore } from './store/auth/useAuthStore.ts';

import './index.css';

const AuthInitializer = ({ children }: { children: React.ReactNode }) => {
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const setAuthResolved = useAuthStore((state) => state.setAuthResolved);
  const setAuthenticated = useAuthStore((state) => state.setAuthenticated);
  const [isAuthInitialized, setIsAuthInitialized] = useState(false);

  useEffect(() => {
    const pathname = window.location.pathname;
    const shouldSkipForOAuthCallback = pathname === '/auth/google/callback';

    if (shouldSkipForOAuthCallback) {
      setAuthResolved(true);
      setIsAuthInitialized(true);
      return;
    }

    const initAuth = async () => {
      try {
        await instance.get('/members/me');
        setAuthenticated(true);
        if (window.location.pathname === '/login' || window.location.pathname === '/') {
          router.navigate('/my-tteok', { replace: true });
        }
        console.log('✅ 자동 로그인 성공');
      } catch (_error) {
        clearAuth();
        console.log('ℹ️ 자동 로그인 실패 (로그인 필요)');
      } finally {
        setIsAuthInitialized(true);
      }
    };

    initAuth();
  }, [clearAuth, setAuthenticated, setAuthResolved]);

  if (!isAuthInitialized) {
    return null;
  }

  return <>{children}</>;
};

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
  <QueryClientProvider client={queryClient}>
    <AuthInitializer>
      <RouterProvider router={router} />
      <GlobalModal />
    </AuthInitializer>
  </QueryClientProvider>,
  // </StrictMode>,
);
