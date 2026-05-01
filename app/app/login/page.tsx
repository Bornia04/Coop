'use client';
import Link from 'next/link';
import { IconShield } from '@/components/Icons';

export default function Login() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #022C22 0%, #064E3B 100%)', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      padding: '2rem',
      fontFamily: 'Outfit, sans-serif'
    }}>
      <div style={{ width: '100%', maxWidth: '480px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <Link href="/" style={{ fontSize: '2.5rem', fontWeight: 900, color: '#10B981', textDecoration: 'none', letterSpacing: '-0.02em' }}>CoopLedger</Link>
          <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: '0.5rem', fontWeight: 600 }}>Plateforme de Gouvernance Agricole</p>
        </div>

        <div style={{ background: 'white', padding: '3.5rem', borderRadius: '32px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}>
           <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#0F172A', marginBottom: '0.5rem' }}>Bon retour parmi nous</h2>
           <p style={{ color: '#64748B', fontSize: '1.1rem', marginBottom: '3rem' }}>Connectez-vous pour accéder au Ledger.</p>

           <form onSubmit={(e) => { 
             e.preventDefault(); 
             const email = (e.target as any).elements[0].value;
             const role = (e.target as any).elements[2].value;
             const name = email.split('@')[0].replace('.', ' ').replace(/^./, (str: string) => str.toUpperCase());
             localStorage.setItem('user_name', name);
             localStorage.setItem('user_role', role);
             window.location.href = '/app/dashboard'; 
           }}>
             <div style={{ marginBottom: '1.5rem' }}>
               <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.8rem' }}>ADRESSE EMAIL</label>
               <input 
                 type="email" 
                 style={{ 
                   width: '100%', padding: '1.2rem', borderRadius: '16px', border: '2px solid #F1F5F9', 
                   background: '#F8FAFC', outline: 'none', fontWeight: 600, fontSize: '1rem',
                   transition: 'border-color 0.2s'
                 }} 
                 required 
               />
             </div>

             <div style={{ marginBottom: '2rem' }}>
               <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.8rem' }}>MOT DE PASSE</label>
               <input 
                 type="password" 
                 style={{ 
                   width: '100%', padding: '1.2rem', borderRadius: '16px', border: '2px solid #F1F5F9', 
                   background: '#F8FAFC', outline: 'none', fontWeight: 600, fontSize: '1rem',
                   transition: 'border-color 0.2s'
                 }} 
                 required 
               />
             </div>

             <div style={{ marginBottom: '2.5rem' }}>
               <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.8rem' }}>VOTRE RÔLE</label>
               <select 
                 style={{ 
                   width: '100%', padding: '1.2rem', borderRadius: '16px', border: '2px solid #F1F5F9', 
                   background: '#F8FAFC', outline: 'none', fontWeight: 600, fontSize: '1rem',
                   appearance: 'none', cursor: 'pointer'
                 }}
                 required
               >
                  <option value="PRESIDENT">Président de la Coopérative</option>
                  <option value="TRESORIER">Trésorier Général</option>
                  <option value="MEMBRE">Membre Agriculteur</option>
               </select>
             </div>

             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', fontSize: '0.9rem' }}>
               <label style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', cursor: 'pointer', color: '#64748B', fontWeight: 600 }}>
                 <input type="checkbox" style={{ width: '18px', height: '18px', accentColor: '#10B981' }} /> Se souvenir
               </label>
               <Link href="#" style={{ color: '#059669', fontWeight: 800, textDecoration: 'none' }}>Mot de passe oublié ?</Link>
             </div>

             <button type="submit" style={{ width: '100%', background: '#059669', color: 'white', padding: '1.2rem', borderRadius: '16px', border: 'none', fontWeight: 800, fontSize: '1.1rem', cursor: 'pointer', boxShadow: '0 10px 20px -5px rgba(5, 150, 105, 0.3)' }}>
               Se connecter au Réseau
             </button>
           </form>

           <div style={{ marginTop: '3rem', textAlign: 'center', fontSize: '0.95rem', borderTop: '1px solid #F1F5F9', paddingTop: '2rem' }}>
             <span style={{ color: '#64748B', fontWeight: 600 }}>Nouveau membre ? </span>
             <Link href="/app/register" style={{ color: '#059669', fontWeight: 800, textDecoration: 'none' }}>Créer un compte</Link>
           </div>
        </div>

        <div style={{ marginTop: '3rem', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', fontWeight: 700 }}>
           <IconShield size={16} /> CONNEXION SÉCURISÉE PAR CRYPTOGRAPHIE AES-256
        </div>
      </div>
    </div>
  );
}

