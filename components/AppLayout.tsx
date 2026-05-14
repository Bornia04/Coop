'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { 
  IconDashboard, IconTransactions, IconDepenses, IconGouvernance, 
  IconEquipement, IconSettings, IconBell, IconArrowRight, IconShield 
} from './Icons';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [userName, setUserName] = useState('Utilisateur');
  const [userRole, setUserRole] = useState('membre');
  const [isLoaded, setIsLoaded] = useState(false);

  const links = [
    { href: '/app/dashboard', label: 'Tableau de bord', icon: IconDashboard, roles: ['president', 'tresorier', 'membre'] },
    { href: '/app/transactions', label: 'Transactions', icon: IconTransactions, roles: ['president', 'tresorier', 'membre'] },
    { href: '/app/proposals', label: 'Gouvernance', icon: IconGouvernance, roles: ['president', 'tresorier', 'membre'] },
    { href: '/app/cotisations/new', label: 'Cotisations', icon: IconArrowRight, roles: ['tresorier', 'president'] },
    { href: '/app/expenses/new', label: 'Dépenses', icon: IconDepenses, roles: ['tresorier', 'president'] },
    { href: '/app/equipement', label: 'Équipement', icon: IconEquipement, roles: ['president', 'tresorier', 'membre'] },
    { href: '/app/admin/validate', label: 'Multi-Sig', icon: IconShield, roles: ['president'] },
    { href: '/app/settings', label: 'Paramètres', icon: IconSettings, roles: ['president', 'tresorier', 'membre'] },
  ];

  const isAuthPage = pathname === '/app/login' || pathname === '/app/register';

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;

    if (!token && !isAuthPage) {
      window.location.href = '/app/login';
      return;
    }

    try {
      const name = localStorage.getItem('user_name');
      const role = localStorage.getItem('user_role');
      if (name) setUserName(name);
      if (role) setUserRole(role);
    } catch (e) {
      console.error("Auth initialization error:", e);
    } finally {
      setIsLoaded(true);
    }
  }, [pathname, isAuthPage]);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/app/login';
  };

  if (isAuthPage) return <>{children}</>;
  
  if (!isLoaded) return null; // On ne montre rien du tout tant qu'on n'est pas sûr de l'identité

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar Élégante */}
      <aside className="w-72 bg-[#020617] text-white flex flex-col fixed h-screen z-50 shadow-2xl">
        <div className="p-8">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
               <IconShield size={24} color="white" />
            </div>
            <span className="text-xl font-black tracking-tighter">CoopLedger</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          <p className="px-4 text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] mb-4">Menu Principal</p>
          {links.filter(l => l.roles.includes(userRole.toLowerCase())).map((link) => {
            const active = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link key={link.href} href={link.href} className="block">
                <div className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group ${active ? 'bg-primary text-white font-bold shadow-lg shadow-primary/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                  <Icon size={20} className={active ? 'text-white' : 'group-hover:text-primary'} />
                  <span className="text-sm font-medium tracking-tight">{link.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-6 mt-auto">
          <div className="bg-white/5 p-4 rounded-2xl border border-white/5 mb-4">
             <div className="flex items-center gap-3 mb-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Blockchain Sync</span>
             </div>
             <p className="text-[10px] text-slate-500 leading-tight">Nœud local actif. Transactions scellées par SHA-256.</p>
          </div>
          <Button 
            onClick={handleLogout}
            variant="ghost" 
            className="w-full justify-start text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl"
          >
            Déconnexion
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 ml-72 flex flex-col min-h-screen">
        {/* Navbar Supérieure */}
        <header className="h-20 bg-white/70 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-40 px-10 flex items-center justify-between">
           <div>
             <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest">
               {links.find(l => l.href === pathname)?.label || 'Aperçu'}
             </h2>
           </div>

           <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full">
                 <div className="w-2 h-2 bg-primary rounded-full"></div>
                 <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tighter">Demo Mode</span>
              </div>

              <button className="relative text-slate-400 hover:text-primary transition-colors">
                 <IconBell size={22} />
                 <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-[8px] font-bold text-white rounded-full flex items-center justify-center">3</span>
              </button>
              
              <div className="flex items-center gap-4 pl-6 border-l border-slate-200">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-slate-900 leading-none">{userName}</p>
                  <p className="text-[10px] font-black text-primary uppercase tracking-widest mt-1">{userRole}</p>
                </div>
                <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black text-sm shadow-xl shadow-slate-900/10">
                  {userName?.[0] || 'U'}
                </div>
              </div>
           </div>
        </header>

        {/* Page Content */}
        <main className="p-10 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
