import { http, HttpResponse } from 'msw';

import notificationData from './data/notifications.json';

export const notificationHandlers = [
  http.get('*/notifications', () => {
    return HttpResponse.json(notificationData);
  }),

  http.get('*/notifications/stream', () => {
    return new HttpResponse(null, { status: 204 });
  }),

  http.patch('*/notifications', () => {
    return HttpResponse.json(null, { status: 204 });
  }),
];
