import { http, HttpResponse } from 'msw';

import itemDetailData from './data/itemDetail.json';
import placedItemsData from './data/placedItems.json';
import readItemDetailData from './data/readItemDetail.json';
import unplacedItemsData from './data/unplacedItems.json';

export const myItemHandlers = [
  // 배치된 고명 리스트
  http.get('*/tteokguk/me/items/placed', () => {
    return HttpResponse.json(placedItemsData);
  }),

  // 미배치된 고명 리스트
  http.get('*/tteokguk/me/items/unplaced', () => {
    return HttpResponse.json(unplacedItemsData);
  }),

  // 아이템 상세 조회
  http.get('*/tteokguk/me/items/:itemId', () => {
    return HttpResponse.json(itemDetailData);
  }),

  // 고명 배치 및 수납
  http.patch('*/tteokguk/me/items/:itemId', () => {
    return HttpResponse.json(itemDetailData);
  }),

  // 고명 읽음 처리
  http.patch('*/tteokguk/me/items/:itemId/read', () => {
    return HttpResponse.json(readItemDetailData);
  }),
];
