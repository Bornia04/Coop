'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { IconDashboard, IconTransactions, IconDepenses, IconGouvernance, IconEquipement, IconSettings, IconBell, IconMenu, IconX, IconArrowRight } from './Icons';

const links = [
  { href: '/app/dashboard', label: 'Tableau de bord', icon: IconDashboard },
  { href: '/app/transactions', label: 'Transactions', icon: IconTransactions },
  { href: '/app/depenses', label: 'Dépenses', icon: IconDepenses },
  { href: '/app/proposals', label: 'Gouvernance', icon: IconGouvernance },
  { href: '/app/equipement', label: 'Équipement', icon: IconEquipement },
  { href: '/app/settings', label: 'Paramètres', icon: IconSettings },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userName, setUserName] = useState('Kofi Amouzou');
  const [userRole, setUserRole] = useState('ADMIN');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const name = localStorage.getItem('user_name');
    if (name) setUserName(name);
    
    const role = localStorage.getItem('user_role');
    if (role) setUserRole(role);
    
    // Initialisation du mode sombre depuis le stockage local
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') setDarkMode(true);
  }, []);

  useEffect(() => {
    // Application de la classe au corps du document pour les styles CSS
    if (darkMode) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // Sécurité des routes selon les rôles
  useEffect(() => {
    const adminRoutes = ['/app/depenses', '/app/equipement'];
    if (userRole === 'MEMBRE' && adminRoutes.includes(pathname)) {
      window.location.href = '/app/dashboard';
    }
  }, [pathname, userRole]);

  const isAuth = pathname === '/app/login' || pathname === '/app/register';
  const isLanding = pathname === '/' || pathname === '/a-propos' || pathname === '/contact';

  if (isAuth) return <>{children}</>;

  if (isLanding) {
    return (
      <div style={{ fontFamily: 'Outfit, sans-serif' }}>
        <header style={{ 
          padding: '1.5rem 10%', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          position: 'absolute', 
          width: '100%', 
          zIndex: 100,
          background: pathname === '/' ? 'transparent' : '#022C22'
        }}>
          <Link href="/" style={{ fontSize: '1.8rem', fontWeight: 900, color: '#10B981', textDecoration: 'none' }}>CoopLedger</Link>
          <nav style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}>
            <Link href="/a-propos" style={{ color: 'white', textDecoration: 'none', fontWeight: 600 }}>À Propos</Link>
            <Link href="/contact" style={{ color: 'white', textDecoration: 'none', fontWeight: 600 }}>Contact</Link>
            <Link href="/app/login" style={{ color: 'white', textDecoration: 'none', fontWeight: 600, border: '1px solid rgba(255,255,255,0.3)', padding: '0.6rem 1.5rem', borderRadius: '12px' }}>Connexion</Link>
            <Link href="/app/register" style={{ background: '#10B981', color: 'white', textDecoration: 'none', fontWeight: 800, padding: '0.6rem 1.5rem', borderRadius: '12px' }}>Rejoindre</Link>
          </nav>
        </header>
        {children}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: darkMode ? '#0F172A' : '#F8FAFC', fontFamily: 'Outfit, sans-serif' }}>
      {/* Sidebar */}
      <aside style={{ 
        width: '280px', 
        background: '#0F172A', 
        color: 'white', 
        padding: '2.5rem 1.5rem',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        height: '100vh',
        zIndex: 100
      }}>
        <div style={{ marginBottom: '4rem', padding: '0 1rem' }}>
          <Link href="/" style={{ fontSize: '1.8rem', fontWeight: 900, color: '#10B981', textDecoration: 'none' }}>CoopLedger</Link>
        </div>

        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {links.filter(link => {
            if (userRole === 'MEMBRE') {
              return ['/app/dashboard', '/app/transactions', '/app/proposals', '/app/settings'].includes(link.href);
            }
            if (userRole === 'TRESORIER') {
              // Le trésorier se concentre sur les finances
              return ['/app/dashboard', '/app/transactions', '/app/depenses', '/app/settings'].includes(link.href);
            }
            // Le Président et les admins voient tout
            return true;
          }).map((link) => {
            const active = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link key={link.href} href={link.href} style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '1rem', 
                padding: '1rem 1.2rem', 
                borderRadius: '16px', 
                textDecoration: 'none',
                color: active ? 'white' : '#94A3B8',
                background: active ? '#10B981' : 'transparent',
                fontWeight: active ? 800 : 600,
                transition: 'all 0.2s'
              }}>
                <Icon size={20} color={active ? 'white' : '#94A3B8'} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div style={{ marginTop: 'auto', background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '24px' }}>
          <p style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: 700, marginBottom: '1rem', textTransform: 'uppercase' }}>Besoin d'aide ?</p>
          <Link href="/contact" style={{ color: 'white', textDecoration: 'none', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            Contacter le Support
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, marginLeft: '280px', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <header style={{ 
          height: '80px', 
          background: darkMode ? '#1E293B' : 'white', 
          borderBottom: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : '#E2E8F0'}`, 
          padding: '0 3rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 90
        }}>
          <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}>
            <Link href="/app/dashboard" style={{ fontWeight: 800, color: pathname === '/app/dashboard' ? (darkMode ? '#F8FAFC' : '#0F172A') : '#64748B', textDecoration: 'none' }}>Aperçu</Link>
            <Link href="/app/transactions" style={{ fontWeight: 800, color: pathname === '/app/transactions' ? (darkMode ? '#F8FAFC' : '#0F172A') : '#64748B', textDecoration: 'none' }}>Registre</Link>
            <Link href="/app/proposals" style={{ fontWeight: 800, color: pathname === '/app/proposals' ? (darkMode ? '#F8FAFC' : '#0F172A') : '#64748B', textDecoration: 'none' }}>Votes</Link>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
             <div style={{ background: darkMode ? 'rgba(255,255,255,0.05)' : '#F1F5F9', padding: '0.6rem 1.2rem', borderRadius: '100px', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                <span style={{ fontSize: '1rem' }}>🔍</span>
                <form onSubmit={(e) => { e.preventDefault(); alert('Recherche sécurisée...'); }} style={{ margin: 0 }}>
                  <input type="text" placeholder="Rechercher..." style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.9rem', fontWeight: 600, width: '150px', color: darkMode ? 'white' : 'inherit' }} />
                </form>
             </div>
             
             <button 
                onClick={() => setDarkMode(!darkMode)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', padding: '0.5rem' }}
                title="Basculer le mode sombre/clair"
             >
               {darkMode ? '☀️' : '🌙'}
             </button>

             <div style={{ position: 'relative', cursor: 'pointer' }}>
               <IconBell color={darkMode ? '#94A3B8' : '#64748B'} size={24} />
               <div style={{ position: 'absolute', top: '-2px', right: '-2px', width: '10px', height: '10px', background: '#EF4444', borderRadius: '50%', border: '2px solid white' }} />
             </div>

             <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.4rem 0.4rem 0.4rem 1.2rem', background: darkMode ? 'rgba(255,255,255,0.05)' : '#F8FAFC', borderRadius: '100px', border: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : '#E2E8F0'}` }}>
               <div style={{ textAlign: 'right', marginRight: '0.5rem' }}>
                 <p style={{ fontWeight: 800, color: darkMode ? 'white' : '#0F172A', fontSize: '0.9rem', margin: 0 }}>{userName}</p>
                 <p style={{ fontWeight: 700, color: '#10B981', fontSize: '0.65rem', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{userRole}</p>
               </div>
               <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 900 }}>
                 {userName.charAt(0)}
               </div>
             </div>

          </div>
        </header>

        <div style={{ padding: '3rem', flex: 1 }}>
          {children}
        </div>
      </main>
    </div>
  );
}

