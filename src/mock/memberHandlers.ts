import type { Member, MemberUpdateDto } from '../features/members/types';

import { http, HttpResponse } from 'msw';

export const memberHandlers = [
  http.get('*/members/me', () => {
    const mockMember: Member = {
      createdAt: '2026-02-17T21:56:53.143825',
      memberId: '123',
      nickname: '외요',
      point: 1233,
      profileImage:
        'https://the.sfo2.cdn.digitaloceanspaces.com/dict/end/qs_main_img/%EC%84%9C%EB%91%90/pos_dict/%EB%AA%85%EC%82%AC.webp',
      socailId: '103520840389889755977',
      socialType: 'GOOGLE',
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
