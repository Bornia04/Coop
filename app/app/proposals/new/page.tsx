'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { generateTxHash, generateBlockNumber, NETWORK } from '@/lib/blockchain';
import { IconShield, IconSend } from '@/components/Icons';

export default function NewProposal() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ txHash: string; block: number } | null>(null);
  const [form, setForm] = useState({ title: '', description: '', amount: '', category: 'Engrais', durationHours: '72' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 2000));

    const hash = await generateTxHash({ ...form, ts: Date.now() });
    const block = generateBlockNumber();
    
    const res = await fetch('/api/proposals', {
      method: 'POST',
      body: JSON.stringify({
        title: form.title,
        description: form.description,
        amount: parseFloat(form.amount),
        category: form.category,
        createdBy: localStorage.getItem('user_name') || 'Admin',
        txHash: hash,
        blockNumber: block
      })
    });

    if (res.ok) {
      setResult({ txHash: hash, block });
    }
    setSubmitting(false);
  };

  if (result) return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '6rem 0', textAlign: 'center' }}>
      <div style={{ background: '#DCFCE7', width: '100px', height: '100px', borderRadius: '50%', margin: '0 auto 2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <IconShield size={48} color="#059669" />
      </div>
      <h1 style={{ fontSize: '3rem', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.02em' }}>Proposition <span style={{ color: '#059669' }}>Scellée</span></h1>
      <p style={{ color: '#64748B', fontSize: '1.2rem', marginTop: '1rem' }}>Votre demande a été enregistrée de manière immuable sur le réseau.</p>
      
      <div style={{ background: 'white', padding: '3rem', borderRadius: '32px', boxShadow: '0 10px 30px -5px rgba(0,0,0,0.05)', border: '1px solid #F1F5F9', marginTop: '3rem', textAlign: 'left' }}>
         <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', color: '#059669', fontWeight: 800 }}>
           <IconShield size={20} /> TRANSACTION CONFIRMÉE SUR {NETWORK.toUpperCase()}
         </div>
         <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
           <div>
             <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#94A3B8', marginBottom: '0.5rem' }}>TX HASH</label>
             <code style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '12px', display: 'block', wordBreak: 'break-all', fontSize: '0.9rem', border: '1px solid #F1F5F9' }}>{result.txHash}</code>
           </div>
           <div>
             <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#94A3B8', marginBottom: '0.5rem' }}>BLOC DE SÉCURITÉ</label>
             <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0F172A' }}>#{result.block}</div>
           </div>
         </div>
      </div>
      
      <div style={{ marginTop: '3rem', display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
        <Link href="/app/proposals" style={{ background: '#0F172A', color: 'white', padding: '1.2rem 2.5rem', borderRadius: '16px', fontWeight: 800, textDecoration: 'none' }}>
          Voir les Votes
        </Link>
        <Link href="/app/dashboard" style={{ background: 'white', color: '#0F172A', padding: '1.2rem 2.5rem', borderRadius: '16px', fontWeight: 800, textDecoration: 'none', border: '2px solid #E2E8F0' }}>
          Tableau de Bord
        </Link>
      </div>
    </div>
  );

  return (
    <div style={{ padding: '1rem 0', maxWidth: '800px' }}>
      <div style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.8rem', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.02em' }}>Nouvelle <span style={{ color: '#059669' }}>Proposition</span></h1>
        <p style={{ color: '#64748B', fontSize: '1.1rem', marginTop: '0.4rem' }}>Soumettez une nouvelle dépense stratégique au vote de la coopérative</p>
      </div>

      <div style={{ background: 'white', padding: '3.5rem', borderRadius: '40px', boxShadow: '0 10px 30px -5px rgba(0,0,0,0.05)', border: '1px solid #F1F5F9' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.8rem' }}>TITRE DE LA PROPOSITION</label>
            <input 
              type="text" 
              value={form.title} 
              onChange={e => setForm({ ...form, title: e.target.value })} 
              required 
              placeholder="Ex: Achat d'un nouveau tracteur Massey Ferguson"
              style={{ width: '100%', padding: '1.2rem', borderRadius: '16px', border: '2px solid #F1F5F9', background: '#F8FAFC', outline: 'none', fontWeight: 600, fontSize: '1rem' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.8rem' }}>DESCRIPTION DÉTAILLÉE</label>
            <textarea 
              value={form.description} 
              onChange={e => setForm({ ...form, description: e.target.value })} 
              required 
              placeholder="Justifiez le besoin et l'impact sur la productivité..."
              style={{ width: '100%', padding: '1.2rem', borderRadius: '16px', border: '2px solid #F1F5F9', background: '#F8FAFC', outline: 'none', fontWeight: 600, fontSize: '1rem', minHeight: '150px' }}
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
             <div>
               <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.8rem' }}>MONTANT ESTIMÉ (FCFA)</label>
               <input 
                type="number" 
                value={form.amount} 
                onChange={e => setForm({ ...form, amount: e.target.value })} 
                required 
                style={{ width: '100%', padding: '1.2rem', borderRadius: '16px', border: '2px solid #F1F5F9', background: '#F8FAFC', outline: 'none', fontWeight: 600, fontSize: '1rem' }}
               />
             </div>
             <div>
               <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.8rem' }}>CATÉGORIE D'INVESTISSEMENT</label>
               <select 
                value={form.category} 
                onChange={e => setForm({ ...form, category: e.target.value })}
                style={{ width: '100%', padding: '1.2rem', borderRadius: '16px', border: '2px solid #F1F5F9', background: '#F8FAFC', outline: 'none', fontWeight: 600, fontSize: '1rem', appearance: 'none' }}
               >
                 <option>Semences</option>
                 <option>Engrais</option>
                 <option>Matériel</option>
                 <option>Infrastructure</option>
               </select>
             </div>
          </div>
          
          <div style={{ background: '#F8FAFC', padding: '1.5rem', borderRadius: '20px', border: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <IconShield size={24} color="#059669" />
            <p style={{ fontSize: '0.9rem', color: '#64748B', fontWeight: 600 }}>
              Cette proposition sera signée numériquement. Une fois soumise, elle ne pourra plus être modifiée.
            </p>
          </div>

          <button 
            type="submit" 
            disabled={submitting}
            style={{ 
              marginTop: '1rem', background: '#059669', color: 'white', padding: '1.5rem', borderRadius: '20px', 
              border: 'none', fontWeight: 900, fontSize: '1.2rem', cursor: 'pointer',
              boxShadow: '0 10px 20px -5px rgba(5, 150, 105, 0.3)', transition: 'all 0.2s',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem',
              opacity: submitting ? 0.7 : 1
            }}
          >
            {submitting ? 'Signature Cryptographique...' : <><IconSend size={20} /> Envoyer la Proposition</>}
          </button>
        </form>
      </div>
    </div>
  );
}

