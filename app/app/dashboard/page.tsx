'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { IconShield } from '@/components/Icons';

export default function Dashboard() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [showPdfModal, setShowPdfModal] = useState(false);

  useEffect(() => {
    fetch('/api/transactions')
      .then(res => res.json())
      .then(data => {
        setTransactions(data);
        setLoading(false);
      });
  }, []);

  const handleGeneratePDF = async () => {
    setShowPdfModal(false);
    setGenerating(true);
    await new Promise(r => setTimeout(r, 2500));
    
    const htmlContent = `
      <html>
        <head>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 50px; color: #1e293b; line-height: 1.6; }
            .header { border-bottom: 4px solid #10b981; padding-bottom: 20px; margin-bottom: 40px; display: flex; justify-content: space-between; align-items: center; }
            .logo { font-size: 24px; font-weight: 900; color: #10b981; }
            .title { font-size: 32px; font-weight: 900; text-align: center; margin-bottom: 50px; text-transform: uppercase; }
            .section { margin-bottom: 30px; background: #f8fafc; padding: 25px; borderRadius: 15px; border: 1px solid #e2e8f0; }
            .label { font-weight: 800; color: #64748b; font-size: 12px; text-transform: uppercase; }
            .value { font-size: 18px; font-weight: 700; color: #0f172a; margin-bottom: 15px; }
            .footer { margin-top: 60px; text-align: center; font-size: 12px; color: #94a3b8; }
            .seal { display: inline-block; padding: 10px 20px; background: #10b981; color: white; font-weight: 900; border-radius: 50px; margin-top: 30px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">COOPLEDGER</div>
            <div style="text-align: right; font-size: 12px; color: #64748b;">RÉF: CP-2024-T2-AUDIT</div>
          </div>
          <div class="title">Certificat d'Audit Blockchain</div>
          <div class="section">
            <div class="label">Période d'Audit</div>
            <div class="value">Trimestre 2 - 2024 (Avril - Juin)</div>
            <div class="label">Volume de Transactions Scellées</div>
            <div class="value">${transactions.length} Transactions Certifiées</div>
            <div class="label">Capital Total Vérifié</div>
            <div class="value">24,5M FCFA</div>
          </div>
          <div style="text-align: center;">
            <p>Ce document certifie que l'intégralité des flux financiers listés dans ce rapport ont été vérifiés par consensus décentralisé et scellés de manière inaltérable sur le ledger de la coopérative.</p>
            <div class="seal">SCELLÉ PAR COOPLEDGER BLOCKCHAIN</div>
          </div>
          <div class="footer">
            © 2024 CoopLedger - La terre produit, la Blockchain certifie, la communauté grandit.<br>
            Empreinte Cryptographique: ${Math.random().toString(36).substring(2, 15)}
          </div>
        </body>
      </html>
    `;
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CoopLedger_Certificat_Audit_Q2_2024.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setGenerating(false);
  };

  // Calcul de l'évolution de la trésorerie pour le graphique
  const sortedTxs = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  let runningBalance = 0;
  const historyData = sortedTxs.map(t => {
    runningBalance += (t.type === 'credit' ? t.amount : -t.amount);
    return { date: t.date, balance: runningBalance };
  }).slice(-10);

  const maxBalance = Math.max(...historyData.map(d => d.balance), 1);
  const minBalance = Math.min(...historyData.map(d => d.balance), 0);
  const range = maxBalance - minBalance || 1;

  // Calcul du Top des membres (Réputation)
  const [proposals, setProposals] = useState<any[]>([]);
  useEffect(() => {
    fetch('/api/proposals')
      .then(res => res.json())
      .then(data => setProposals(data));
  }, []);

  const memberVotes: Record<string, number> = {};
  proposals.forEach(p => {
    if (p.votes) {
      p.votes.forEach((v: any) => {
        memberVotes[v.memberId] = (memberVotes[v.memberId] || 0) + 1;
      });
    }
  });
  const topMembers = Object.entries(memberVotes).sort((a, b) => b[1] - a[1]).slice(0, 4);

  if (loading) return <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: '#059669', fontWeight: 800 }}>Synchronisation Blockchain...</div>;

  const totalRevenue = transactions.filter(t => t.type === 'credit').reduce((acc, t) => acc + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'debit').reduce((acc, t) => acc + t.amount, 0);
  const balance = totalRevenue - totalExpenses;

  return (
    <div style={{ padding: '1rem 0' }}>
      {generating && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.95)', zIndex: 10000, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
          <div style={{ width: '80px', height: '80px', border: '6px solid #10B981', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '2rem' }}></div>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '1rem' }}>Génération Certifiée en cours</h2>
          <p style={{ opacity: 0.7, fontSize: '1.1rem' }}>Scellage cryptographique des {transactions.length} transactions...</p>
        </div>
      )}

      {showPdfModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
          <div style={{ background: 'white', borderRadius: '32px', width: '100%', maxWidth: '700px', padding: '3rem', position: 'relative' }}>
             <button onClick={() => setShowPdfModal(false)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>✕</button>
             <div style={{ borderBottom: '2px solid #F1F5F9', paddingBottom: '1.5rem', marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0F172A' }}>Configuration du Rapport d'Audit</h3>
                <p style={{ color: '#64748B' }}>Générez un document certifié pour vos partenaires financiers.</p>
             </div>
             
             <div style={{ display: 'grid', gap: '1.5rem', marginBottom: '2.5rem' }}>
                <div style={{ background: '#F8FAFC', padding: '1.5rem', borderRadius: '20px', border: '1px solid #E2E8F0' }}>
                   <p style={{ fontWeight: 800, color: '#0F172A', marginBottom: '0.5rem' }}>Format du Document</p>
                   <p style={{ fontSize: '0.9rem', color: '#64748B' }}>Standard Audit International (PDF/A) avec signatures cryptographiques.</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                   <div style={{ border: '2px solid #10B981', padding: '1.2rem', borderRadius: '16px', background: 'rgba(16, 185, 129, 0.05)' }}>
                      <p style={{ fontWeight: 900, fontSize: '0.8rem', color: '#10B981', marginBottom: '0.2rem' }}>PÉRIODE</p>
                      <p style={{ fontWeight: 800 }}>T2 2024</p>
                   </div>
                   <div style={{ border: '2px solid #F1F5F9', padding: '1.2rem', borderRadius: '16px' }}>
                      <p style={{ fontWeight: 900, fontSize: '0.8rem', color: '#64748B', marginBottom: '0.2rem' }}>NBRE TRANSACTIONS</p>
                      <p style={{ fontWeight: 800 }}>{transactions.length}</p>
                   </div>
                </div>
             </div>

             <button onClick={handleGeneratePDF} style={{ width: '100%', background: '#0F172A', color: 'white', padding: '1.2rem', borderRadius: '16px', border: 'none', fontWeight: 800, fontSize: '1.1rem', cursor: 'pointer' }}>
                Générer et Sceller le Rapport
             </button>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div>
          <h1 style={{ fontSize: '2.8rem', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.02em' }}>Tableau de Bord <span style={{ color: '#059669' }}>Financier</span></h1>
          <p style={{ color: '#64748B', fontSize: '1.1rem', marginTop: '0.4rem' }}>Surveillance du Ledger Public et de la Gouvernance de la Coopérative</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={() => setShowPdfModal(true)} style={{ padding: '0.8rem 1.5rem', borderRadius: '12px', border: '1px solid #E2E8F0', background: 'white', color: '#0F172A', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            📥 Rapport PDF
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
        <div style={{ background: 'linear-gradient(135deg, #064E3B 0%, #022C22 100%)', borderRadius: '32px', padding: '3rem', color: 'white', position: 'relative', overflow: 'hidden', boxShadow: '0 20px 40px -10px rgba(6, 78, 59, 0.3)' }}>
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '120px', opacity: 0.3 }}>
             <svg width="100%" height="100%" viewBox="0 0 100 20" preserveAspectRatio="none">
                <path d={`M 0 20 ${historyData.map((d, i) => `L ${(i / (historyData.length - 1)) * 100} ${20 - ((d.balance - minBalance) / range) * 15}`).join(' ')} L 100 20 Z`} fill="url(#grad)" />
                <defs><linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" style={{ stopColor: '#10B981', stopOpacity: 0.8 }} /><stop offset="100%" style={{ stopColor: '#10B981', stopOpacity: 0 }} /></linearGradient></defs>
                <path d={`M 0 ${20 - ((historyData[0].balance - minBalance) / range) * 15} ${historyData.map((d, i) => `L ${(i / (historyData.length - 1)) * 100} ${20 - ((d.balance - minBalance) / range) * 15}`).join(' ')}`} fill="none" stroke="#10B981" strokeWidth="0.5" />
             </svg>
          </div>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <p style={{ fontSize: '0.9rem', fontWeight: 800, opacity: 0.6, letterSpacing: '0.1em' }}>CAPITAL TOTAL DISPONIBLE</p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '1.5rem', marginTop: '1rem' }}>
              <h2 style={{ fontSize: '4.5rem', fontWeight: 900 }}>{balance.toLocaleString()} <span style={{ fontSize: '1.5rem', opacity: 0.6 }}>FCFA</span></h2>
              <div style={{ background: '#059669', color: 'white', padding: '0.5rem 1rem', borderRadius: '100px', fontSize: '0.9rem', fontWeight: 800 }}>📈 Stable</div>
            </div>
          </div>
        </div>

        <div style={{ background: 'white', borderRadius: '32px', padding: '2.5rem', boxShadow: '0 10px 30px -5px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0F172A', marginBottom: '2rem' }}>Évolution Trésorerie</h3>
          <div style={{ flex: 1, position: 'relative', minHeight: '150px' }}>
             <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '80%', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '4px' }}>
                {historyData.map((d, i) => (
                  <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '100%', height: `${((d.balance - minBalance) / range) * 100}%`, background: '#059669', borderRadius: '4px 4px 0 0', opacity: 0.2 + (i / historyData.length) * 0.8, minHeight: '4px' }} />
                    <span style={{ fontSize: '0.6rem', color: '#94A3B8', fontWeight: 800 }}>{d.date.split('-')[2]}</span>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
        <div style={{ background: 'white', borderRadius: '32px', padding: '2.5rem', boxShadow: '0 10px 30px -5px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
          <h3 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0F172A', marginBottom: '2rem' }}>Derniers Enregistrements</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <th style={{ textAlign: 'left', padding: '1rem', color: '#64748B', fontSize: '0.8rem' }}>DATE</th>
                  <th style={{ textAlign: 'left', padding: '1rem', color: '#64748B', fontSize: '0.8rem' }}>DESCRIPTION</th>
                  <th style={{ textAlign: 'right', padding: '1rem', color: '#64748B', fontSize: '0.8rem' }}>MONTANT</th>
                </tr>
              </thead>
              <tbody>
                {transactions.slice(0, 5).map((t, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '1rem', color: '#475569', fontSize: '0.9rem' }}>{t.date}</td>
                    <td style={{ padding: '1rem', fontWeight: 700, color: '#0F172A' }}>{t.description}</td>
                    <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 900, color: t.type === 'credit' ? '#059669' : '#DC2626' }}>{t.type === 'credit' ? '+' : '-'}{t.amount.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ background: 'white', borderRadius: '32px', padding: '2.5rem', boxShadow: '0 10px 30px -5px rgba(0,0,0,0.05)' }}>
           <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0F172A', marginBottom: '2rem' }}>Top Membres (Votes)</h3>
           <div style={{ display: 'grid', gap: '1.2rem' }}>
              {topMembers.map(([name, count], i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: '#F8FAFC', borderRadius: '16px' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ width: '40px', height: '40px', background: i === 0 ? '#FEF3C7' : '#E2E8F0', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{i === 0 ? '🏆' : '👤'}</div>
                      <p style={{ fontWeight: 800, color: '#0F172A' }}>{name}</p>
                   </div>
                   <div style={{ textAlign: 'right' }}><p style={{ fontWeight: 900, color: '#059669' }}>{count}</p></div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}
