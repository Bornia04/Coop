'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { type Proposal } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { IconShield, IconClock } from '@/components/Icons';

function CountdownTimer({ expiresAt, onEnd }: { expiresAt: string; onEnd: () => void }) {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const end = new Date(expiresAt).getTime();
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft('EXPIRÉ');
        onEnd();
        clearInterval(timer);
      } else {
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft(`${mins}:${secs < 10 ? '0' : ''}${secs}`);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [expiresAt, onEnd]);

  return (
    <div className="flex items-center gap-2 bg-red-50 text-red-600 px-3 py-1 rounded-full text-[10px] font-black uppercase border border-red-100">
      <IconClock size={12} /> {timeLeft}
    </div>
  );
}

export default function Proposals() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProposals = () => {
    fetch('/api/proposals')
      .then(res => res.json())
      .then(data => {
        setProposals(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProposals();
    const interval = setInterval(fetchProposals, 2000); // Polling ultra-rapide pour la démo (2s)
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="flex h-full items-center justify-center text-primary font-black uppercase">Ouverture du registre de vote...</div>;

  return (
    <div className="space-y-10 p-1">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Gouvernance <span className="text-primary">Participative</span></h1>
          <p className="text-slate-500 mt-2 text-lg">Participez aux décisions stratégiques de la coopérative</p>
        </div>
        <Link href="/app/proposals/new">
          <Button className="rounded-xl h-12 px-8 font-bold shadow-lg shadow-primary/20">+ Créer une Proposition</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {proposals.map((v) => {
          const total = v.votesFor + v.votesAgainst;
          const pct = total > 0 ? Math.round((v.votesFor / total) * 100) : 0;
          const isActive = v.status === 'active';
          
          return (
            <Card key={v.id} className={`border-none shadow-xl rounded-[32px] overflow-hidden transition-all hover:scale-[1.02] ${isActive ? 'ring-4 ring-primary/10' : ''}`}>
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <div className="flex flex-wrap gap-2">
                    <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${isActive ? 'bg-emerald-50 text-emerald-600' : (v.status === 'approved' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600')}`}>
                      {v.status}
                    </span>
                    {isActive && <CountdownTimer expiresAt={v.expiresAt} onEnd={fetchProposals} />}
                  </div>
                  <IconShield size={24} className={isActive ? 'text-primary' : 'text-slate-200'} />
                </div>
                <CardTitle className="text-xl font-black text-slate-900 mt-6 leading-tight h-[3.5rem] overflow-hidden">
                  {v.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2">
                    <span className="text-slate-400">Progression</span>
                    <span className="text-slate-900">{pct}% Pour</span>
                  </div>
                  <div className="h-3 bg-slate-100 rounded-full overflow-hidden flex">
                    <div className={`h-full transition-all duration-1000 ${isActive ? 'bg-primary' : (v.status === 'approved' ? 'bg-primary' : 'bg-red-500')}`} style={{ width: `${pct}%` }}></div>
                    <div className="h-full bg-red-500/20" style={{ width: `${100 - pct}%` }}></div>
                  </div>
                  <div className="flex justify-between mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                    <span>{total} Votes scellés</span>
                    <span>Ledger ID: {v.id}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-slate-50/50 p-6">
                <div className="w-full text-center">
                  {isActive ? (
                    <div className="bg-primary/10 text-primary p-3 rounded-xl text-[10px] font-black uppercase tracking-widest border border-primary/20">
                      Votez via l'application Mobile 📱
                    </div>
                  ) : (
                    <Link href={`/app/proposals/${v.id}`} className="w-full">
                      <Button variant="outline" className="w-full h-12 rounded-xl font-bold">
                        Consulter le Résultat
                      </Button>
                    </Link>
                  )}
                </div>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
