import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

export default function Layout() {
  return (
    <div className="bg-surface font-body text-on-surface selection:bg-primary/30 h-screen w-screen overflow-hidden flex">
      <Sidebar />
      <div className="flex-1 ml-60 flex flex-col h-screen overflow-hidden relative">
        <Header />
        <main className="flex-1 mt-14 p-6 overflow-hidden flex flex-col gap-4 relative">
          <Outlet />
          
          {/* Decorative Background Elements */}
          <div className="fixed top-1/4 right-0 w-80 h-80 bg-primary/5 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
          <div className="fixed bottom-0 left-1/4 w-96 h-96 bg-tertiary/5 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
        </main>
      </div>
    </div>
  );
}
