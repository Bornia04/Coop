import type { Metadata } from 'next';
import AppLayout from '@/components/AppLayout';

export const metadata: Metadata = {
  title: 'CoopLedger App — Tableau de Bord',
  description: 'Application de gestion de coopérative agricole avec transparence blockchain.',
};

export default function AppRootLayout({ children }: { children: React.ReactNode }) {
  return <AppLayout>{children}</AppLayout>;
}
