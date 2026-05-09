'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { generateTxHash, generateBlockNumber, NETWORK } from '@/lib/blockchain';
import { IconShield, IconSend } from '@/components/Icons';
import { ArrowLeft } from 'lucide-react';
import { useNotify } from '@/components/NotificationProvider';

export default function NewProposal() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ txHash: string; block: number } | null>(null);
  const [form, setForm] = useState({ title: '', description: '', amount: '', category: 'Engrais', durationHours: '72' });
  const { notify } = useNotify();

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
        durationHours: parseInt(form.durationHours),
        createdBy: localStorage.getItem('user_name') || 'Admin',
        txHash: hash,
        blockNumber: block
      })
    });

    if (res.ok) {
      setResult({ txHash: hash, block });
      notify("Proposition Blockchain Scellée", "Votre proposition a été enregistrée sur la blockchain.", "success");
    }
    setSubmitting(false);
  };

  if (result) return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '6rem 0', textAlign: 'center' }}>
      <div style={{ background: '#DCFCE7', width: '100px', height: '100px', borderRadius: '50%', margin: '0 auto 2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <IconShield size={48} color="#059669" />
      </div>
      <h1 style={{ fontSize: '3rem', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.02em' }}>Proposition <span style={{ color: '#059669' }}>Scellée</span></h1>
      <p style={{ color: '#64748B', fontSize: '1.2rem', marginTop: '1rem' }}>Votre demande a été enregistrée de manière immuable sur la blockchain.</p>
      
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
    <div className="py-12 max-w-3xl mx-auto px-6">
      <Link 
        href="/app/proposals" 
        className="inline-flex items-center gap-2 text-slate-500 hover:text-primary transition-colors mb-8 font-bold group"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        Retour aux propositions
      </Link>

      <div className="mb-12">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">
          Nouvelle <span className="text-primary">Proposition</span>
        </h1>
        <p className="text-slate-500 mt-2 text-lg">
          Soumettez une nouvelle dépense stratégique au vote de la coopérative
        </p>
      </div>

      <div className="bg-white p-12 rounded-[40px] shadow-2xl shadow-slate-200/50 border border-slate-100">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-4 group/field">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4 group-focus-within/field:text-primary transition-colors">Titre de la proposition</label>
            <div className="p-1 rounded-2xl bg-slate-50 border border-slate-200 group-focus-within/field:border-primary group-hover/field:bg-slate-100/50 transition-all duration-300 shadow-sm group-focus-within/field:shadow-md">
              <input 
                type="text" 
                placeholder="Ex: Achat d'un nouveau tracteur Massey Ferguson" 
                className="w-full bg-transparent border-none focus:ring-0 focus:outline-none rounded-2xl text-slate-900 font-bold p-4 h-14"
                value={form.title}
                onChange={(e) => setForm({...form, title: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="space-y-4 group/field">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4 group-focus-within/field:text-primary transition-colors">Description détaillée</label>
            <div className="p-1 rounded-2xl bg-slate-50 border border-slate-200 group-focus-within/field:border-primary group-hover/field:bg-slate-100/50 transition-all duration-300 shadow-sm group-focus-within/field:shadow-md">
              <textarea 
                placeholder="Justifiez le besoin et l'impact sur la productivité..." 
                className="w-full bg-transparent border-none focus:ring-0 focus:outline-none rounded-2xl text-slate-900 font-bold p-4 min-h-[150px]"
                value={form.description}
                onChange={(e) => setForm({...form, description: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4 group/field">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4 group-focus-within/field:text-primary transition-colors">Montant estimé (FCFA)</label>
              <div className="p-1 rounded-2xl bg-slate-50 border border-slate-200 group-focus-within/field:border-primary group-hover/field:bg-slate-100/50 transition-all duration-300 shadow-sm group-focus-within/field:shadow-md">
                <input 
                  type="number" 
                  className="w-full bg-transparent border-none focus:ring-0 focus:outline-none rounded-2xl text-slate-900 font-bold p-4 h-14"
                  value={form.amount}
                  onChange={(e) => setForm({...form, amount: e.target.value})}
                  required
                />
              </div>
            </div>
            <div className="space-y-4 group/field">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4 group-focus-within/field:text-primary transition-colors">Catégorie d'investissement</label>
              <div className="p-1 rounded-2xl bg-slate-50 border border-slate-200 group-focus-within/field:border-primary group-hover/field:bg-slate-100/50 transition-all duration-300 shadow-sm group-focus-within/field:shadow-md">
                <select 
                  className="w-full h-14 rounded-2xl border-none bg-transparent px-4 text-sm font-bold focus:ring-0 focus:outline-none"
                  value={form.category}
                  onChange={(e) => setForm({...form, category: e.target.value})}
                >
                  <option>Semences</option>
                  <option>Engrais</option>
                  <option>Matériel</option>
                  <option>Infrastructure</option>
                </select>
              </div>
            </div>
          </div>

          <div 
            className={`p-6 rounded-2xl border transition-all duration-300 flex items-center gap-4 cursor-pointer ${
              form.durationHours === '1'
                ? "bg-red-50 border-red-200 shadow-lg shadow-red-100" 
                : "bg-slate-50 border-slate-100 hover:bg-slate-100"
            }`}
            onClick={() => setForm({...form, durationHours: form.durationHours === '1' ? '72' : '1'})}
          >
            <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${
              form.durationHours === '1' ? "bg-red-500 border-red-500" : "border-slate-300 bg-white"
            }`}>
              {form.durationHours === '1' && <div className="w-2 h-2 bg-white rounded-full animate-pulse" />}
            </div>
            <div>
              <p className={`text-xs font-black uppercase tracking-widest ${
                form.durationHours === '1' ? "text-red-600" : "text-slate-600"
              }`}>
                Proposition Urgente (Vote de 1 minute)
              </p>
            </div>
          </div>

          <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 flex items-start gap-4">
            <IconShield size={24} color="#059669" className="mt-1 flex-shrink-0" />
            <p className="text-sm text-slate-600 font-medium leading-relaxed">
              Cette proposition sera scellée de manière immuable. Une fois soumise, elle ne pourra plus être modifiée et sera soumise au vote.
            </p>
          </div>

          <button 
            type="submit" 
            disabled={submitting}
            className="w-full h-16 rounded-2xl bg-primary text-white font-black text-lg shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 flex items-center justify-center gap-3"
          >
            {submitting ? (
              "Signature en cours..."
            ) : (
              <>
                <IconSend size={20} />
                Envoyer la Proposition
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

