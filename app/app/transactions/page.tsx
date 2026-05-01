'use client';
import { useEffect, useState } from 'react';
import { IconShield } from '@/components/Icons';

export default function Transactions() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/transactions')
      .then(res => res.json())
      .then(data => {
        setTransactions(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: '#059669', fontWeight: 800 }}>Vérification des preuves blockchain...</div>;

  return (
    <div style={{ padding: '1rem 0' }}>
      
      <div style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2.8rem', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.02em' }}>Registre <span style={{ color: '#059669' }}>Blockchain</span></h1>
          <p style={{ color: '#64748B', fontSize: '1.1rem', marginTop: '0.4rem' }}>Historique inaltérable et transparent de toutes les opérations financières</p>
        </div>
        <div style={{ background: '#DCFCE7', color: '#059669', padding: '0.8rem 1.5rem', borderRadius: '12px', fontWeight: 800, border: '1px solid #05966930', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <IconShield size={20} /> SYSTÈME SÉCURISÉ
        </div>
      </div>

      <div style={{ background: 'white', borderRadius: '32px', padding: '2.5rem', boxShadow: '0 10px 30px -5px rgba(0,0,0,0.05)', border: '1px solid #F1F5F9', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #F1F5F9' }}>
                <th style={{ textAlign: 'left', padding: '1.2rem', color: '#64748B', fontWeight: 800, fontSize: '0.85rem' }}>DATE</th>
                <th style={{ textAlign: 'left', padding: '1.2rem', color: '#64748B', fontWeight: 800, fontSize: '0.85rem' }}>DESCRIPTION</th>
                <th style={{ textAlign: 'center', padding: '1.2rem', color: '#64748B', fontWeight: 800, fontSize: '0.85rem' }}>CATÉGORIE</th>
                <th style={{ textAlign: 'right', padding: '1.2rem', color: '#64748B', fontWeight: 800, fontSize: '0.85rem' }}>MONTANT</th>
                <th style={{ textAlign: 'center', padding: '1.2rem', color: '#64748B', fontWeight: 800, fontSize: '0.85rem' }}>STATUT</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '1.5rem', color: '#475569', fontSize: '0.95rem', fontWeight: 600 }}>{t.date}</td>
                  <td style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                      <span style={{ fontWeight: 800, color: '#0F172A', fontSize: '1.05rem' }}>{t.description}</span>
                      <code style={{ fontSize: '0.7rem', color: '#94A3B8' }}>{t.txHash}</code>
                    </div>
                  </td>
                  <td style={{ padding: '1.5rem', textAlign: 'center' }}>
                    <span style={{ background: '#F1F5F9', color: '#475569', padding: '0.4rem 0.8rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 800 }}>
                      {t.category.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: '1.5rem', textAlign: 'right', fontWeight: 900, color: t.type === 'credit' ? '#059669' : '#DC2626', fontSize: '1.1rem' }}>
                    {t.type === 'credit' ? '+' : '-'}{t.amount.toLocaleString()} <span style={{ fontSize: '0.7rem', opacity: 0.6 }}>FCFA</span>
                  </td>
                  <td style={{ padding: '1.5rem', textAlign: 'center' }}>
                    <div style={{ 
                      display: 'inline-flex', alignItems: 'center', gap: '0.5rem', 
                      background: '#1E3A8A10', padding: '0.5rem 1rem', borderRadius: '100px', 
                      color: '#1E3A8A', fontSize: '0.75rem', fontWeight: 900
                    }}>
                      <IconShield size={14} /> CERTIFIÉ
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

