import type { Member, MemberUpdateDto } from '../features/members/types';

import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('*/members/me', () => {
    const mockMember: Member = {
      id: 123,
      nickname: '외요',
      profileImage:
        'https://the.sfo2.cdn.digitaloceanspaces.com/dict/end/qs_main_img/%EC%84%9C%EB%91%90/pos_dict/%EB%AA%85%EC%82%AC.webp',
    };
    return HttpResponse.json(mockMember);
  }),

  http.patch('*/members/me', async ({ request }) => {
    const body = (await request.json()) as MemberUpdateDto;

    return HttpResponse.json({
      id: 123,
      nickname: body.nickname,
    });
  }),
];
