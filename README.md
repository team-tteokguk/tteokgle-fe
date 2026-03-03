# 떠글보글

[배포 사이트](https://tteogeul.shop/login)

React + TypeScript + Vite 기반의 떡국/상점 서비스 프론트엔드입니다.
사용자는 내 떡국을 꾸미고, 내 상점을 관리하고, 친구 상점을 찾아 아이템을 구매할 수 있습니다.

## 주요 기능

- Google OAuth 로그인 및 인증 상태 초기화
- 내 떡국(`my-tteok`) 조회, 아이템(고명) 추가/상세 확인
- 내 상점(`my-store`) 조회, 판매 아이템 관리, 방명록 확인
- 친구 찾기(`find-buddy`) 검색/즐겨찾기, 무한 스크롤
- 친구 상점(`store/:storeId`) 조회 및 아이템 구매
- 마이페이지(`mypage`) 닉네임/상점명/프로필 이미지 변경, 로그아웃/회원탈퇴

## 기술 스택

- React 19
- TypeScript 5
- Vite 7
- React Router 7
- TanStack Query 5
- Zustand
- Tailwind CSS 4
- Axios
- Vitest + Testing Library + MSW

## 시작하기

### 1. 요구 사항

- Node.js 20 이상 권장
- npm 10 이상 권장

### 2. 설치

```bash
npm install
```

### 3. 환경변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 아래 값을 설정하세요.

```env
VITE_API_URL=http://localhost:8080
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_GOOGLE_REDIRECT_URI=http://localhost:5173/auth/google/callback
VITE_KAKAO_CLIENT_ID=your_kakao_rest_api_key
VITE_KAKAO_REDIRECT_URI=http://localhost:5173/auth/kakao/callback
```

### 4. 개발 서버 실행

```bash
npm run dev
```

기본 주소: `http://localhost:5173`

## 스크립트

- `npm run dev`: 개발 서버 실행
- `npm run build`: 타입체크 + 프로덕션 빌드
- `npm run preview`: 빌드 결과 미리보기
- `npm run lint`: ESLint 실행
- `npm run type-check`: TypeScript 타입 검사
- `npm run validate`: 타입 검사 + 린트
- `npx vitest`: 테스트 실행(Watch)
- `npx vitest run`: 테스트 1회 실행

## 라우트

- `/login`: 로그인
- `/auth/google/callback`: Google OAuth 콜백
- `/auth/kakao/callback`: Kakao OAuth 콜백
- `/setup-nickname`: 닉네임 설정 (인증 필요)
- `/my-tteok`: 나의 떡국 (인증 필요)
- `/my-store`: 내 상점 (인증 필요)
- `/find-buddy`: 친구 찾기 (인증 필요)
- `/store/:storeId`: 친구 상점 상세 (인증 필요)
- `/mypage`: 마이페이지 (인증 필요)

## 프로젝트 구조

```text
src/
  features/          # 도메인별 기능(auth, members, stores, myItems, guestbooks, notification)
  pages/             # 라우트 페이지
  shared/            # 공통 컴포넌트, 유틸, 에셋, API 인스턴스
  store/             # Zustand 전역 상태
  services/          # Axios 인스턴스, QueryClient
  layouts/           # 공통 레이아웃
  mock/              # MSW 핸들러 및 목 데이터
  test/              # 테스트 설정
```

## 테스트

- 테스트 환경: `jsdom`
- 전역 테스트 설정: `src/test/setup.ts`
- API 모킹: `msw` (`src/mock/*`)

## 인증/네트워크 동작 메모

- API 요청은 기본적으로 `withCredentials: true` 쿠키 기반 인증을 사용합니다.
- `401` 응답 시 `/auth/refresh`로 토큰 갱신을 시도하고, 실패 시 로그인 페이지로 이동합니다.
