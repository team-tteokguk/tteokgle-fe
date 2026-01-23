/**
 * 방명록 등록
 */
export interface GuestBookRequest {
  content: string;
}

/**
 * 방명록 조회
 */
export interface GuestBookResponse {
  content: string;
  createdAt: string;
  id: string;
  writerId: string;
  writerImageUrl: string;
  writerNickname: string;
}
