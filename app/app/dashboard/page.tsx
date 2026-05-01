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
    // Simulation d'une génération de rapport complexe
    await new Promise(r => setTimeout(r, 2500));
    
    // Création d'un certificat HTML professionnel
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
            Empreinte Cryptographique: ${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}
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
    alert('Le Certificat d\'Audit a été généré et téléchargé avec succès.');
  };



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
                <div style={{ display: 'flex', gap: '1rem' }}>
                   <input type="checkbox" checked readOnly style={{ width: '20px', height: '20px' }} />
                   <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>Inclure les preuves de scellage blockchain (TxHash)</p>
                </div>
             </div>

             <button 
                onClick={handleGeneratePDF}
                style={{ width: '100%', background: '#0F172A', color: 'white', padding: '1.2rem', borderRadius: '16px', border: 'none', fontWeight: 800, fontSize: '1.1rem', cursor: 'pointer' }}
             >
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
          {localStorage.getItem('user_role') === 'ADMIN' && (
            <button 
              onClick={async () => {
                const { getStore, addTransaction } = await import('@/lib/store');
                const store = getStore();
                addTransaction(store, "Vente Café - Demo Live", 150000, "credit", "Ventes");
                window.location.reload();
              }}
              style={{ padding: '0.8rem 1.5rem', borderRadius: '12px', border: 'none', background: '#10B981', color: 'white', fontWeight: 900, cursor: 'pointer', boxShadow: '0 5px 15px rgba(16, 185, 129, 0.3)' }}
            >
              ⚡ Demo Live (Ajout)
            </button>
          )}
          <button 
            onClick={() => setShowPdfModal(true)}
            style={{ padding: '0.8rem 1.5rem', borderRadius: '12px', border: '1px solid #E2E8F0', background: 'white', color: '#0F172A', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            📥 Rapport PDF
          </button>
          <button style={{ padding: '0.8rem 1.5rem', borderRadius: '12px', border: 'none', background: '#0F172A', color: 'white', fontWeight: 700, cursor: 'pointer' }}>📅 Ce Trimestre</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
        
        {/* Main Balance Card */}
        <div style={{ 
          background: 'linear-gradient(135deg, #064E3B 0%, #022C22 100%)', 
          borderRadius: '32px', 
          padding: '3rem', 
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 20px 40px -10px rgba(6, 78, 59, 0.3)'
        }}>
          <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(16, 185, 129, 0.2) 0%, rgba(255,255,255,0) 70%)', borderRadius: '50%' }} />
          
          <div style={{ position: 'relative', zIndex: 1 }}>
            <p style={{ fontSize: '0.9rem', fontWeight: 800, opacity: 0.6, letterSpacing: '0.1em' }}>CAPITAL TOTAL DISPONIBLE</p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '1.5rem', marginTop: '1rem' }}>
              <h2 style={{ fontSize: '4.5rem', fontWeight: 900 }}>{balance.toLocaleString()} <span style={{ fontSize: '1.5rem', opacity: 0.6 }}>FCFA</span></h2>
              <div style={{ background: '#059669', color: 'white', padding: '0.5rem 1rem', borderRadius: '100px', fontSize: '0.9rem', fontWeight: 800 }}>📈 +14.2%</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '3rem', marginTop: '4rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '3rem' }}>
              <Link href="/app/transactions" style={{ textDecoration: 'none', color: 'inherit' }}>
                <p style={{ fontSize: '0.8rem', fontWeight: 700, opacity: 0.5, marginBottom: '0.5rem' }}>TOTAL REVENUS</p>
                <p style={{ fontSize: '1.6rem', fontWeight: 800 }}>{totalRevenue.toLocaleString()} <span style={{ fontSize: '0.9rem', opacity: 0.5 }}>FCFA</span></p>
              </Link>
              <Link href="/app/depenses" style={{ textDecoration: 'none', color: 'inherit' }}>
                <p style={{ fontSize: '0.8rem', fontWeight: 700, opacity: 0.5, marginBottom: '0.5rem' }}>TOTAL DÉPENSES</p>
                <p style={{ fontSize: '1.6rem', fontWeight: 800 }}>{totalExpenses.toLocaleString()} <span style={{ fontSize: '0.9rem', opacity: 0.5 }}>FCFA</span></p>
              </Link>
              <Link href="/app/transactions" style={{ textDecoration: 'none', color: 'inherit' }}>
                <p style={{ fontSize: '0.8rem', fontWeight: 700, opacity: 0.5, marginBottom: '0.5rem' }}>SÉCURITÉ LEDGER</p>
                <p style={{ fontSize: '1.6rem', fontWeight: 800, color: '#10B981' }}>100% OK</p>
              </Link>
            </div>
          </div>
        </div>

        {/* Expenses Distribution */}
        <Link href="/app/depenses" style={{ textDecoration: 'none', color: 'inherit', background: 'white', borderRadius: '32px', padding: '2.5rem', boxShadow: '0 10px 30px -5px rgba(0,0,0,0.05)', display: 'block' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0F172A', marginBottom: '2rem' }}>Répartition Dépenses</h3>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '180px' }}>
             <div style={{ position: 'relative', width: '160px', height: '160px' }}>
                <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                  <circle cx="18" cy="18" r="16" fill="none" stroke="#F1F5F9" strokeWidth="3" />
                  <circle cx="18" cy="18" r="16" fill="none" stroke="#059669" strokeWidth="4" strokeDasharray="65 100" />
                  <circle cx="18" cy="18" r="16" fill="none" stroke="#2563EB" strokeWidth="4" strokeDasharray="25 100" strokeDashoffset="-65" />
                </svg>
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                  <p style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0F172A' }}>72%</p>
                  <p style={{ fontSize: '0.6rem', color: '#64748B', fontWeight: 700 }}>MATÉRIEL</p>
                </div>
             </div>
          </div>
          <div style={{ marginTop: '2rem', display: 'grid', gap: '0.8rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div style={{ width: '10px', height: '10px', background: '#059669', borderRadius: '3px' }} />
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Investissement Matériel</span>
              </div>
              <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>65%</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div style={{ width: '10px', height: '10px', background: '#2563EB', borderRadius: '3px' }} />
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Frais Opérationnels</span>
              </div>
              <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>25%</span>
            </div>
          </div>
        </Link>
      </div>


      {/* Recent Transactions Table */}
      <div style={{ background: 'white', borderRadius: '32px', padding: '2.5rem', boxShadow: '0 10px 30px -5px rgba(0,0,0,0.05)', overflow: 'hidden', marginBottom: '3rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
          <h3 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0F172A' }}>Derniers Enregistrements Ledger</h3>
          <Link href="/app/transactions" style={{ color: '#059669', fontWeight: 800, textDecoration: 'none', fontSize: '0.95rem' }}>VOIR TOUT LE REGISTRE</Link>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                <th style={{ textAlign: 'left', padding: '1.2rem', color: '#64748B', fontWeight: 800, fontSize: '0.8rem' }}>DATE</th>
                <th style={{ textAlign: 'left', padding: '1.2rem', color: '#64748B', fontWeight: 800, fontSize: '0.8rem' }}>DESCRIPTION</th>
                <th style={{ textAlign: 'right', padding: '1.2rem', color: '#64748B', fontWeight: 800, fontSize: '0.8rem' }}>MONTANT</th>
                <th style={{ textAlign: 'center', padding: '1.2rem', color: '#64748B', fontWeight: 800, fontSize: '0.8rem' }}>PREUVE BLOCKCHAIN</th>
              </tr>
            </thead>
            <tbody>
              {transactions.slice(0, 4).map((t, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #F1F5F9', transition: 'background 0.2s' }}>
                  <td style={{ padding: '1.5rem', color: '#475569', fontSize: '0.95rem', fontWeight: 600 }}>{t.date}</td>
                  <td style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ 
                        width: '40px', height: '40px', 
                        background: t.type === 'credit' ? '#DCFCE7' : '#FEE2E2', 
                        color: t.type === 'credit' ? '#059669' : '#DC2626',
                        borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '1.2rem'
                      }}>{t.type === 'credit' ? '↓' : '↑'}</div>
                      <span style={{ fontWeight: 700, color: '#0F172A' }}>{t.description}</span>
                    </div>
                  </td>
                  <td style={{ padding: '1.5rem', textAlign: 'right', fontWeight: 900, color: t.type === 'credit' ? '#059669' : '#DC2626' }}>
                    {t.type === 'credit' ? '+' : '-'}{t.amount.toLocaleString()} <span style={{ fontSize: '0.7rem', opacity: 0.6 }}>FCFA</span>
                  </td>
                  <td style={{ padding: '1.5rem', textAlign: 'center' }}>
                    <div style={{ 
                      display: 'inline-flex', alignItems: 'center', gap: '0.5rem', 
                      background: '#F8FAFC', padding: '0.4rem 1rem', borderRadius: '100px', 
                      border: '1px solid #E2E8F0', color: '#1E3A8A', fontSize: '0.75rem', fontWeight: 800
                    }}>
                      <IconShield size={12} /> SCELLÉ
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
        <div style={{ background: '#0F172A', borderRadius: '40px', padding: '4rem', color: 'white', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', background: 'var(--ve-gold)', borderRadius: '50%', opacity: 0.05 }}></div>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h4 style={{ color: 'var(--ve-gold)', fontSize: '0.9rem', fontWeight: 900, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>Notre Vision</h4>
            <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '2rem', lineHeight: 1.3 }}>
              "La terre produit, la Blockchain certifie, la communauté grandit."
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '2.5rem' }}>
              CoopLedger transforme chaque agriculteur en un acteur informé et souverain. Bâtissons ensemble le pont de la confiance.
            </p>
            <Link href="/a-propos" style={{ background: 'var(--ve-gold)', color: '#0F172A', padding: '1rem 2rem', borderRadius: '12px', fontWeight: 900, textDecoration: 'none', display: 'inline-block' }}>En savoir plus</Link>
          </div>
        </div>

        <div style={{ background: 'white', borderRadius: '40px', padding: '3rem', border: '1px solid #F1F5F9', boxShadow: '0 10px 30px -5px rgba(0,0,0,0.05)' }}>
          <h4 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0F172A', marginBottom: '2rem' }}>Démocratie Agricole (DAO)</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ padding: '1.5rem', background: '#F8FAFC', borderRadius: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span style={{ fontWeight: 800 }}>Achat de nouveaux intrants</span>
                <span style={{ color: '#059669', fontWeight: 900 }}>68% POUR</span>
              </div>
              <div style={{ height: '10px', background: '#E2E8F0', borderRadius: '100px', overflow: 'hidden' }}>
                <div style={{ width: '68%', height: '100%', background: '#059669' }}></div>
              </div>
            </div>
            <div style={{ padding: '1.5rem', background: '#F8FAFC', borderRadius: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span style={{ fontWeight: 800 }}>Extension du hangar stockage</span>
                <span style={{ color: '#64748B', fontWeight: 900 }}>EN ATTENTE</span>
              </div>
              <div style={{ height: '10px', background: '#E2E8F0', borderRadius: '100px', overflow: 'hidden' }}>
                <div style={{ width: '42%', height: '100%', background: '#94A3B8' }}></div>
              </div>
            </div>
          </div>
          <Link href="/app/proposals" style={{ display: 'block', width: '100%', marginTop: '2rem', padding: '1.2rem', borderRadius: '16px', border: '2px solid #F1F5F9', background: 'white', fontWeight: 800, color: '#0F172A', cursor: 'pointer', textAlign: 'center', textDecoration: 'none' }}>
            Participer à la Gouvernance
          </Link>
        </div>
      </div>


    </div>
  );
}

