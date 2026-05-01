'use client';
import Link from 'next/link';
import Image from 'next/image';
import { IconTarget, IconEye, IconHeart, IconCheck, IconMail, IconShield } from '@/components/Icons';



export default function APropos() {
  return (
    <>
      <section style={{ 
        background: 'linear-gradient(135deg, #064E3B 0%, #022C22 100%)', 
        padding: '100px 10% 80px',
        color: 'white',
        overflow: 'hidden'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.1)', padding: '0.5rem 1rem', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 900, marginBottom: '2rem', border: '1px solid rgba(255,255,255,0.2)' }}>RÉVOLUTION RURALE</div>
            <h1 style={{ fontSize: '4.5rem', fontWeight: 900, lineHeight: 1.1, marginBottom: '2rem', letterSpacing: '-0.04em' }}>
              Bâtir le Pont de la <span style={{ color: '#10B981' }}>Confiance</span>
            </h1>
            <nav style={{ fontSize: '1rem', display: 'flex', gap: '0.8rem', opacity: 0.6, fontWeight: 600 }}>
              <Link href="/" style={{ color: 'white', textDecoration: 'none' }}>Accueil</Link>
              <span>/</span>
              <span style={{ color: '#10B981' }}>Notre Vision</span>
            </nav>
          </div>
          <div style={{ position: 'relative' }}>
            <div style={{ 
              borderRadius: '32px', 
              overflow: 'hidden', 
              boxShadow: '0 40px 80px -20px rgba(0,0,0,0.4)',
              border: '8px solid rgba(255,255,255,0.05)'
            }}>
              <div style={{ position: 'relative' }}>
                <img src="/home/vladmir/.gemini/antigravity/brain/9eef7c1c-93fd-4696-abd5-d1ebf18b3d57/farmers_handshake_trust_1777643261277.png" alt="Confiance" style={{ width: '100%', display: 'block' }} />
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.4)' }}></div>
              </div>
            </div>
            <div style={{ position: 'absolute', bottom: '-20px', left: '-20px', background: '#10B981', padding: '1.5rem', borderRadius: '20px', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}>
              <p style={{ fontSize: '1.5rem', fontWeight: 900 }}>100%</p>
              <p style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase' }}>Transparence</p>
            </div>
          </div>
        </div>
      </section>


      <section className="section" style={{ padding: '8rem 0', background: 'var(--ve-white)' }}>
        <div className="section-inner" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 4rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '6rem', alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              <div style={{ 
                width: '100%', 
                height: '500px', 
                borderRadius: '40px', 
                overflow: 'hidden',
                boxShadow: '0 30px 60px -15px rgba(0,0,0,0.15)',
                position: 'relative',
                zIndex: 2
              }}>
                <img src="/home/vladmir/.gemini/antigravity/brain/9eef7c1c-93fd-4696-abd5-d1ebf18b3d57/cooperative_agriculture_landscape_1777643245902.png" alt="Paysage Agricole" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ 
                position: 'absolute', 
                top: '40px', 
                left: '-40px', 
                width: '100%', 
                height: '100%', 
                border: '2px solid #E2E8F0', 
                borderRadius: '40px', 
                zIndex: 1 
              }}></div>
              <div style={{ 
                position: 'absolute', 
                bottom: '30px', 
                right: '-30px', 
                background: 'var(--ve-white)', 
                padding: '2rem', 
                borderRadius: '24px', 
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)', 
                zIndex: 3,
                maxWidth: '240px'
              }}>
                <p style={{ color: '#059669', fontWeight: 900, fontSize: '2rem', marginBottom: '0.5rem' }}>+45%</p>
                <p style={{ color: '#64748B', fontWeight: 700, fontSize: '0.85rem', lineHeight: 1.4 }}>Augmentation moyenne des revenus après certification.</p>
              </div>
            </div>

            <div>
              <div className="section-tag" style={{ background: '#F1F5F9', color: '#475569', display: 'inline-block', padding: '0.5rem 1.2rem', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 900, marginBottom: '2rem' }}>NOTRE ADN</div>
              <h2 style={{ fontSize: '3.5rem', fontWeight: 900, color: '#0F172A', marginBottom: '2rem', lineHeight: 1.1, letterSpacing: '-0.03em' }}>
                Plus qu'un outil, un <span style={{ color: '#10B981' }}>moteur de prospérité</span> rurale.
              </h2>
              <p style={{ fontSize: '1.2rem', color: '#64748B', lineHeight: 1.8, marginBottom: '2.5rem' }}>
                CoopLedger n'est pas qu'une plateforme de comptabilité ; c'est un écosystème de gouvernance partagée où la technologie blockchain transforme chaque agriculteur en un acteur informé et souverain de sa propre coopérative.
              </p>
              
              <div style={{ background: '#F8FAFC', padding: '2.5rem', borderRadius: '32px', borderLeft: '6px solid #10B981', marginBottom: '3rem', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)' }}>
                <p style={{ color: '#064E3B', fontWeight: 800, fontSize: '1.3rem', fontStyle: 'italic', lineHeight: 1.5 }}>
                  "La terre produit, la Blockchain certifie, la communauté grandit."
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                {[
                  'Gouvernance Directe',
                  'Inclusion Financière',
                  'Transparence Totale',
                  'Sécurité Inviolable'
                ].map(f => (
                  <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '1.05rem', fontWeight: 700, color: '#1E293B' }}>
                    <div style={{ width: '24px', height: '24px', background: '#DCFCE7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <IconCheck size={14} color="#059669" />
                    </div>
                    {f}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{background: 'var(--ve-bg)', borderTop:'1px solid var(--ve-border)', padding: '8rem 0'}}>
        <div className="section-inner" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
            <div className="section-tag" style={{ background: '#DCFCE7', color: '#059669', display: 'inline-block', padding: '0.5rem 1.2rem', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 900, marginBottom: '1.5rem' }}>LES 3 PILIERS</div>
            <h2 style={{ fontSize: '3rem', fontWeight: 900, color: '#0F172A', maxWidth: '800px', margin: '0 auto' }}>Une vision structurée pour porter le <span style={{ color: '#10B981' }}>monde rural</span> vers l'excellence</h2>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2.5rem' }}>
            
            <div style={{ background: 'var(--ve-white)', padding: '3rem', borderRadius: '40px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.05)', border: '1px solid var(--ve-border)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ width: '70px', height: '70px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2.5rem' }}>
                <IconShield size={32} color="#10B981" />
              </div>
              <h4 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0F172A', marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>1. Transparence & Prospérité</h4>
              <p style={{ color: '#64748B', fontSize: '1.1rem', lineHeight: 1.7, marginBottom: '2.5rem', flex: 1 }}>Passer d'une gestion opaque et manuelle à une transparence absolue certifiée par le réseau blockchain.</p>
              
              <div style={{ background: 'var(--ve-bg)', padding: '1.5rem', borderRadius: '24px', border: '1px solid var(--ve-border)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <p style={{ fontSize: '0.75rem', fontWeight: 900, color: '#94A3B8', marginBottom: '0.4rem' }}>AVANT</p>
                    <p style={{ fontSize: '0.9rem', fontWeight: 700, color: '#64748B', textDecoration: 'line-through' }}>Méfiance & Lenteur</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '0.75rem', fontWeight: 900, color: '#10B981', marginBottom: '0.4rem' }}>APRÈS</p>
                    <p style={{ fontSize: '0.9rem', fontWeight: 800, color: '#059669' }}>Confiance Absolue</p>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ background: 'var(--ve-white)', padding: '3rem', borderRadius: '40px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.05)', border: '1px solid var(--ve-border)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ width: '70px', height: '70px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2.5rem' }}>
                <IconEye size={32} color="#3B82F6" />
              </div>
              <h4 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0F172A', marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>2. La "DAO" Agricole</h4>
              <p style={{ color: '#64748B', fontSize: '1.1rem', lineHeight: 1.7, marginBottom: '2.5rem', flex: 1 }}>Les décisions importantes ne sont plus prises derrière des portes closes, mais par consensus démocratique direct.</p>
              
              <div style={{ background: 'var(--ve-bg)', padding: '1.5rem', borderRadius: '24px', border: '1px solid var(--ve-border)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <p style={{ fontSize: '0.75rem', fontWeight: 900, color: '#94A3B8', marginBottom: '0.4rem' }}>AVANT</p>
                    <p style={{ fontSize: '0.9rem', fontWeight: 700, color: '#64748B', textDecoration: 'line-through' }}>Gouvernance Opaque</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '0.75rem', fontWeight: 900, color: '#3B82F6', marginBottom: '0.4rem' }}>APRÈS</p>
                    <p style={{ fontSize: '0.9rem', fontWeight: 800, color: '#1E40AF' }}>Consensus Partagé</p>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ background: 'var(--ve-white)', padding: '3rem', borderRadius: '40px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.05)', border: '1px solid var(--ve-border)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ width: '70px', height: '70px', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2.5rem' }}>
                <IconHeart size={32} color="#F59E0B" />
              </div>
              <h4 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0F172A', marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>3. Inclusion Financière</h4>
              <p style={{ color: '#64748B', fontSize: '1.1rem', lineHeight: 1.7, marginBottom: '2.5rem', flex: 1 }}>Chaque membre construit un historique de crédit transparent, ouvrant la porte aux financements bancaires.</p>
              
              <div style={{ background: 'var(--ve-bg)', padding: '1.5rem', borderRadius: '24px', border: '1px solid var(--ve-border)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <p style={{ fontSize: '0.75rem', fontWeight: 900, color: '#94A3B8', marginBottom: '0.4rem' }}>AVANT</p>
                    <p style={{ fontSize: '0.9rem', fontWeight: 700, color: '#64748B', textDecoration: 'line-through' }}>Exclusion Bancaire</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '0.75rem', fontWeight: 900, color: '#F59E0B', marginBottom: '0.4rem' }}>APRÈS</p>
                    <p style={{ fontSize: '0.9rem', fontWeight: 800, color: '#B45309' }}>Crédibilité On-chain</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      <div style={{ background: '#0F172A', padding: '6rem 10%', color: 'white' }}>
        <div style={{ background: 'linear-gradient(135deg, #064E3B 0%, #022C22 100%)', padding: '4rem', borderRadius: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 30px 60px -12px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ maxWidth: '500px' }}>
            <h3 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '1rem' }}>Rejoignez le mouvement</h3>
            <p style={{ opacity: 0.7, fontSize: '1.1rem', lineHeight: 1.6 }}>Contribuez à l'émergence d'une agriculture africaine transparente et souveraine.</p>
          </div>
          <form style={{ display: 'flex', gap: '1rem', width: '400px' }} onSubmit={e => { e.preventDefault(); alert('Merci pour votre engagement !'); }}>
            <input 
              type="email" 
              placeholder="votre@email.com" 
              required 
              style={{ flex: 1, padding: '1.2rem 1.5rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'white', fontWeight: 600, outline: 'none' }} 
            />
            <button 
              type="submit" 
              style={{ background: '#10B981', color: 'white', padding: '0 2rem', borderRadius: '16px', border: 'none', fontWeight: 800, cursor: 'pointer', transition: 'all 0.3s' }}
            >
              S'engager
            </button>
          </form>
        </div>
      </div>

    </>
  );
}

