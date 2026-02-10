import { createBrowserRouter } from 'react-router';

// import ProtectedRoute from './features/auth/components/ProtectedRoute';
import GeneralLayout from './layouts/GeneralLayout';
import { Login } from './pages/Login';
import { Mypage } from './pages/Mypage';
import { MyTteok } from './pages/MyTteok';

export const router = createBrowserRouter([
  {
    children: [
      // 로그인 불필요
      {},

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
        ],
        // 잠시 주석 처리
        // element: <ProtectedRoute />,
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
]);
