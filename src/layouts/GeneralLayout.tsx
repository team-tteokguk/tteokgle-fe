import { Outlet } from 'react-router';

// TODO: 디자인 확정 되면 수정
const GeneralLayout = () => {
  return (
    <div>
      <main>
        <h1>공통 레이아웃</h1>
        <Outlet />
      </main>
    </div>
  );
};

export default GeneralLayout;
