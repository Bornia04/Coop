'use client';
import { useState, useEffect } from 'react';
import { IconShield, IconSettings } from '@/components/Icons';

export default function Settings() {
  const [form, setForm] = useState({ 
    name: 'Coopérative de Kpalimé', 
    email: 'admin@coop.tg', 
    notify: true,
    currency: 'FCFA',
    language: 'Français'
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const userName = localStorage.getItem('user_name');
    if (userName) {
      setForm(prev => ({ ...prev, name: userName + " - Exploitation" }));
    }
  }, []);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      alert("Vos paramètres ont été synchronisés et scellés sur le profil Ledger.");
    }, 1500);
  };

  return (
    <div style={{ padding: '1rem 0', maxWidth: '900px' }}>
      
      <div style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2.8rem', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.02em' }}>Paramètres <span style={{ color: '#059669' }}>Système</span></h1>
          <p style={{ color: '#64748B', fontSize: '1.1rem', marginTop: '0.4rem' }}>Gérez vos préférences et la configuration de votre identité blockchain</p>
        </div>
        <IconSettings size={40} color="#059669" />
      </div>

      <div style={{ display: 'grid', gap: '2.5rem' }}>
        
        {/* Profile Info */}
        <div style={{ background: 'var(--ve-white)', padding: '3rem', borderRadius: '32px', boxShadow: '0 10px 30px -5px rgba(0,0,0,0.05)', border: '1px solid var(--ve-border)' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0F172A', marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <div style={{ width: '12px', height: '12px', background: '#059669', borderRadius: '3px' }} />
            Informations de Profil
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.8rem' }}>NOM DE L'EXPLOITATION</label>
              <input 
                type="text" 
                value={form.name} 
                onChange={e => setForm({...form, name: e.target.value})}
                style={{ width: '100%', padding: '1.2rem', borderRadius: '16px', border: '2px solid var(--ve-border)', background: 'var(--ve-bg)', outline: 'none', fontWeight: 600, fontSize: '1rem', color: 'var(--ve-text)' }} 
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.8rem' }}>ADRESSE EMAIL SÉCURISÉE</label>
              <input 
                type="email" 
                value={form.email} 
                onChange={e => setForm({...form, email: e.target.value})}
                style={{ width: '100%', padding: '1.2rem', borderRadius: '16px', border: '2px solid var(--ve-border)', background: 'var(--ve-bg)', outline: 'none', fontWeight: 600, fontSize: '1rem', color: 'var(--ve-text)' }} 
              />
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div style={{ background: 'var(--ve-white)', padding: '3rem', borderRadius: '32px', boxShadow: '0 10px 30px -5px rgba(0,0,0,0.05)', border: '1px solid var(--ve-border)' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0F172A', marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <div style={{ width: '12px', height: '12px', background: '#2563EB', borderRadius: '3px' }} />
            Préférences du Ledger
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.8rem' }}>DEVISE PAR DÉFAUT</label>
              <select style={{ width: '100%', padding: '1.2rem', borderRadius: '16px', border: '2px solid var(--ve-border)', background: 'var(--ve-bg)', outline: 'none', fontWeight: 600, fontSize: '1rem', appearance: 'none', color: 'var(--ve-text)' }}>
                <option>FCFA (XOF)</option>
                <option>Euro (EUR)</option>
                <option>Dollar (USD)</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.8rem' }}>LANGUE DE L'INTERFACE</label>
              <select style={{ width: '100%', padding: '1.2rem', borderRadius: '16px', border: '2px solid var(--ve-border)', background: 'var(--ve-bg)', outline: 'none', fontWeight: 600, fontSize: '1rem', appearance: 'none', color: 'var(--ve-text)' }}>
                <option>Français</option>
                <option>English</option>
                <option>Ewe</option>
                <option>Kabyè</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', padding: '1.5rem', background: 'var(--ve-bg)', borderRadius: '20px', border: '1px solid var(--ve-border)' }}>
            <input 
              type="checkbox" 
              checked={form.notify} 
              onChange={e => setForm({...form, notify: e.target.checked})} 
              style={{ width: '24px', height: '24px', accentColor: '#10B981', cursor: 'pointer' }} 
            />
            <div>
              <p style={{ fontWeight: 800, color: '#0F172A', fontSize: '1rem' }}>Alertes de Gouvernance</p>
              <p style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 600 }}>Recevoir une notification lors de l'ouverture d'un nouveau vote sur la blockchain.</p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1.5rem', alignItems: 'center' }}>
          {saving && <span style={{ color: '#059669', fontWeight: 800, fontSize: '0.9rem' }}>Scellage en cours...</span>}
          <button 
            onClick={handleSave}
            disabled={saving}
            style={{ 
              background: '#0F172A', color: 'white', padding: '1.2rem 3rem', borderRadius: '16px', 
              border: 'none', fontWeight: 800, fontSize: '1.1rem', cursor: 'pointer',
              opacity: saving ? 0.7 : 1, transition: 'all 0.2s'
            }}
          >
            {saving ? 'Synchronisation...' : 'Enregistrer les Changements'}
          </button>
        </div>

        {/* Danger Zone */}
        <div style={{ marginTop: '2rem', background: '#FEF2F2', padding: '3rem', borderRadius: '32px', border: '2px solid #FEE2E2' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#991B1B', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            ⚠️ Zone de Sécurité Critique
          </h3>
          <p style={{ color: '#991B1B', fontWeight: 600, fontSize: '1rem', lineHeight: 1.6, marginBottom: '2.5rem', opacity: 0.8 }}>
            La suppression de votre identité numérique entraînera la perte d'accès à vos droits de vote. 
            Notez que toutes vos transactions passées resteront gravées de façon permanente sur le Ledger Public, conformément aux protocoles d'immuabilité.
          </p>
          <button style={{ background: 'white', color: '#991B1B', border: '2px solid #FEE2E2', padding: '1.2rem 2.5rem', borderRadius: '16px', fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s' }}>
             Supprimer mon Accès au Réseau
          </button>
        </div>

      </div>
    </div>
  );
}

