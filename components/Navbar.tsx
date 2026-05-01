'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { IconBell } from './Icons';

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const links = [
    { href: '/', label: 'Solutions' },
    { href: '/app/transactions', label: 'Ledger' },
    { href: '/a-propos', label: 'Vision' },
    { href: '/contact', label: 'Contact' },
  ];
  return (
    <header className="navbar" style={{ padding: '0 10%' }}>
      <Link href="/" className="navbar-logo">CoopLedger</Link>
      <nav className="navbar-links">
        {links.map(l => (
          <Link key={l.label} href={l.href} className={pathname === l.href ? 'active' : ''}>{l.label}</Link>
        ))}
      </nav>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <Link href="/app/login" className="btn-outline" style={{ padding: '0.5rem 1rem' }}>Se connecter</Link>
        <Link href="/app/register" className="btn-primary" style={{ padding: '0.5rem 1rem' }}>S'inscrire</Link>
      </div>
    </header>
  );
}
