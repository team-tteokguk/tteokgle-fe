import { http, HttpResponse } from 'msw';

import notificationData from './data/notifications.json';

export const notificationHandlers = [
  http.get('*/notifications', () => {
    return HttpResponse.json(notificationData);
  }),

  http.patch('*/notifications', () => {
    return HttpResponse.json(null, { status: 204 });
  }),
];
