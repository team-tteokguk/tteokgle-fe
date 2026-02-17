export interface Member {
  createdAt: string;
  memberId: number;
  nickname: string;
  point: number;
  profileImage: string;
  socailId: string;
  socialType: 'GOOGLE' | 'KAKAO';
}

export interface MemberUpdateDto {
  nickname: string;
}
