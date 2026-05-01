'use client';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';

export default function RootWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isApp = pathname.startsWith('/app');
  return (
    <>
      {!isApp && <Navbar />}
      <main>{children}</main>
      {!isApp && <Footer />}
    </>
  );
}
