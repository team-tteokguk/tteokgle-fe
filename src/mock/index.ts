import { guestBookHandlers } from './guestBookHandlers';
import { memberHandlers } from './memberHandlers';
import { myItemHandlers } from './myItemHandlers';

export const handlers = [...memberHandlers, ...myItemHandlers, ...guestBookHandlers];
