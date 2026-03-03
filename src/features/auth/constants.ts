const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const GOOGLE_REDIRECT_URI = import.meta.env.VITE_GOOGLE_REDIRECT_URI;
const KAKAO_CLIENT_ID = import.meta.env.VITE_KAKAO_CLIENT_ID;
const KAKAO_REDIRECT_URI = import.meta.env.VITE_KAKAO_REDIRECT_URI;

const GOOGLE_SCOPE = 'https://www.googleapis.com/auth/userinfo.profile';

export const GOOGLE_AUTH_URL = `https://accounts.google.com/o/oauth2/v2/auth?${new URLSearchParams({
  client_id: GOOGLE_CLIENT_ID,
  redirect_uri: GOOGLE_REDIRECT_URI,
  response_type: 'code',
  scope: GOOGLE_SCOPE,
}).toString()}`;

export const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?${new URLSearchParams({
  client_id: KAKAO_CLIENT_ID,
  redirect_uri: KAKAO_REDIRECT_URI,
  response_type: 'code',
}).toString()}`;
