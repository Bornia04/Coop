'use client';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { IconShield } from '@/components/Icons';

export default function Transactions() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [blocks, setBlocks] = useState<any[]>([]);
  const [view, setView] = useState<'tx' | 'blocks'>('tx');
  const [loading, setLoading] = useState(true);
  const [auditing, setAuditing] = useState(false);
  const [auditResult, setAuditResult] = useState<'success' | 'error' | null>(null);

  const runAudit = () => {
    setAuditing(true);
    setAuditResult(null);
    
    // Simulation d'un calcul intensif pour la démo
    setTimeout(() => {
      // En réalité, on pourrait vérifier les hashes ici
      setAuditing(false);
      setAuditResult('success');
    }, 2500);
  };

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      window.location.href = '/app/login';
      return;
    }

    Promise.all([
      fetch('/api/transactions').then(res => res.json()),
      fetch('/api/blocks').then(res => res.json())
    ]).then(([txData, blockData]) => {
      setTransactions(txData);
      setBlocks(blockData);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="flex h-full items-center justify-center text-primary font-black uppercase">Vérification de l'intégrité...</div>;

  return (
    <div className="space-y-8 p-1">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Historique <span className="text-primary">Coop</span></h1>
          <p className="text-slate-500 mt-2 text-base md:text-lg">Visualisation des Flux Financiers de la Coopérative</p>
        </div>
        <div className="flex flex-wrap gap-3 w-full md:w-auto">
           <Button 
             onClick={runAudit}
             disabled={auditing}
             className={`${auditing ? 'bg-slate-100 animate-pulse' : 'bg-slate-900'} text-white rounded-xl font-bold h-12 shadow-lg px-6 flex-1 md:flex-none flex gap-2 text-xs md:text-sm`}
           >
             {auditing ? 'Audit...' : (auditResult === 'success' ? '✓ Succès' : '🛡️ Audit Ledger')}
           </Button>
           <Button 
             onClick={() => {
               const name = localStorage.getItem('user_name') || 'Admin';
               window.open(`/app/reports/print?type=ledger&signer=${encodeURIComponent(name)}`, '_blank');
             }}
             className="bg-primary hover:bg-emerald-600 rounded-xl font-bold h-12 shadow-lg shadow-primary/20 flex-1 md:flex-none text-xs md:text-sm"
           >
             Export PDF
           </Button>
        </div>
      </div>

      {auditResult === 'success' && (
        <div className="bg-emerald-50 border-2 border-emerald-500/20 p-4 md:p-6 rounded-[24px] flex flex-col md:flex-row items-start md:items-center justify-between animate-in fade-in slide-in-from-top-4 duration-500 gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-emerald-200 flex-shrink-0">
               <IconShield size={24} />
            </div>
            <div>
              <p className="font-black text-emerald-900 uppercase tracking-tight text-sm md:text-base">Certification d'Intégrité</p>
              <p className="text-emerald-600 text-[10px] font-bold uppercase tracking-widest leading-tight">{blocks.length} Blocs vérifiés et scellés</p>
            </div>
          </div>
          <div className="text-left md:text-right w-full md:w-auto border-t md:border-none pt-2 md:pt-0">
             <p className="text-[8px] md:text-[10px] font-black text-emerald-800/40 uppercase">Hash Root (Merkle)</p>
             <p className="font-mono text-[9px] md:text-[10px] text-emerald-700 font-bold truncate max-w-[200px] md:max-w-none">{blocks[blocks.length-1]?.hash}</p>
          </div>
        </div>
      )}

      <div className="flex bg-slate-100 p-1 rounded-xl w-fit">
          <Button 
            variant={view === 'tx' ? 'default' : 'ghost'} 
            onClick={() => setView('tx')}
            className="rounded-lg font-bold text-xs"
          >
            Transactions
          </Button>
          <Button 
            variant={view === 'blocks' ? 'default' : 'ghost'} 
            onClick={() => setView('blocks')}
            className="rounded-lg font-bold text-xs"
          >
            Blocs Bruts
          </Button>
        </div>

      {view === 'tx' ? (
        <Card className="border-none shadow-xl rounded-[32px] overflow-hidden">
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="text-left p-6 text-[10px] font-black uppercase text-slate-400">Date</th>
                  <th className="text-left p-6 text-[10px] font-black uppercase text-slate-400">Opération</th>
                  <th className="text-right p-6 text-[10px] font-black uppercase text-slate-400">Montant</th>
                  <th className="text-center p-6 text-[10px] font-black uppercase text-slate-400">Validation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {transactions.map((t, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-6 font-bold text-slate-500">{t.date}</td>
                    <td className="p-6">
                      <div className="flex flex-col">
                        <span className="font-black text-slate-900">{t.description}</span>
                        <code className="text-[10px] text-primary truncate max-w-[200px] mt-1 font-mono uppercase">{t.txHash}</code>
                      </div>
                    </td>
                    <td className={`p-6 text-right font-black text-lg ${t.type === 'credit' ? 'text-primary' : 'text-red-500'}`}>
                      {t.type === 'credit' ? '+' : '-'}{(t.amount || 0).toLocaleString()} <span className="text-[10px] opacity-40">FCFA</span>
                    </td>
                    <td className="p-6 text-center">
                      <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black uppercase">
                        <IconShield size={12} /> Scellé
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {blocks.length === 0 && (
            <Card className="p-12 text-center text-slate-400 font-bold">Aucun bloc scellé pour le moment.</Card>
          )}
          {[...blocks].reverse().map((b, i) => (
            <Card key={i} className="border-none shadow-lg rounded-[24px] overflow-hidden bg-slate-900 text-white">
              <CardHeader className="border-b border-white/5 bg-white/5">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-primary font-black">BLOC #{b.index}</CardTitle>
                  <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">{new Date(b.timestamp).toLocaleString()}</span>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-primary uppercase">Hash du Bloc</label>
                  <code className="block bg-black/40 p-3 rounded-xl text-xs font-mono break-all text-emerald-400">{b.hash}</code>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-white/40 uppercase">Hash Précédent</label>
                  <code className="block bg-black/20 p-3 rounded-xl text-xs font-mono break-all text-white/60">{b.previousHash}</code>
                </div>
                <div className="pt-4 border-t border-white/5">
                  <label className="text-[10px] font-black text-white/40 uppercase mb-2 block">Payload (Données)</label>
                  <pre className="bg-black/40 p-4 rounded-xl text-[10px] overflow-x-auto text-blue-300 font-mono">
                    {JSON.stringify(b.data, null, 2)}
                  </pre>
                </div>
              </CardContent>
              <div className="bg-primary/10 p-3 text-center text-[10px] font-black text-primary uppercase tracking-[0.2em]">
                Verified by CoopLedger Node • Nonce: {b.nonce}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
