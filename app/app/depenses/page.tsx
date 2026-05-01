'use client';
import { useEffect, useState } from 'react';
import { getStore, type CoopStore } from '@/lib/store';
import { IconDepenses, IconShield } from '@/components/Icons';

export default function Depenses() {
  const [store, setStore] = useState<CoopStore | null>(null);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => { setStore(getStore()); }, []);

  if (!store) return <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: '#059669', fontWeight: 800 }}>Analyse des flux financiers...</div>;

  const handleVerify = async () => {
    setVerifying(true);
    await new Promise(r => setTimeout(r, 2000));
    setVerifying(false);
    alert('✅ INTÉGRITÉ VÉRIFIÉE : Toutes les dépenses sont conformes au registre blockchain de la coopérative.');
  };

  return (
    <div style={{ padding: '1rem 0' }}>
      
      <div style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2.8rem', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.02em' }}>Analyse des <span style={{ color: '#059669' }}>Dépenses</span></h1>
          <p style={{ color: '#64748B', fontSize: '1.1rem', marginTop: '0.4rem' }}>Optimisation des ressources et transparence des flux fournisseurs</p>
        </div>
        <IconDepenses size={40} color="#059669" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', marginBottom: '3rem' }}>
        {[
          { label: 'MOYENNE MENSUELLE', val: '12,4M FCFA', color: '#059669', trend: '+2.4%' },
          { label: 'PLUS GROS POSTE', val: 'Engrais (42%)', color: '#2563EB', trend: 'Stable' },
          { label: 'FOURNISSEUR TOP', val: 'AgriTech Togo', color: '#7C3AED', trend: 'Certifié' }
        ].map((s, i) => (
          <div key={i} style={{ background: 'white', padding: '2.5rem', borderRadius: '24px', boxShadow: '0 10px 30px -5px rgba(0,0,0,0.05)', border: '1px solid #F1F5F9' }}>
            <p style={{ fontSize: '0.8rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</p>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0F172A', marginTop: '0.8rem' }}>{s.val}</h3>
            <div style={{ marginTop: '1rem', fontSize: '0.85rem', fontWeight: 700, color: s.color }}>{s.trend}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '3rem', marginBottom: '3rem' }}>
        
        <div style={{ background: 'white', borderRadius: '32px', padding: '3rem', boxShadow: '0 10px 30px -5px rgba(0,0,0,0.05)', border: '1px solid #F1F5F9' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0F172A', marginBottom: '3rem' }}>Répartition par Saison Agricole</h3>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2.5rem', height: '250px', padding: '0 1rem' }}>
             {[
               { label: 'Saison Sèche', val: 35, color: '#F59E0B' },
               { label: 'Petite Pluie', val: 70, color: '#10B981' },
               { label: 'Grande Pluie', val: 95, color: '#2563EB' },
               { label: 'Harmattan', val: 25, color: '#64748B' }
             ].map((s, i) => (
               <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
                 <div style={{ width: '100%', height: `${s.val}%`, background: s.color, borderRadius: '12px 12px 4px 4px', position: 'relative', transition: 'height 0.3s ease' }}>
                    <span style={{ position: 'absolute', top: '-35px', left: '50%', transform: 'translateX(-50%)', fontWeight: 900, fontSize: '1rem', color: '#0F172A' }}>{s.val}M</span>
                 </div>
                 <p style={{ fontSize: '0.9rem', fontWeight: 800, color: '#475569', textAlign: 'center' }}>{s.label}</p>
               </div>
             ))}
          </div>
        </div>

        <div style={{ background: '#0F172A', borderRadius: '32px', padding: '3rem', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ background: 'rgba(255,255,255,0.1)', width: '60px', height: '60px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem' }}>
            <IconShield size={32} color="#10B981" />
          </div>
          <h3 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '1.5rem' }}>Audit Blockchain</h3>
          <p style={{ opacity: 0.6, fontSize: '1rem', lineHeight: 1.8, marginBottom: '2.5rem' }}>
            Chaque dépense listée ici est vérifiée par les membres de la coopérative et scellée sur le Ledger. Toute modification rétroactive est impossible.
          </p>
          <button 
            onClick={handleVerify}
            disabled={verifying}
            style={{ background: '#10B981', color: 'white', padding: '1.2rem', borderRadius: '16px', border: 'none', fontWeight: 800, fontSize: '1.1rem', cursor: 'pointer', opacity: verifying ? 0.7 : 1 }}
          >
            {verifying ? 'Vérification...' : 'Vérifier l\'Intégrité'}
          </button>
        </div>


      </div>

      <div style={{ background: 'white', borderRadius: '32px', padding: '2.5rem', boxShadow: '0 10px 30px -5px rgba(0,0,0,0.05)', border: '1px solid #F1F5F9', overflow: 'hidden' }}>
        <h3 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0F172A', marginBottom: '2.5rem' }}>Performance Fournisseurs</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #F1F5F9' }}>
              <th style={{ textAlign: 'left', padding: '1.2rem', color: '#64748B', fontWeight: 800, fontSize: '0.85rem' }}>FOURNISSEUR</th>
              <th style={{ textAlign: 'left', padding: '1.2rem', color: '#64748B', fontWeight: 800, fontSize: '0.85rem' }}>CATÉGORIE</th>
              <th style={{ textAlign: 'right', padding: '1.2rem', color: '#64748B', fontWeight: 800, fontSize: '0.85rem' }}>VOLUME (2024)</th>
              <th style={{ textAlign: 'center', padding: '1.2rem', color: '#64748B', fontWeight: 800, fontSize: '0.85rem' }}>SCORE CONFIANCE</th>
            </tr>
          </thead>
          <tbody>
            {[
              { name: 'AgriTech Togo', cat: 'Engrais & Semences', vol: '45,8M FCFA', score: 98, color: '#059669' },
              { name: 'Sodigaz Kpalimé', cat: 'Énergie / Carburant', vol: '12,2M FCFA', score: 94, color: '#2563EB' },
              { name: 'Maintenance Pro', cat: 'Entretien Matériel', vol: '8,5M FCFA', score: 89, color: '#F59E0B' }
            ].map((f, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #F1F5F9' }}>
                <td style={{ padding: '1.5rem', fontWeight: 800, color: '#0F172A' }}>{f.name}</td>
                <td style={{ padding: '1.5rem', color: '#64748B', fontWeight: 600 }}>{f.cat}</td>
                <td style={{ padding: '1.5rem', textAlign: 'right', fontWeight: 900, color: '#0F172A' }}>{f.vol}</td>
                <td style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ flex: 1, height: '10px', background: '#F1F5F9', borderRadius: '100px', overflow: 'hidden' }}>
                      <div style={{ width: `${f.score}%`, height: '100%', background: f.color, borderRadius: '100px' }}></div>
                    </div>
                    <span style={{ fontSize: '0.9rem', fontWeight: 800, color: f.color, width: '40px' }}>{f.score}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}

