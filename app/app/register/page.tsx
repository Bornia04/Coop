'use client';
import Link from 'next/link';
import { IconShield } from '@/components/Icons';

export default function Register() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: 'Outfit, sans-serif' }}>
      
      {/* Left Sidebar */}
      <div style={{ 
        flex: '0 0 480px', 
        background: 'linear-gradient(135deg, #022C22 0%, #064E3B 100%)', 
        padding: '5rem 4rem', 
        display: 'flex', 
        flexDirection: 'column',
        color: 'white'
      }}>
        <Link href="/" style={{ fontSize: '2.2rem', fontWeight: 900, color: '#10B981', textDecoration: 'none', marginBottom: '1rem' }}>CoopLedger</Link>
        <p style={{ opacity: 0.6, fontSize: '1rem', fontWeight: 600, marginBottom: '5rem' }}>L'excellence technologique au service de la terre.</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          {[
            { title: 'Transparence Totale', desc: 'Visualisez chaque transaction de votre exploitation avec une traçabilité sans faille.' },
            { title: 'Gouvernance Active', desc: 'Prenez part aux décisions majeures via un système de vote décentralisé.' },
            { title: 'Sécurité Blockchain', desc: 'Vos données sont protégées par les protocoles cryptographiques les plus avancés.' }
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
              <div style={{ background: 'rgba(255,255,255,0.1)', padding: '0.8rem', borderRadius: '12px' }}>
                <IconShield size={20} color="#10B981" />
              </div>
              <div>
                <h4 style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: '0.4rem' }}>{item.title}</h4>
                <p style={{ opacity: 0.6, fontSize: '0.9rem', lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 'auto', background: 'rgba(255,255,255,0.05)', padding: '2rem', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.1)' }}>
           <p style={{ fontSize: '0.9rem', lineHeight: 1.6, opacity: 0.8, fontStyle: 'italic' }}>
             "CoopLedger a transformé notre façon de collaborer. La confiance est désormais gravée dans le code."
           </p>
           <p style={{ marginTop: '1rem', fontWeight: 800, fontSize: '0.85rem' }}>— Jean-Baptiste K., Producteur de Cacao</p>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem' }}>
        <div style={{ width: '100%', maxWidth: '640px', background: 'white', padding: '4rem', borderRadius: '40px', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.05)' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#0F172A', marginBottom: '1rem' }}>Rejoindre le Réseau</h1>
          <p style={{ color: '#64748B', fontSize: '1.1rem', marginBottom: '3.5rem' }}>Créez votre identité numérique sur le Ledger et commencez à gérer votre exploitation.</p>

          <form onSubmit={(e) => { 
            e.preventDefault(); 
            const prenom = (e.target as any).elements[0].value;
            const nom = (e.target as any).elements[1].value;
            localStorage.setItem('user_name', prenom + ' ' + nom);
            window.location.href = '/app/dashboard'; 
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.8rem' }}>PRÉNOM</label>
                <input 
                  type="text" 
                  style={{ width: '100%', padding: '1.2rem', borderRadius: '16px', border: '2px solid #F1F5F9', background: '#F8FAFC', outline: 'none', fontWeight: 600 }} 
                  required 
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.8rem' }}>NOM</label>
                <input 
                  type="text" 
                  style={{ width: '100%', padding: '1.2rem', borderRadius: '16px', border: '2px solid #F1F5F9', background: '#F8FAFC', outline: 'none', fontWeight: 600 }} 
                  required 
                />
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.8rem' }}>ADRESSE EMAIL PROFESSIONNELLE</label>
              <input 
                type="email" 
                style={{ width: '100%', padding: '1.2rem', borderRadius: '16px', border: '2px solid #F1F5F9', background: '#F8FAFC', outline: 'none', fontWeight: 600 }} 
                required 
              />
            </div>

            <div style={{ marginBottom: '2.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.8rem' }}>MOT DE PASSE</label>
              <input 
                type="password" 
                style={{ width: '100%', padding: '1.2rem', borderRadius: '16px', border: '2px solid #F1F5F9', background: '#F8FAFC', outline: 'none', fontWeight: 600 }} 
                required 
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '3rem' }}>
              <input type="checkbox" style={{ width: '20px', height: '20px', marginTop: '0.2rem', accentColor: '#10B981' }} required />
              <p style={{ fontSize: '0.9rem', color: '#64748B', lineHeight: 1.5 }}>
                J'accepte les <Link href="#" style={{ color: '#059669', fontWeight: 800, textDecoration: 'none' }}>Conditions d'Utilisation</Link> et la <Link href="#" style={{ color: '#059669', fontWeight: 800, textDecoration: 'none' }}>Politique de Confidentialité</Link>.
              </p>
            </div>

            <button type="submit" style={{ width: '100%', background: '#059669', color: 'white', padding: '1.2rem', borderRadius: '16px', border: 'none', fontWeight: 800, fontSize: '1.1rem', cursor: 'pointer', boxShadow: '0 10px 20px -5px rgba(5, 150, 105, 0.3)' }}>
              Initialiser mon Compte Blockchain
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '2.5rem', fontSize: '1rem', color: '#64748B', fontWeight: 600 }}>
            Déjà inscrit ? <Link href="/app/login" style={{ color: '#059669', fontWeight: 800, textDecoration: 'none' }}>Connectez-vous</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

