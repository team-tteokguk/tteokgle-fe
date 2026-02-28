export interface Member {
  createdAt: string;
  memberId: string;
  nickname: string;
  point: number;
  profileImage: string;
  socailId: string;
  socialType: 'GOOGLE' | 'KAKAO';
}

export interface MemberProfileImageUpdateDto {
  profileImage: string;
}

export interface MemberUpdateDto {
  name?: string;
  nickname?: string;
}
