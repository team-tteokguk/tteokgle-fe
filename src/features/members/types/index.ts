export interface Member {
  id: number;
  nickname: string;
  profileImage?: string;
}

export interface MemberUpdateDto {
  nickname: string;
}
