'use client';
import Link from 'next/link';
import { useState } from 'react';
import { IconMapPin, IconPhone, IconMail, IconClock, IconSend } from '@/components/Icons';

export default function Contact() {
  const [sent, setSent] = useState(false);
  return (
    <>
      <section className="page-hero" style={{ 
        backgroundImage: "url('https://images.unsplash.com/photo-1595841696677-6489ff3f8cd1?auto=format&fit=crop&q=80&w=1600')",
        height: '400px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        color: 'white',
        textAlign: 'center'
      }}>
        <div style={{ 
          position: 'absolute', 
          top: 0, left: 0, right: 0, bottom: 0, 
          background: 'linear-gradient(to bottom, rgba(21, 128, 61, 0.8), rgba(2, 44, 34, 0.9))' 
        }} />
        <div className="page-hero-content" style={{ position: 'relative', zIndex: 1 }}>
          <div className="section-tag" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', display: 'inline-block', padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 800, marginBottom: '1rem' }}>CONTACTEZ-NOUS</div>
          <h1 style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>Bâtissons ensemble <span style={{ color: '#FCD34D' }}>votre avenir</span></h1>
          <nav style={{ fontSize: '1rem', display: 'flex', justifyContent: 'center', gap: '0.5rem', opacity: 0.8 }}>
            <Link href="/" style={{ color: 'white', textDecoration: 'none' }}>Accueil</Link>
            <span>/</span>
            <span style={{ color: '#FCD34D' }}>Contact</span>
          </nav>
        </div>
      </section>

      <section className="section" style={{ padding: '6rem 0', background: '#F8FAFC' }}>
        <div className="section-inner" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '4rem' }}>
            
            <div className="contact-info">
              <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#022C22', marginBottom: '1.5rem' }}>Comment pouvons-nous <span style={{ color: 'var(--ve-green)' }}>vous aider ?</span></h2>
              <p style={{ color: '#64748B', fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '3rem' }}>Notre équipe d'experts est là pour vous accompagner dans la transformation digitale de votre coopérative. Réponse garantie sous 24h.</p>
              
              <div style={{ display: 'grid', gap: '2rem' }}>
                {[
                  { Icon: IconMapPin, label: 'Siège Social', val: 'Quartier Administratif, Lomé - Togo' },
                  { Icon: IconPhone, label: 'Téléphone', val: '+228 97 25 40 50 / +228 70 45 70 23' },
                  { Icon: IconMail, label: 'Email Direct', val: 'contact@coopledger.tg' },
                  { Icon: IconClock, label: 'Heures d\'Ouverture', val: 'Lundi – Samedi, 8h00 – 17h00' },
                ].map(({ Icon, label, val }) => (
                  <div key={label} style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                    <div style={{ background: 'white', width: '50px', height: '50px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                      <Icon size={24} color="var(--ve-green)" />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', marginBottom: '0.3rem' }}>{label}</h4>
                      <p style={{ fontSize: '1.1rem', fontWeight: 600, color: '#022C22' }}>{val}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="contact-form" style={{ background: 'white', padding: '3.5rem', borderRadius: '32px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.05)' }}>
              {sent ? (
                <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                  <div style={{ width: '80px', height: '80px', background: '#DCFCE7', color: '#166534', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem', fontSize: '2.5rem' }}>✓</div>
                  <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#022C22', marginBottom: '1rem' }}>C'est envoyé !</h3>
                  <p style={{ color: '#64748B', fontSize: '1.1rem' }}>Merci pour votre message. Un membre de notre équipe vous recontactera très rapidement.</p>
                  <button onClick={() => setSent(false)} className="btn-outline" style={{ marginTop: '2.5rem' }}>Envoyer un autre message</button>
                </div>
              ) : (
                <form onSubmit={e => { e.preventDefault(); setSent(true); }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                    <div className="form-group">
                      <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748B', marginBottom: '0.5rem', display: 'block' }}>PRÉNOM</label>
                      <input type="text" style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid #E2E8F0', background: '#F8FAFC' }} required />
                    </div>
                    <div className="form-group">
                      <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748B', marginBottom: '0.5rem', display: 'block' }}>NOM</label>
                      <input type="text" style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid #E2E8F0', background: '#F8FAFC' }} required />
                    </div>
                  </div>
                  <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748B', marginBottom: '0.5rem', display: 'block' }}>ADRESSE EMAIL</label>
                    <input type="email" style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid #E2E8F0', background: '#F8FAFC' }} required />
                  </div>
                  <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748B', marginBottom: '0.5rem', display: 'block' }}>VOTRE MESSAGE</label>
                    <textarea style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid #E2E8F0', background: '#F8FAFC', minHeight: '150px' }} required />
                  </div>
                  <button type="submit" className="btn-primary" style={{ width: '100%', height: '60px', justifyContent: 'center', fontSize: '1.1rem', gap: '0.8rem' }}>
                    <IconSend size={20} /> Envoyer ma demande
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>
      </section>
    </>
  );
}

