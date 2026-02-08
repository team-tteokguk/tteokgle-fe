import type { ReactNode } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import {
  useItemDetail,
  usePlacedItemList,
  useReadItem,
  useUnPlacedItemList,
  useUpdateItemPlacement,
} from './useMyItem';

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

describe('myitem hooks 테스트', () => {
  it('아이템 상세 정보 가져옴', async () => {
    const { result } = renderHook(() => useItemDetail('item-001'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.id).toBe('item-001');
  });

  it('미 배치 아이템 가져옴', async () => {
    const { result } = renderHook(() => useUnPlacedItemList(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(Array.isArray(result.current.data)).toBe(true);

    expect(result.current.data?.[0].id).toBe('item-003');

    expect(result.current.data).toHaveLength(2);
  });

  it('배치 아이템 가져옴', async () => {
    const { result } = renderHook(() => usePlacedItemList(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(Array.isArray(result.current.data)).toBe(true);

    expect(result.current.data?.[0].id).toBe('item-001');

    expect(result.current.data).toHaveLength(2);
  });

  it('고명 배치 및 수납함', async () => {
    const { result } = renderHook(() => useUpdateItemPlacement('item-001'), {
      wrapper: createWrapper(),
    });

    result.current.mutate({
      isUsed: true,
      posX: 100,
      posY: 100,
      posZ: 1,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });

  it('고명 읽음 처리', async () => {
    const { result } = renderHook(() => useReadItem('item-001'), {
      wrapper: createWrapper(),
    });

    result.current.mutate();

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.isRead).toBe(true);
  });
});
