import type { Metadata } from 'next';
import RootWrapper from '@/components/RootWrapper';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'CoopLedger — Transparence Blockchain pour les Coopératives Agricoles',
  description: 'CoopLedger est une plateforme digitale pour une gestion transparente des coopératives agricoles au Togo grâce à la blockchain.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head />
      <body>
        <RootWrapper>{children}</RootWrapper>
      </body>
    </html>
  );
}
