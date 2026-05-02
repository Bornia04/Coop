'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { type Proposal } from '@/lib/db';
import { IconShield, IconClock } from '@/components/Icons';

function CountdownTimer({ expiresAt, onEnd }: { expiresAt: string; onEnd: () => void }) {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const end = new Date(expiresAt).getTime();
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft('EXPIRÉ');
        onEnd();
        clearInterval(timer);
      } else {
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft(`${mins}:${secs < 10 ? '0' : ''}${secs}`);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [expiresAt, onEnd]);

  return (
    <span style={{ color: '#EF4444', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
      <IconClock size={12} /> {timeLeft}
    </span>
  );
}

export default function Proposals() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProposals = () => {
    fetch('/api/proposals')
      .then(res => res.json())
      .then(data => {
        setProposals(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProposals();
    const interval = setInterval(fetchProposals, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: '#059669', fontWeight: 800 }}>Chargement de la Gouvernance...</div>;

  return (
    <div style={{ padding: '1rem 0' }}>
      
      <div style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2.8rem', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.02em' }}>Gouvernance <span style={{ color: '#059669' }}>Participative</span></h1>
          <p style={{ color: '#64748B', fontSize: '1.1rem', marginTop: '0.4rem' }}>Prenez part aux décisions stratégiques via le vote sécurisé blockchain</p>
        </div>
        <Link href="/app/proposals/new" style={{ background: '#059669', color: 'white', padding: '1rem 2rem', borderRadius: '16px', fontWeight: 800, textDecoration: 'none', boxShadow: '0 10px 20px -5px rgba(5, 150, 105, 0.3)' }}>
          + Créer une Proposition
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
        {proposals.map((v) => {
          const total = v.votesFor + v.votesAgainst;
          const pct = total > 0 ? Math.round((v.votesFor / total) * 100) : 0;
          const isActive = v.status === 'active';
          
          return (
            <div key={v.id} style={{ 
              background: 'white', 
              padding: '2.5rem', 
              borderRadius: '32px', 
              boxShadow: '0 10px 30px -5px rgba(0,0,0,0.05)',
              border: isActive ? '2px solid #059669' : '1px solid #F1F5F9',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                  <span style={{ 
                    background: isActive ? '#DCFCE7' : (v.status === 'approved' ? '#DCFCE7' : '#FEF2F2'), 
                    color: isActive ? '#059669' : (v.status === 'approved' ? '#059669' : '#EF4444'), 
                    padding: '0.5rem 1.2rem', 
                    borderRadius: '100px', 
                    fontSize: '0.8rem', 
                    fontWeight: 900,
                    letterSpacing: '0.05em'
                  }}>
                    {v.status.toUpperCase()}
                  </span>
                  {isActive && <CountdownTimer expiresAt={v.expiresAt} onEnd={fetchProposals} />}
                </div>
                <IconShield size={24} color={isActive ? '#059669' : '#94A3B8'} />
              </div>

              <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0F172A', marginBottom: '2.5rem', height: '3.5rem', overflow: 'hidden', lineHeight: 1.3 }}>{v.title}</h3>
              
              <div style={{ marginBottom: '2.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', fontWeight: 800, marginBottom: '0.8rem' }}>
                  <span style={{ color: '#64748B' }}>PROGRESSION</span>
                  <span style={{ color: '#0F172A' }}>{pct}% POUR</span>
                </div>
                <div style={{ height: '10px', background: '#F1F5F9', borderRadius: '100px', overflow: 'hidden' }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: isActive ? '#059669' : (v.status === 'approved' ? '#059669' : '#EF4444'), borderRadius: '100px' }}></div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', fontSize: '0.8rem', fontWeight: 700, color: '#94A3B8' }}>
                  <span>{total} MEMBRES ONT VOTÉ</span>
                  <span>{isActive ? 'EN COURS' : 'TERMINÉ'}</span>
                </div>
              </div>
              
              <Link href={`/app/proposals/${v.id}`} style={{ 
                width: '100%', 
                padding: '1.2rem', 
                borderRadius: '16px', 
                border: `2px solid ${isActive ? '#059669' : '#E2E8F0'}`, 
                background: 'white', 
                color: isActive ? '#059669' : '#0F172A', 
                fontWeight: 800, 
                textDecoration: 'none',
                display: 'flex',
                justifyContent: 'center',
                transition: 'all 0.2s'
              }}>
                {isActive ? 'Voter Maintenant' : 'Consulter le Résultat'}
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}

