'use client';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';

import { NotificationProvider } from './NotificationProvider';

export default function RootWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isApp = pathname.startsWith('/app');
  return (
    <NotificationProvider>
      {!isApp && <Navbar />}
      <main>{children}</main>
      {!isApp && <Footer />}
    </NotificationProvider>
  );
}
