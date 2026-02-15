import { http, HttpResponse } from 'msw';

import guestBookDetailData from '../mock/data/guestBookDetail.json';
import guestBookResponseData from '../mock/data/guestBookResponse.json';

export const guestBookHandlers = [
  http.get('*/store/:storeId/guestbooks', () => {
    return HttpResponse.json(guestBookResponseData);
  }),

  http.post('*/store/:storeId/guestbooks', async ({ request }) => {
    const body = (await request.json()) as any;
    return HttpResponse.json(
      {
        ...guestBookDetailData,
        content: body.content,
      },
      { status: 201 },
    );
  }),

  http.put('*/store/:storeId/guestbooks/:guestbookId', async ({ params, request }) => {
    const { guestbookId } = params;
    const body = (await request.json()) as any;

    return HttpResponse.json(
      {
        ...guestBookDetailData,
        content: body.content,
        id: guestbookId,
      },
      { status: 200 },
    );
  }),

  http.delete('*/store/:storeId/guestbooks/:guestbookId', async ({ params }) => {
    const { guestbookId } = params;
    console.log(`mock가 : ${guestbookId}번 방명록을 삭제 처리합니다.`);
    return HttpResponse.json(null, { status: 204 });
  }),
];
