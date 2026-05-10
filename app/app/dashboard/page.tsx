'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { IconShield, IconClock, IconBell, IconTransactions } from '@/components/Icons';
import { useNotify } from '@/components/NotificationProvider';

export default function Dashboard() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [blocks, setBlocks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');
  const { notify } = useNotify();
  const [lastTxCount, setLastTxCount] = useState(0);
  const [lastBlockCount, setLastBlockCount] = useState(0);
  const [lastPropCount, setLastPropCount] = useState(0);

  useEffect(() => {
    setUserName(localStorage.getItem('user_name') || 'Membre');
    setUserRole(localStorage.getItem('user_role') || 'membre');

    const fetchData = async () => {
      try {
        const [txs, blks, props] = await Promise.all([
          fetch('/api/transactions').then(res => res.json()),
          fetch('/api/blocks').then(res => res.json()),
          fetch('/api/proposals').then(res => res.json())
        ]);

        if (lastTxCount > 0 && txs.length > lastTxCount) {
          const newTx = txs[0];
          notify(
            "Nouvelle Transaction",
            `${newTx.description}: ${newTx.amount.toLocaleString()} FCFA`,
            "success"
          );
        }

        if (lastBlockCount > 0 && blks.length > lastBlockCount) {
          notify(
            "Bloc Scellé",
            `Le bloc #${blks[blks.length - 1].index} a été ajouté au Ledger avec succès.`,
            "info"
          );
        }

        if (lastPropCount > 0 && props.length > lastPropCount) {
          notify(
            "Nouveau Vote Ouvert",
            `Une nouvelle proposition "${props[props.length - 1].title}" est ouverte au vote.`,
            "info"
          );
        }

        setTransactions(txs);
        setBlocks(blks);
        setLastTxCount(txs.length);
        setLastBlockCount(blks.length);
        setLastPropCount(props.length);
        setLoading(false);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 2000); // Polling ultra-rapide pour la démo (2s)
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="flex h-full items-center justify-center text-primary font-black uppercase">Synchronisation du Ledger...</div>;

  const totalRevenue = transactions.filter(t => t.type === 'credit').reduce((acc, t) => acc + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'debit').reduce((acc, t) => acc + t.amount, 0);
  const balance = totalRevenue - totalExpenses;

  return (
    <div className="space-y-8 p-1">
      {/* Header avec Profil */}
      <div className="flex justify-between items-center bg-white p-6 rounded-[32px] shadow-sm border border-slate-100">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white font-black text-xl">
            {userName?.[0] || 'M'}
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 leading-none">
              Bienvenue {userRole === 'president' ? 'Président' : (userRole === 'tresorier' ? 'Trésorier' : 'Membre')} {userName}
            </h2>
            <p className="text-[10px] font-black uppercase tracking-widest text-primary mt-1">Accès {userRole}</p>
          </div>
        </div>
        <div className="flex gap-4">
           {userRole === 'president' && (
             <Button 
                onClick={async () => {
                  if(confirm("Distribuer 5000 FCFA de prime à tous les membres ?")) {
                    const res = await fetch('/api/admin/distribute-rewards', {
                      method: 'POST',
                      body: JSON.stringify({ amountPerMember: 5000, description: "Prime de Fin de Récolte" })
                    });
                    if(res.ok) {
                      notify("Succès", "Primes distribuées et scellées on-chain !", "success");
                    }
                  }
                }}
                className="bg-amber-500 hover:bg-amber-600 rounded-xl font-bold text-white shadow-lg shadow-amber-200"
              >
                Distribuer Primes
              </Button>
           )}
           <div className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border border-emerald-100">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              Node Online • {blocks.length} Blocs
           </div>
           <Button variant="outline" className="rounded-xl font-bold" onClick={() => { localStorage.clear(); window.location.href = '/app/login'; }}>
             Déconnexion
           </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-slate-900 text-white border-none rounded-[32px] overflow-hidden relative">
          <div className="absolute top-0 right-0 p-6 opacity-10">
            <IconShield size={120} />
          </div>
          <CardHeader>
            <CardDescription className="text-white/40 font-black uppercase text-[10px] tracking-widest">Capital Coopératif</CardDescription>
            <CardTitle className="text-4xl font-black">{balance.toLocaleString()} <span className="text-sm opacity-40 font-medium">FCFA</span></CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
               <span>+12.5% vs mois dernier</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-xl rounded-[32px]">
          <CardHeader>
            <CardDescription className="font-black uppercase text-[10px] tracking-widest">Revenus (Saison)</CardDescription>
            <CardTitle className="text-3xl font-black text-emerald-600">+{totalRevenue.toLocaleString()}</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-[70%]"></div>
             </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-xl rounded-[32px]">
          <CardHeader>
            <CardDescription className="font-black uppercase text-[10px] tracking-widest">Dépenses (Saison)</CardDescription>
            <CardTitle className="text-3xl font-black text-red-500">-{totalExpenses.toLocaleString()}</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-red-500 w-[30%]"></div>
             </div>
          </CardContent>
        </Card>
      </div>

      {/* Technical Status (Architectural Proof) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-3 border-none shadow-xl rounded-[32px] bg-white p-6">
           <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black">Surveillance du Réseau</h3>
              <div className="flex gap-2">
                 <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black uppercase border border-emerald-100">Node #001 Online</span>
                 <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[10px] font-black uppercase border border-blue-100">Syncing OK</span>
              </div>
           </div>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Réseau", val: "Mainnet Local", icon: "🌐" },
              { label: "Smart Contract", val: "0xCoop...Gov", icon: "📜" },
              { label: "Blocs Scellés", val: blocks.length, icon: "🧱" },
              { label: "Temps de Bloc", val: "2.4s", icon: "⚡" },
            ].map((s, i) => (
              <div key={i} className="bg-slate-50 p-4 rounded-[20px] flex items-center gap-3">
                 <div className="text-xl">{s.icon}</div>
                 <div>
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{s.label}</p>
                    <p className="text-[10px] font-bold text-slate-900 truncate max-w-[80px]">{s.val}</p>
                 </div>
              </div>
            ))}
           </div>
        </Card>
        <Card className="border-none shadow-xl rounded-[32px] bg-primary p-6 text-white flex flex-col justify-center items-center text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4 animate-pulse">
               <IconShield size={32} color="white" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Score de Confiance</p>
            <p className="text-4xl font-black">99.8%</p>
            <p className="text-[8px] mt-2 opacity-40 font-bold uppercase">Algorithme de Consensus Actif</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Dernières Transactions */}
        <Card className="border-none shadow-xl rounded-[32px] overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50">
            <div>
              <CardTitle className="text-xl font-black">Dernières Preuves</CardTitle>
              <CardDescription>Validées sur le ledger public</CardDescription>
            </div>
            <Link href="/app/transactions" className="text-primary font-black text-xs uppercase hover:underline">Voir tout</Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-50">
              {transactions.slice(0, 5).map((t, i) => (
                <div key={i} className="p-6 flex justify-between items-center hover:bg-slate-50/50 transition-colors">
                  <div className="flex gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${t.type === 'credit' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                      {t.type === 'credit' ? '↓' : '↑'}
                    </div>
                    <div>
                      <p className="font-black text-slate-900 text-sm">{t.description}</p>
                      <p className="text-[10px] font-mono text-slate-400 mt-1 truncate max-w-[150px] uppercase">{t.txHash}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-black text-sm ${t.type === 'credit' ? 'text-primary' : 'text-red-500'}`}>
                      {t.type === 'credit' ? '+' : '-'}{(t.amount || 0).toLocaleString()}
                    </p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">{t.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Live Blockchain Feed */}
        <Card className="border-none shadow-xl rounded-[32px] bg-slate-50">
          <CardHeader>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              <CardTitle className="text-xl font-black">Blockchain Live Feed</CardTitle>
            </div>
            <CardDescription>Flux temps réel des blocs bruts générés</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
               {[...blocks].reverse().slice(0, 10).map((b, i) => (
                 <div key={i} className="bg-white p-4 rounded-2xl border border-slate-100 flex gap-4 items-start shadow-sm">
                    <div className="bg-slate-900 text-white p-2 rounded-lg text-[10px] font-black w-16 text-center">
                       #{b.index}
                    </div>
                    <div className="flex-1 overflow-hidden">
                       <div className="flex justify-between items-center mb-1">
                         <span className="text-[9px] font-black text-primary uppercase tracking-widest">{b.data.type}</span>
                         <span className="text-[8px] font-medium text-slate-400">{new Date(b.timestamp).toLocaleTimeString()}</span>
                       </div>
                       <p className="text-[10px] font-mono text-slate-600 truncate mb-1">HASH: {b.hash}</p>
                       <div className="bg-slate-50 p-2 rounded-lg text-[8px] font-mono text-slate-500 truncate">
                          PREV: {b.previousHash}
                       </div>
                    </div>
                 </div>
               ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
      `}</style>
    </div>
  );
}
