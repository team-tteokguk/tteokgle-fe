export type GuestBookParams = {
  page?: number;
  size?: number;
};

// 무한 스크롤 응답 형태
export type PageResponse<T> = {
  content: T[];
  last: boolean;
  number: number;
};
