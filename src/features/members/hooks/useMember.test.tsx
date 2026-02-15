import type { ReactNode } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { useMyProfile, useUpdateNickname } from './useMember';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('Member hooks test', () => {
  it('유저 정보를 가져옴', async () => {
    const { result } = renderHook(() => useMyProfile(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      if (result.current.isError) {
        console.error('API 에러 발생:', result.current.error);
      }
      expect(result.current.isSuccess).toBe(true);
    });
    expect(result.current.data?.nickname).toBe('외요');
  });

  it('닉네임 변경함', async () => {
    const { result } = renderHook(() => useUpdateNickname(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({
      nickname: 'new 외요',
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.nickname).toBe('new 외요');
  });
});
