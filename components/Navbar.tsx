import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { IconShield } from './Icons';
import { Button } from './ui/button';

export default function Navbar() {
  const pathname = usePathname();
  const links = [
    { href: '/#solutions', label: 'Solutions' },
    { href: '/#blockchain', label: 'Gouvernance' },
    { href: '/#impact', label: 'Impact' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#020617]/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
            <IconShield size={24} color="white" />
          </div>
          <span className="text-2xl font-black tracking-tighter text-white">CoopLedger</span>
        </Link>
        <div className="hidden md:flex items-center gap-10">
          {links.map((link) => (
            <Link 
              key={link.label} 
              href={link.href} 
              className={`text-sm font-bold transition-colors uppercase tracking-widest ${
                pathname === link.href ? 'text-primary' : 'text-white/60 hover:text-primary'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <Link href="/app/login">
            <Button variant="ghost" className="font-bold text-white hover:text-primary hover:bg-white/5">Connexion</Button>
          </Link>
          <Link href="/app/register">
            <Button className="bg-primary hover:bg-primary/90 text-white font-black px-8 rounded-full shadow-xl shadow-primary/20">Rejoindre</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
