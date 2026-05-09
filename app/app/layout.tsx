import type { Metadata } from 'next';
import AppLayout from '@/components/AppLayout';
import RootWrapper from '@/components/RootWrapper';

export const metadata: Metadata = {
  title: 'CoopLedger App — Tableau de Bord',
  description: 'Application de gestion de coopérative agricole avec transparence blockchain.',
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RootWrapper>
      <AppLayout>
        {children}
      </AppLayout>
    </RootWrapper>
  );
}
