import { guestBookHandlers } from './guestbookHandlers';
import { memberHandlers } from './memberHandlers';
import { myItemHandlers } from './myItemHandlers';

export const handlers = [...memberHandlers, ...myItemHandlers, ...guestBookHandlers];
