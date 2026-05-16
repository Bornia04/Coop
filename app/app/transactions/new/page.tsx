'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewTransaction() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [form, setForm] = useState({ description: '', amount: '', category: 'Ventes', type: 'credit' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    // Simulate Blockchain delay
    await new Promise(r => setTimeout(r, 1500));
    
    const txHash = '0x' + Math.random().toString(16).substring(2, 10).toUpperCase() + '...' + Math.random().toString(16).substring(2, 5).toUpperCase();

    const newTx = {
      description: form.description,
      amount: parseFloat(form.amount),
      category: form.category,
      type: form.type,
      txHash: txHash
    };

    const res = await fetch('/api/transactions', {
      method: 'POST',
      body: JSON.stringify(newTx)
    });

    const data = await res.json();

    if (res.ok) {
      setResult({ txHash });
    } else {
      alert(data.error || 'Erreur lors de l\'enregistrement');
    }
    setSubmitting(false);
  };

  if (result) return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '4rem 0' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Transaction Enregistrée ✅</h1>
      <div className="card" style={{ marginTop: '2rem', border: '2px solid var(--ve-green)' }}>
         <p style={{ fontWeight: 800, color: 'var(--ve-green)', marginBottom: '1.5rem' }}>✓ Données scellées sur la Blockchain</p>
         <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
           <p style={{ fontSize: '0.8rem' }}><strong>TX HASH:</strong> <code style={{ wordBreak: 'break-all' }}>{result.txHash}</code></p>
         </div>
      </div>
      <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
        <Link href="/app/transactions" className="btn-primary">Voir le Registre</Link>
        <Link href="/app/dashboard" className="btn-outline">Tableau de Bord</Link>
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth: '800px' }}>
      <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '1rem' }}>Nouvelle Transaction</h1>
      <p style={{ color: 'var(--ve-text-muted)', marginBottom: '3rem' }}>Enregistrez une entrée ou une sortie. Une fois validée, la transaction sera immuable.</p>

      <div className="card">
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="form-group">
            <label>DESCRIPTION DE L'OPÉRATION</label>
            <input type="text" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Ex: Achat de semences, Vente de la récolte..." required />
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
             <div className="form-group">
               <label>MONTANT (FCFA)</label>
               <input type="number" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} required />
             </div>
             
             <div className="form-group">
               <label>TYPE D'OPÉRATION</label>
               <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                 <option value="credit">Entrée d'argent (+)</option>
                 <option value="debit">Dépense (-)</option>
               </select>
             </div>
          </div>

          <div className="form-group">
             <label>CATÉGORIE</label>
             <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
               <option>Ventes</option>
               <option>Cotisations</option>
               <option>Subventions</option>
               <option>Engrais</option>
               <option>Matériel</option>
               <option>Infrastructure</option>
               <option>Autre Dépense</option>
             </select>
          </div>

          <button type="submit" className="btn-primary" style={{ marginTop: '2rem', height: '56px', justifyContent: 'center' }} disabled={submitting}>
            {submitting ? 'Signature Blockchain...' : '🔗 Sceller la Transaction'}
          </button>
        </form>
      </div>
    </div>
  );
}
