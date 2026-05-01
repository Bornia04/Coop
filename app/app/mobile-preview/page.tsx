'use client';
import { useState, useEffect } from 'react';
import { IconDashboard, IconTransactions, IconGouvernance, IconShield } from '@/components/Icons';

export default function MobilePreview() {
  const [user, setUser] = useState({ name: 'Kofi', role: 'MEMBRE' });
  const [balance, setBalance] = useState(845000);

  useEffect(() => {
    const name = localStorage.getItem('user_name');
    const role = localStorage.getItem('user_role');
    if (name) setUser({ name: name.split(' ')[0], role: role || 'MEMBRE' });
  }, []);

  return (
    <div style={{ 
      width: '100%', 
      maxWidth: '430px', 
      margin: '0 auto', 
      height: '900px', 
      background: '#F8FAFC', 
      border: '12px solid #0F172A', 
      borderRadius: '60px', 
      overflow: 'hidden',
      position: 'relative',
      boxShadow: '0 50px 100px -20px rgba(0,0,0,0.25)',
      fontFamily: 'Outfit, sans-serif'
    }}>
      {/* Status Bar */}
      <div style={{ height: '44px', background: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 30px' }}>
        <span style={{ fontSize: '14px', fontWeight: 700 }}>9:41</span>
        <div style={{ display: 'flex', gap: '5px' }}>
          <div style={{ width: '18px', height: '10px', border: '1px solid black', borderRadius: '2px' }} />
        </div>
      </div>

      {/* App Bar */}
      <div style={{ padding: '20px 30px', background: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 900, color: '#0F172A' }}>CoopLedger <span style={{ color: '#10B981' }}>M</span></h1>
        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🔔</div>
      </div>

      <div style={{ padding: '30px', height: 'calc(100% - 150px)', overflowY: 'auto' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 900, color: '#0F172A' }}>Bonjour, {user.name}</h2>
        <p style={{ color: '#64748B', marginBottom: '30px' }}>Votre activité blockchain</p>

        {/* Balance Card */}
        <div style={{ 
          background: 'linear-gradient(135deg, #064E3B 0%, #022C22 100%)', 
          borderRadius: '30px', 
          padding: '30px', 
          color: 'white',
          marginBottom: '30px',
          boxShadow: '0 20px 30px -10px rgba(6, 78, 59, 0.3)'
        }}>
          <p style={{ fontSize: '10px', fontWeight: 800, opacity: 0.6, letterSpacing: '0.1em' }}>SOLDE DISPONIBLE</p>
          <h3 style={{ fontSize: '32px', fontWeight: 900, marginTop: '10px' }}>{balance.toLocaleString()} FCFA</h3>
          <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <IconShield size={14} color="#10B981" />
            <span style={{ fontSize: '10px', fontWeight: 800, color: '#10B981' }}>VÉRIFIÉ SUR LE LEDGER</span>
          </div>
        </div>

        {/* Quick Actions */}
        <h3 style={{ fontSize: '18px', fontWeight: 900, marginBottom: '20px' }}>Actions Rapides</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
          <div style={{ background: 'white', padding: '20px', borderRadius: '24px', textAlign: 'center', border: '1px solid #F1F5F9' }}>
            <div style={{ fontSize: '24px', marginBottom: '10px' }}>🗳️</div>
            <p style={{ fontSize: '14px', fontWeight: 800 }}>Voter</p>
          </div>
          <div style={{ background: 'white', padding: '20px', borderRadius: '24px', textAlign: 'center', border: '1px solid #F1F5F9' }}>
            <div style={{ fontSize: '24px', marginBottom: '10px' }}>📜</div>
            <p style={{ fontSize: '14px', fontWeight: 800 }}>Registre</p>
          </div>
        </div>

        {/* Recent Transactions */}
        <h3 style={{ fontSize: '18px', fontWeight: 900, marginBottom: '20px' }}>Dernières Transactions</h3>
        <div style={{ display: 'grid', gap: '15px' }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{ background: 'white', padding: '15px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ width: '44px', height: '44px', background: '#F1F5F9', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>📦</div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '14px', fontWeight: 800 }}>Achat Engrais NPK</p>
                <p style={{ fontSize: '10px', color: '#94A3B8' }}>Blockchain Certifié</p>
              </div>
              <p style={{ fontWeight: 900, color: '#EF4444' }}>-15k F</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Nav */}
      <div style={{ 
        position: 'absolute', 
        bottom: 0, 
        width: '100%', 
        height: '90px', 
        background: 'white', 
        borderTop: '1px solid #F1F5F9',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingBottom: '20px'
      }}>
        <IconDashboard size={24} color="#10B981" />
        <IconTransactions size={24} color="#94A3B8" />
        <IconGouvernance size={24} color="#94A3B8" />
        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#059669', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 900 }}>{user.name[0]}</div>
      </div>
    </div>
  );
}
