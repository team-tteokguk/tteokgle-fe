import { http, HttpResponse } from 'msw';

import storeDetailData from './data/storeDetail.json';
import storeItemsData from './data/storeItems.json';

export const storeHandlers = [
  http.get('*/store/:storeId', ({ params }) => {
    const { storeId } = params;
    console.log(`${storeId}의 상점 정보를 불러옵니다.`);
    return HttpResponse.json(storeDetailData);
  }),

  http.get('*/store/:storeId/items', ({ params }) => {
    const { storeId } = params;
    console.log(`${storeId}의 상점 아이템을 불러옵니다.`);
    return HttpResponse.json(storeItemsData);
  }),

  http.post('*/store/:storeId/items', async ({ params, request }) => {
    const { storeId } = params;
    const body = (await request.json()) as any;
    console.log(`${storeId}의 상점에 아이템 생성합니다.`);

    return HttpResponse.json(
      {
        ...body,
        id: 'item-01',
      },
      { status: 201 },
    );
  }),

  http.delete('*/store/:storeId/items/:itemId', ({ params }) => {
    const { itemId, storeId } = params;
    console.log(`${storeId}의 상점에 아이템 ${itemId}을 수정합니다.`);

    return HttpResponse.json(null, { status: 204 });
  }),

  http.post('*/store/:storeId/subscription', ({ params }) => {
    const { storeId } = params;
    console.log(`${storeId}의 상점 정보를 불러옵니다.`);

    return HttpResponse.json(null, { status: 204 });
  }),

  http.post('*/stores/items/:itemId/purchase', ({ params }) => {
    const { itemId } = params;
    console.log(`아이템 ${itemId}을 구매합니다.`);

    return HttpResponse.json(null, { status: 204 });
  }),
];
