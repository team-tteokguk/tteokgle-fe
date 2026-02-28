import type { Member, MemberProfileImageUpdateDto, MemberUpdateDto } from '../types';

import { instance } from '../../../services/axios';

export const getMyProfile = async (): Promise<Member> => {
  const { data } = await instance.get('/members/me');
  return data;
};

export const updateProfile = async (body: MemberUpdateDto): Promise<Member> => {
  const { data } = await instance.patch('/members/me', body);
  return data;
};

export const updateProfileImage = async (body: MemberProfileImageUpdateDto): Promise<Member> => {
  const { data } = await instance.patch('/members/me/profile-image', body);
  return data;
};

export const withdrawMember = async (): Promise<void> => {
  await instance.delete('/members/me');
};
