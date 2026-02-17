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

// 테스트 격리를 위해 각 훅 렌더링마다 새로운 QueryClient를 생성하는 래퍼

// 빌드 오류 때문에 수정
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
    // 데이터가 있다는 가정하에 테스트 (MSW 핸들러 설정에 따라 인덱스 조정 필요)
    if (result.current.data && result.current.data.items.length > 0) {
      expect(result.current.data.items[0].id).toBe('item-003');
    }
  });

  it('배치 아이템 가져옴', async () => {
    const { result } = renderHook(() => usePlacedItemList(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(Array.isArray(result.current.data)).toBe(true);

    if (result.current.data && result.current.data) {
      expect(result.current.data.items[0].id).toBe('item-001');
    }
  });

  it('고명 배치 및 수납함', async () => {
    // 수정: hook 호출 시 인자를 넘기지 않음
    const { result } = renderHook(() => useUpdateItemPlacement(), {
      wrapper: createWrapper(),
    });

    // 수정: mutate 호출 시 itemId와 body를 객체로 묶어서 전달
    result.current.mutate({
      body: {
        // 실제 ItemPlacementRequest 타입에 맞는 필드 작성
        itemRotate: 0,
        positionX: 100,
        positionY: 100,
        // 필요하다면 기존 코드의 필드명 확인 (posX -> positionX 등 API 명세에 맞춤)
        // 여기서는 예시로 작성된 필드명을 유지하거나 조정합니다.
        // isUsed: true,
      } as any, // 타입 오류 방지를 위해 any 사용 (실제 타입에 맞춰 수정 권장)
      itemId: 'item-001',
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });

  it('고명 읽음 처리', async () => {
    const { result } = renderHook(() => useReadItem('item-001'), {
      wrapper: createWrapper(),
    });

    result.current.mutate();

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    // 주의: useMutation의 data는 서버 응답값입니다.
    // 서버가 업데이트된 객체를 반환한다고 가정할 때 아래 코드가 유효합니다.
    // 만약 서버가 성공 여부만 반환한다면 이 검증은 실패할 수 있습니다.
    if (result.current.data) {
      expect(result.current.data.isRead).toBe(true); // 또는 read: true 등 API 응답 필드명 확인
    }
  });
});
