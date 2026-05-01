'use client';
import { useEffect, useState } from 'react';
import { IconTractor, IconShield } from '@/components/Icons';

export default function Equipement() {
  const [data, setData] = useState<{equipment: any[], alerts: any[], equipmentStats: any[]} | null>(null);

  useEffect(() => {
    fetch('/api/equipment')
      .then(res => res.json())
      .then(d => setData(d));
  }, []);

  if (!data) return <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: '#059669', fontWeight: 800 }}>Chargement de l'inventaire...</div>;

  return (
    <div style={{ padding: '1rem 0' }}>
      
      <div style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2.8rem', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.02em' }}>Inventaire <span style={{ color: '#059669' }}>Matériel</span></h1>
          <p style={{ color: '#64748B', fontSize: '1.1rem', marginTop: '0.4rem' }}>Suivi des actifs physiques et maintenance préventive certifiée</p>
        </div>
        <button 
          onClick={() => {
            const name = prompt("Nom de l'actif :");
            if(name) alert(`L'actif "${name}" a été enregistré dans la file d'attente blockchain.`);
          }}
          style={{ background: '#059669', color: 'white', padding: '1rem 2rem', borderRadius: '16px', fontWeight: 800, border: 'none', cursor: 'pointer', boxShadow: '0 10px 20px -5px rgba(5, 150, 105, 0.3)' }}
        >
          + Ajouter un Actif
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
        {data.equipmentStats.map((s, i) => (
          <div key={i} style={{ background: 'white', padding: '2rem', borderRadius: '24px', boxShadow: '0 10px 30px -5px rgba(0,0,0,0.05)', textAlign: 'center', border: '1px solid #F1F5F9' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{s.icon}</div>
            <p style={{ fontSize: '0.8rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</p>
            <h3 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#0F172A', marginTop: '0.5rem' }}>{s.val}</h3>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '3rem' }}>
        
        <div style={{ background: 'white', borderRadius: '32px', padding: '2.5rem', boxShadow: '0 10px 30px -5px rgba(0,0,0,0.05)', border: '1px solid #F1F5F9' }}>
          <h3 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0F172A', marginBottom: '2.5rem' }}>Registre des Actifs</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #F1F5F9' }}>
                  <th style={{ textAlign: 'left', padding: '1.2rem', color: '#64748B', fontWeight: 800, fontSize: '0.85rem' }}>NOM DE L'ACTIF</th>
                  <th style={{ textAlign: 'left', padding: '1.2rem', color: '#64748B', fontWeight: 800, fontSize: '0.85rem' }}>SÉRIE / ID</th>
                  <th style={{ textAlign: 'center', padding: '1.2rem', color: '#64748B', fontWeight: 800, fontSize: '0.85rem' }}>ÉTAT</th>
                  <th style={{ textAlign: 'right', padding: '1.2rem', color: '#64748B', fontWeight: 800, fontSize: '0.85rem' }}>RÉVISION</th>
                </tr>
              </thead>
              <tbody>
                {data.equipment.map((a, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '1.5rem', fontWeight: 800, color: '#0F172A', fontSize: '1.05rem' }}>{a.name}</td>
                    <td style={{ padding: '1.5rem', color: '#64748B', fontFamily: 'monospace', fontSize: '0.9rem' }}>{a.id}</td>
                    <td style={{ padding: '1.5rem', textAlign: 'center' }}>
                      <span style={{ 
                        background: a.color + '15', 
                        color: a.color, 
                        padding: '0.5rem 1rem', 
                        borderRadius: '100px', 
                        fontSize: '0.8rem', 
                        fontWeight: 900,
                        border: `1px solid ${a.color}30`
                      }}>
                        {a.status.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: '1.5rem', textAlign: 'right', color: '#475569', fontWeight: 600 }}>{a.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div style={{ background: 'white', borderRadius: '32px', padding: '2.5rem', boxShadow: '0 10px 30px -5px rgba(0,0,0,0.05)', border: '1px solid #F1F5F9' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '2rem' }}>
              <IconShield size={24} color="#059669" />
              <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0F172A' }}>Maintenance</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                {data.alerts.map((alert, i) => {
                   let color = '#3B82F6';
                   let bg = '#EFF6FF';
                   if (alert.type === 'critical') { color = '#EF4444'; bg = '#FEF2F2'; }
                   else if (alert.type === 'warning') { color = '#F59E0B'; bg = '#FFFBEB'; }
                   return (
                     <div key={i} style={{ padding: '1.5rem', background: bg, borderRadius: '20px', border: `1px solid ${color}20` }}>
                        <p style={{ fontWeight: 900, fontSize: '1rem', color: '#0F172A', marginBottom: '0.3rem' }}>{alert.title}</p>
                        <p style={{ fontSize: '0.9rem', color: color, fontWeight: 700 }}>{alert.description}</p>
                     </div>
                   );
                })}
            </div>
            <button 
              onClick={() => alert("Génération du planning de maintenance blockchain...")}
              style={{ width: '100%', marginTop: '2rem', padding: '1.2rem', borderRadius: '16px', border: '2px solid #E2E8F0', background: 'white', color: '#0F172A', fontWeight: 800, cursor: 'pointer' }}
            >
              Voir tout le planning
            </button>
          </div>

          <div style={{ background: '#0F172A', borderRadius: '32px', padding: '2.5rem', color: 'white' }}>
            <h4 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem' }}>Support Technique</h4>
            <p style={{ opacity: 0.6, fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '2rem' }}>Une question sur l'entretien de votre matériel ? Nos experts vous répondent.</p>
            <button style={{ width: '100%', background: '#10B981', color: 'white', padding: '1rem', borderRadius: '12px', border: 'none', fontWeight: 800 }}>Ouvrir un Ticket</button>
          </div>

        </div>

      </div>
    </div>
  );
}

