import { Outlet } from 'react-router';
import { SystemLayoutHeader } from './components/header/system-layout-header';
import { SystemLayoutSidebar } from './components/sidebar/system-layout-sidebar';
import { MobileBottomNav } from './components/bottom-nav';

export const SystemLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50/50">
      <SystemLayoutHeader />
      <section className="flex-1 flex gap-4 p-4 pb-20 md:pb-4 max-w-[1920px] mx-auto w-full">
        <aside className="hidden md:block w-64 shrink-0">
          <SystemLayoutSidebar />
        </aside>

        <main className="flex-1 bg-white border rounded-xl shadow-sm p-4 md:p-6 overflow-x-hidden">
          <Outlet />
        </main>
      </section>
      <MobileBottomNav />
    </div>
  );
};
