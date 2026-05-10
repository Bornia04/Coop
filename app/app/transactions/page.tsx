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

  useEffect(() => {
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
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Historique <span className="text-primary">Coop</span></h1>
          <p className="text-slate-500 mt-2 text-lg">Visualisation des Flux Financiers de la Coopérative</p>
        </div>
        <div className="flex gap-4">
           <Button 
             onClick={() => {
               const name = localStorage.getItem('user_name') || 'Admin';
               window.open(`/app/reports/print?type=ledger&signer=${encodeURIComponent(name)}`, '_blank');
             }}
             className="bg-primary hover:bg-emerald-600 rounded-xl font-bold h-12 shadow-lg shadow-primary/20"
           >
             Exporter Ledger (PDF)
           </Button>
           <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 text-[10px] font-black uppercase space-y-1 shadow-sm">
              <p className="text-slate-400">Réseau Actif</p>
              <p className="text-primary flex items-center gap-2">🟢 Ethereum Sepolia</p>
           </div>
           <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 text-[10px] font-black uppercase space-y-1 shadow-sm">
              <p className="text-slate-400">Voting Contract</p>
              <p className="text-slate-900">0xVot...9e2</p>
           </div>
        </div>
      </div>

      <div className="flex bg-slate-100 p-1 rounded-xl w-fit">
          <Button 
            variant={view === 'tx' ? 'default' : 'ghost'} 
            onClick={() => setView('tx')}
            className="rounded-lg font-bold"
          >
            Transactions
          </Button>
          <Button 
            variant={view === 'blocks' ? 'default' : 'ghost'} 
            onClick={() => setView('blocks')}
            className="rounded-lg font-bold"
          >
            Blocs Bruts
          </Button>
        </div>

      {view === 'tx' ? (
        <Card className="border-none shadow-xl rounded-[32px] overflow-hidden">
          <CardContent className="p-0">
            <table className="w-full">
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
