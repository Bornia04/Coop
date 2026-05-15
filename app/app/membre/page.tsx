'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { IconTractor, IconShield, IconBell } from '@/components/Icons';

export default function MembreView() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [proposals, setProposals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = () => {
    Promise.all([
      fetch('/api/transactions').then(res => res.json()),
      fetch('/api/proposals').then(res => res.json())
    ]).then(([txData, propData]) => {
      setTransactions(txData);
      setProposals(propData);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div style={{ padding: '2rem' }}>Chargement...</div>;

  const totalRevenue = transactions.filter(t => t.type === 'credit').reduce((acc: number, t: any) => acc + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'debit').reduce((acc: number, t: any) => acc + t.amount, 0);
  const balance = totalRevenue - totalExpenses;

  return (
    <div style={{ background: '#F8FAFC', minHeight: '100vh', paddingBottom: '100px', display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: '450px', background: 'white', minHeight: '100vh', position: 'relative', boxShadow: '0 0 40px rgba(0,0,0,0.1)' }}>
        
        {/* Header */}
        <header style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, color: 'var(--ve-green)', fontSize: '1.25rem' }}>
             <IconTractor size={24} /> CoopLedger
           </div>
           <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
             <IconBell color="var(--ve-text-muted)" />
             <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#E2E8F0', overflow: 'hidden' }}>
               <img src="https://ui-avatars.com/api/?name=Jean+Dupont&background=15803D&color=fff" alt="User" />
             </div>
           </div>
        </header>

        {/* Balance Card */}
        <div style={{ padding: '0 1.5rem 1.5rem' }}>
          <div style={{ background: 'var(--ve-green)', borderRadius: '24px', padding: '2rem', color: 'white' }}>
             <p style={{ fontSize: '0.8rem', fontWeight: 700, opacity: 0.8, textTransform: 'uppercase', letterSpacing: '1px' }}>SOLDE DISPONIBLE</p>
             <h2 style={{ fontSize: '2.5rem', fontWeight: 800, margin: '0.5rem 0' }}>{balance.toLocaleString()} FCFA</h2>
             <p style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, marginTop: '1rem', fontSize: '0.9rem' }}>
                <IconShield size={14} color="white" /> Membre Platine
             </p>
          </div>
        </div>

        {/* Transactions Section */}
        <section style={{ padding: '0 1.5rem 2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Transactions en Temps Réel</h3>
            <Link href="/app/transactions" style={{ color: 'var(--ve-green)', fontWeight: 800 }}>Voir Tout</Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {transactions.slice(0, 3).map((t, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: '#F8FAFC', borderRadius: '20px' }}>
                <div style={{ background: 'white', width: '48px', height: '48px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>{t.type === 'credit' ? '📈' : '📉'}</div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 800, fontSize: '0.95rem' }}>{t.description}</p>
                  <p style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--ve-text-muted)' }}>{t.category}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontWeight: 800, color: t.type === 'credit' ? '#166534' : '#EF4444' }}>{t.type === 'credit' ? '+' : '-'}{t.amount.toLocaleString()} FCFA</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Vote Card (Dynamic) */}
        {proposals.filter(p => p.status === 'active').map(p => (
          <section key={p.id} style={{ padding: '0 1.5rem 2rem' }}>
            <div style={{ border: '1px solid var(--ve-border)', borderRadius: '24px', padding: '1.5rem' }}>
              <p style={{ fontSize: '0.7rem', color: 'var(--ve-text-muted)', marginBottom: '0.5rem' }}>VOTE COMMUNAUTAIRE</p>
              <h4 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1rem' }}>{p.title}</h4>
              <Link href={`/app/proposals/${p.id}`} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Voter Maintenant</Link>
            </div>
          </section>
        ))}

        {/* Bottom Nav */}
        <nav style={{ position: 'fixed', bottom: 0, width: '100%', maxWidth: '450px', height: '80px', background: 'white', borderTop: '1px solid var(--ve-border)', display: 'flex', justifyContent: 'space-around', alignItems: 'center', zIndex: 100 }}>
           <Link href="/app/membre" style={{ textAlign: 'center', color: 'var(--ve-green)' }}>🏠<p style={{ fontSize: '0.65rem' }}>ACCUEIL</p></Link>
           <Link href="/app/transactions" style={{ textAlign: 'center', color: 'var(--ve-text-muted)' }}>📋<p style={{ fontSize: '0.65rem' }}>ACTIVITÉ</p></Link>
           <Link href="/app/proposals" style={{ textAlign: 'center', color: 'var(--ve-text-muted)' }}>🗳️<p style={{ fontSize: '0.65rem' }}>VOTES</p></Link>
           <Link href="/app/settings" style={{ textAlign: 'center', color: 'var(--ve-text-muted)' }}>👤<p style={{ fontSize: '0.65rem' }}>COMPTE</p></Link>
        </nav>
      </div>
    </div>
  );
}
