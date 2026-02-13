import { guestBookHandlers } from './guestBookHandlers';
import { memberHandlers } from './memberHandlers';
import { myItemHandlers } from './myItemHandlers';
import { notificationHandlers } from './notificationHandlers';
import { storeHandlers } from './storeHandlers';

export const handlers = [
  ...memberHandlers,
  ...myItemHandlers,
  ...guestBookHandlers,
  ...notificationHandlers,
  ...storeHandlers,
];
