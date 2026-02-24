import { Outlet } from 'react-router';

import { Header } from '../shared/components/Header';
import { Navbar } from '../shared/components/Navbar';

const GeneralLayout = () => {
  return (
    <div className="flex justify-center pt-4">
      <div className="w-full max-w-md">
        <Header />
        <main className="pt-[70.5px] pb-4">
          <Outlet />
        </main>
        {/* 고정할지 고민 */}
        <Navbar />
      </div>
    </div>
  );
};

export default GeneralLayout;
