import { createBrowserRouter, Navigate } from 'react-router';

import ProtectedRoute from './features/auth/components/ProtectedRoute';
import GeneralLayout from './layouts/GeneralLayout';
import { GoogleCallback } from './pages/auth/GoogleCalllback';
import { Login } from './pages/auth/Login';
import { SetupNickname } from './pages/auth/SetupNickname';
import { FindFriends } from './pages/FindFriends';
import { Mypage } from './pages/Mypage';
import { MyStore } from './pages/MyStore';
import { MyTteok } from './pages/MyTteok';

export const router = createBrowserRouter([
  {
    children: [
      // 로그인 불필요
      {
        element: <Navigate replace to="/my-tteok" />,
        index: true,
      },

      // 로그인 필수
      {
        children: [
          {
            element: <Mypage />,
            index: true,
            path: 'mypage',
          },
          {
            element: <MyTteok />,
            index: true,
            path: 'my-tteok',
          },
          {
            element: <MyStore />,
            index: true,
            path: 'my-store',
          },
          {
            element: <FindFriends />,
            index: true,
            path: 'find-buddy',
          },
        ],
        element: <ProtectedRoute />,
      },
    ],
    element: <GeneralLayout />,
    path: '/',
  },

  // 레이아웃 미적용 페이지 여기 작성

  // TODO: NotFound 완성 후 주석 제거
  // {
  //   path: '*',
  //   element: <NotFound />,
  // },
  {
    element: <Login />,
    index: true,
    path: 'login',
  },
  {
    element: <GoogleCallback />,
    index: true,
    path: 'auth/google/callback',
  },

  // 레이아웃 미적용 & 로그인 가드
  {
    children: [
      {
        element: <SetupNickname />,
        index: true,
        path: '/setup-nickname',
      },
    ],
    element: <ProtectedRoute />,
  },
]);
