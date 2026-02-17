import type { ReactNode } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { delay, http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';

import { server } from '../../../test/setup';
import { storeKeys } from '../api/storeKeys';
import {
  useCreateItem,
  useDeleteItem,
  useGetItems,
  useGetStore,
  useToggleSubscribe,
} from './useStore';

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

describe('Store hooks test', () => {
  it('상점 정보를 가져옴', async () => {
    const { result } = renderHook(() => useGetStore('store-01'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.id).toBe('store-01');
  });

  it('상점의 아이템 정보를 가져옴', async () => {
    const { result } = renderHook(() => useGetItems('store-01'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toBeDefined();
    expect(Array.isArray(result.current.data)).toBe(true);
    expect(result.current.data).toHaveLength(2);
  });

  it('상점의 아이템 정보를 입력함', async () => {
    const { result } = renderHook(() => useCreateItem('store-01'), {
      wrapper: createWrapper(),
    });

    result.current.mutate({
      content: '내용',
      contentType: 'VIDEO',
      imageUrl: '이미지',
      mediaUrl: '영상url',
      name: '계란',
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.imageUrl).toBe('이미지');
  });

  it('상점의 아이템 정보를 삭제함', async () => {
    const { result } = renderHook(() => useDeleteItem('store-01', 'item-01'), {
      wrapper: createWrapper(),
    });

    result.current.mutate();

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });

  it('즐겨찾기 등록 시 서버 응답 전 캐시가 우선 업데이트되어야 함', async () => {
    const queryClient = new QueryClient(); // 직접 생성하여 접근 가능하게 함
    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useToggleSubscribe('store-01'), { wrapper });

    // 초기 상태 설정 (현재 구독 안 함: false)
    const queryKey = storeKeys.subscribe('store-01');
    queryClient.setQueryData(queryKey, false);

    result.current.mutate(false);

    await waitFor(() => {
      expect(queryClient.getQueryData(queryKey)).toBe(true);
    });

    // 최종 확인
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });

  it('즐겨찾기 변경 실패 시 이전 상태로 복구되어야 함', async () => {
    // 서버가 에러를 던지도록 설정
    server.use(
      http.post('*/store/:storeId/subscription', async () => {
        await delay(100);
        return new HttpResponse(null, { status: 500 });
      }),
    );

    const testQueryClient = new QueryClient({
      defaultOptions: { mutations: { retry: false }, queries: { retry: false } },
    });

    const { result } = renderHook(() => useToggleSubscribe('store-01'), {
      // 3. 반드시 이 testQueryClient를 훅에게 주입해야 합니다.
      wrapper: ({ children }) => (
        <QueryClientProvider client={testQueryClient}>{children}</QueryClientProvider>
      ),
    });
    // 초기는 즐겨찾기 안 함 상태
    const queryKey = storeKeys.subscribe('store-01');
    testQueryClient.setQueryData(queryKey, false);

    result.current.mutate(false);

    // 실제 UI는 true로 바뀜
    await waitFor(() => {
      expect(testQueryClient.getQueryData(queryKey)).toBe(true);
    });

    // 서버 에러가 날 때까지 기다림
    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    await waitFor(() => {
      expect(testQueryClient.getQueryData(queryKey)).toBe(false);
    });
  });
});
