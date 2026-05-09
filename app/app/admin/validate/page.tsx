'use client';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { IconShield } from '@/components/Icons';

export default function AdminValidate() {
  const [pendingTx, setPendingTx] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [validating, setValidating] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/transactions')
      .then(res => res.json())
      .then(data => {
        setPendingTx(data.filter((t: any) => t.status === 'pending'));
        setLoading(false);
      });
  }, []);

  const handleValidate = async (txId: string) => {
    setValidating(txId);
    try {
      const res = await fetch('/api/transactions/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          txId,
          presidentId: localStorage.getItem('user_id'),
          token: localStorage.getItem('auth_token')
        }),
      });

      if (res.ok) {
        setPendingTx(prev => prev.filter(t => t.id !== txId));
      } else {
        const data = await res.json();
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setValidating(null);
    }
  };

  if (loading) return <div className="p-10 text-center font-black uppercase text-primary">Chargement des transactions en attente...</div>;

  return (
    <div className="space-y-8 p-1">
      <div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Validation <span className="text-primary">Multi-Sig</span></h1>
        <p className="text-slate-500 mt-2 text-lg">Signez les transactions pour les rendre immuables sur le Ledger.</p>
      </div>

      <div className="grid gap-6">
        {pendingTx.length === 0 && (
          <Card className="p-12 text-center text-slate-400 font-bold border-dashed border-2">
            Aucune transaction en attente de signature.
          </Card>
        )}
        {pendingTx.map((t, i) => (
          <Card key={i} className="border-none shadow-xl rounded-[32px] overflow-hidden">
            <CardContent className="p-8 flex justify-between items-center">
              <div className="flex gap-6 items-center">
                <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center font-black text-xl">
                  {t.from ? t.from[0] : '?'}
                </div>
                <div>
                   <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1">Cotisation / {t.category}</p>
                   <h3 className="text-2xl font-black text-slate-900">{t.description}</h3>
                   <div className="flex gap-4 mt-2 text-xs font-bold text-slate-400">
                      <span>DE: {t.from}</span>
                      <span>DATE: {t.date}</span>
                   </div>
                </div>
              </div>
              <div className="text-right flex items-center gap-8">
                 <div className="space-y-1">
                    <p className="text-3xl font-black text-slate-900">{t.amount.toLocaleString()} <span className="text-sm opacity-40 font-medium">FCFA</span></p>
                    <p className="text-[10px] font-black text-amber-500 uppercase flex items-center justify-end gap-1">
                       <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></div>
                       Signature requise
                    </p>
                 </div>
                 <Button 
                   className="h-14 px-8 rounded-2xl font-black shadow-lg shadow-primary/20"
                   onClick={() => handleValidate(t.id)}
                   disabled={validating === t.id}
                 >
                    {validating === t.id ? 'Scellage...' : 'Signer & Valider'}
                 </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
