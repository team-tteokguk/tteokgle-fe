import type { ReactNode } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import {
  useCreateGuestBook,
  useDeleteGuestBook,
  useGuestBook,
  useUpdateGuestBook,
} from './useGuestBook';
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
  it('방명록을 다 가져옴', async () => {
    const { result } = renderHook(() => useGuestBook('store-01'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toBeDefined();
    expect(Array.isArray(result.current.data)).toBe(true);
    expect(result.current.data).toHaveLength(5);
  });

  it('방명록 하나를 등록함', async () => {
    const { result } = renderHook(() => useCreateGuestBook('store-01'), {
      wrapper: createWrapper(),
    });

    const newGuestBook = { content: '떡국 너무 맛있어요! 새해 복 많이 받으세요.' };

    result.current.mutate(newGuestBook);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.content).toBe(newGuestBook.content);
  });

  it('방명록 하나를 수정함', async () => {
    const { result } = renderHook(() => useUpdateGuestBook('store-01', 'guestbook-01'), {
      wrapper: createWrapper(),
    });

    const newGuestBook = {
      content: '떡국 너무 맛있어요! 새해 복 많이 받으세요.',
    };

    result.current.mutate(newGuestBook);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.content).toBe(newGuestBook.content);
    expect(result.current.data?.id).toBe('guestbook-01');
  });

  it('방명록 하나를 삭제함', async () => {
    const { result } = renderHook(() => useDeleteGuestBook('store-01', 'guestbook-01'), {
      wrapper: createWrapper(),
    });

    result.current.mutate();

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
