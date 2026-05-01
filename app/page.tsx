'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { IconShield, IconArrowRight } from '@/components/Icons';

export default function Home() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [proposals, setProposals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/transactions').then(res => res.json()),
      fetch('/api/proposals').then(res => res.json())
    ]).then(([txs, props]) => {
      setTransactions(txs);
      setProposals(props);
      setLoading(false);
    });
  }, []);

  if (loading) return <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC', color: 'var(--ve-green)', fontSize: '1.2rem', fontWeight: 800 }}>Initialisation du Ledger...</div>;

  return (
    <div style={{ background: '#F8FAFC', minHeight: '100vh', fontFamily: 'Outfit, sans-serif' }}>
      
      {/* Hero Section */}
      <section style={{ 
        padding: '120px 10%', 
        background: 'linear-gradient(135deg, #064E3B 0%, #022C22 100%)', 
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(16, 185, 129, 0.2) 0%, rgba(255,255,255,0) 70%)', borderRadius: '50%' }} />
        
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '4rem', alignItems: 'center', position: 'relative', zIndex: 1 }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.8rem', background: 'rgba(255,255,255,0.1)', padding: '0.5rem 1.2rem', borderRadius: '100px', border: '1px solid rgba(255,255,255,0.2)', marginBottom: '2rem' }}>
              <span style={{ color: '#10B981', fontWeight: 900 }}>NEW</span>
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Découvrez la Gouvernance Décentralisée 2.0</span>
            </div>
            <h1 style={{ fontSize: '4.5rem', fontWeight: 900, lineHeight: 1.1, marginBottom: '2rem', letterSpacing: '-0.04em' }}>
              Cultivons la <span style={{ color: '#10B981' }}>Transparence</span> sur la Blockchain
            </h1>
            <p style={{ fontSize: '1.3rem', lineHeight: 1.6, opacity: 0.9, marginBottom: '3rem', maxWidth: '600px' }}>
              CoopLedger transforme la gestion des coopératives agricoles avec un registre inaltérable et une gouvernance participative sécurisée.
            </p>
            <div style={{ display: 'flex', gap: '1.5rem' }}>
              <Link href="/app/dashboard" className="btn-primary" style={{ background: '#10B981', color: 'white', padding: '1.2rem 2.8rem', borderRadius: '16px', fontWeight: 800, fontSize: '1.1rem', border: 'none', transition: 'all 0.3s ease' }}>Lancer l'Application</Link>
              <Link href="/a-propos" style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: 'white', fontWeight: 700, textDecoration: 'none', fontSize: '1.1rem' }}>
                Notre Vision <IconArrowRight size={20} />
              </Link>
            </div>
          </div>
          <div style={{ position: 'relative' }}>
            <div style={{ 
              borderRadius: '32px', 
              overflow: 'hidden', 
              boxShadow: '0 40px 80px -20px rgba(0,0,0,0.5)',
              border: '12px solid rgba(255,255,255,0.05)',
              transform: 'perspective(1000px) rotateY(-5deg)'
            }}>
              <img src="https://images.unsplash.com/photo-1595841696677-6489ff3f8cd1?auto=format&fit=crop&q=80&w=1200" alt="Agriculture" style={{ width: '100%', display: 'block' }} />
            </div>
          </div>
        </div>
      </section>

      <main style={{ padding: '0 10%', marginTop: '-60px', position: 'relative', zIndex: 10 }}>
        
        {/* Stats Preview Card */}
        <div style={{ background: 'white', padding: '3rem', borderRadius: '32px', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.05)', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem', marginBottom: '6rem' }}>
          {[
            { label: 'Capital Total', val: '24,5M FCFA', color: '#059669' },
            { label: 'Membres Actifs', val: '1,240', color: '#2563EB' },
            { label: 'Propositions', val: '12', color: '#7C3AED' },
            { label: 'Transactions/Jour', val: '84', color: '#EA580C' },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: 'center', borderRight: i < 3 ? '1px solid #F1F5F9' : 'none' }}>
              <p style={{ color: '#64748B', fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>{s.label}</p>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0F172A' }}>{s.val}</h3>
            </div>
          ))}
        </div>

        {/* Main Section Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '4rem', marginBottom: '8rem' }}>
          
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
              <div>
                <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#0F172A', marginBottom: '0.5rem' }}>Actualités Récentes</h2>
                <p style={{ color: '#64748B', fontSize: '1.1rem' }}>Restez informé des derniers développements de votre coopérative.</p>
              </div>
              <Link href="/app/dashboard" style={{ color: '#059669', fontWeight: 800, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                VOIR TOUT <IconArrowRight size={18} />
              </Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
              {[
                { cat: 'INFRASTRUCTURE', title: 'Nouveau Silo Connecté', desc: 'Installation réussie des capteurs IoT pour un suivi précis du stock.', img: 'https://images.unsplash.com/photo-1594398059705-7b750106294d?auto=format&fit=crop&q=80&w=600' },
                { cat: 'ÉCONOMIE', title: 'Dividendes 2024', desc: 'Répartition record prévue suite aux excellentes ventes de la saison.', img: 'https://images.unsplash.com/photo-1592424001807-16474fbce44c?auto=format&fit=crop&q=80&w=600' },
                { cat: 'ENVIRONNEMENT', title: 'Certification Bio', desc: 'Obtention du label Bio pour nos 500 hectares de maïs blanc.', img: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=600' },
                { cat: 'MATÉRIEL', title: 'Nouveaux Tracteurs', desc: 'Livraison de deux John Deere 8R pour renforcer notre flotte.', img: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&q=80&w=600' },
              ].map((n, i) => (
                <div key={i} className="card" style={{ padding: 0, overflow: 'hidden', transition: 'transform 0.3s ease' }}>
                  <img src={n.img} alt={n.title} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                  <div style={{ padding: '2rem' }}>
                    <span style={{ color: '#059669', fontSize: '0.75rem', fontWeight: 900, letterSpacing: '0.1em' }}>{n.cat}</span>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0.8rem 0', color: '#0F172A' }}>{n.title}</h3>
                    <p style={{ color: '#64748B', lineHeight: 1.6, fontSize: '0.95rem' }}>{n.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
             <div className="card" style={{ padding: '2.5rem', background: '#0F172A', color: 'white', position: 'sticky', top: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '2rem' }}>
                  <IconShield size={32} color="#10B981" />
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 900 }}>Dernières Preuves</h3>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                  {transactions.slice(0, 5).map((tx, i) => (
                    <div key={i} style={{ padding: '1.2rem', background: 'rgba(255,255,255,0.05)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <p style={{ fontWeight: 700, fontSize: '0.95rem' }}>{tx.description}</p>
                        <span style={{ color: tx.type === 'credit' ? '#10B981' : '#F87171', fontWeight: 900 }}>{tx.type === 'credit' ? '+' : '-'}{tx.amount.toLocaleString()} FCFA</span>
                      </div>
                      <p style={{ fontSize: '0.75rem', color: '#94A3B8', fontFamily: 'monospace' }}>{tx.txHash.slice(0, 20)}...</p>
                    </div>
                  ))}
                </div>

                <Link href="/app/transactions" style={{ display: 'block', marginTop: '2.5rem', textAlign: 'center', color: '#10B981', fontWeight: 800, textDecoration: 'none', border: '2px solid rgba(16, 185, 129, 0.2)', padding: '1rem', borderRadius: '16px' }}>
                  CONSULTER LE LEDGER
                </Link>
             </div>
          </div>

        </div>

        {/* Voting Section */}
        <section style={{ paddingBottom: '8rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '4rem' }}>
            <div>
              <h2 style={{ fontSize: '2.8rem', fontWeight: 900, color: '#0F172A', marginBottom: '0.5rem' }}>Gouvernance Active</h2>
              <p style={{ color: '#64748B', fontSize: '1.2rem', maxWidth: '600px' }}>Exprimez votre voix sur les investissements majeurs. Chaque vote est enregistré de façon permanente.</p>
            </div>
            <Link href="/app/proposals" className="btn-primary" style={{ background: '#0F172A', padding: '1rem 2.5rem' }}>Accéder au Portail de Vote</Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
            {proposals.slice(0, 3).map((v, i) => {
              const total = (v.votesFor || 0) + (v.votesAgainst || 0);
              const pct = total > 0 ? Math.round(((v.votesFor || 0) / total) * 100) : 0;
              return (
                <div key={i} className="card" style={{ padding: '2.5rem', border: '1px solid #E2E8F0', background: 'white' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                    <span style={{ background: v.status === 'active' ? '#DCFCE7' : '#F1F5F9', color: v.status === 'active' ? '#059669' : '#64748B', padding: '0.4rem 1rem', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 900 }}>{v.status.toUpperCase()}</span>
                    <span style={{ fontSize: '1.5rem' }}>🗳️</span>
                  </div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', marginBottom: '2.5rem', height: '3.5rem', overflow: 'hidden' }}>{v.title}</h3>
                  
                  <div style={{ marginBottom: '2.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 900, marginBottom: '0.8rem', color: '#0F172A' }}>
                      <span>PROGRESSION DU VOTE</span>
                      <span>{pct}% POUR</span>
                    </div>
                    <div style={{ height: '10px', background: '#F1F5F9', borderRadius: '100px', overflow: 'hidden' }}>
                      <div style={{ width: `${pct}%`, height: '100%', background: '#059669', borderRadius: '100px' }}></div>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => window.location.href = `/app/proposals/${v.id}`}
                    style={{ 
                      width: '100%', 
                      padding: '1rem', 
                      borderRadius: '12px', 
                      border: '2px solid #0F172A', 
                      background: 'white', 
                      color: '#0F172A', 
                      fontWeight: 800, 
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    Détails & Participation
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}



