'use client';
import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { IconShield, IconArrowRight } from '@/components/Icons';

export default function ReportsPage() {
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/reports/monthly')
      .then(res => res.json())
      .then(data => {
        setReport(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-10 text-center font-black uppercase text-primary">Calcul du sceau de transparence...</div>;

  return (
    <div className="space-y-10 p-1 pb-20">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Rapports de <span className="text-primary">Transparence</span></h1>
          <p className="text-slate-500 mt-2 text-lg">Documents certifiés on-chain pour les partenaires et le gouvernement.</p>
        </div>
        <div className="flex gap-4">
           <Button variant="outline" className="rounded-xl border-slate-200 font-bold h-12">Exporter CSV</Button>
           <Button 
             onClick={() => {
               const name = localStorage.getItem('user_name') || 'Admin';
               window.open(`/app/reports/print?type=monthly&signer=${encodeURIComponent(name)}`, '_blank');
             }}
             className="rounded-xl font-bold h-12 px-8 shadow-lg shadow-primary/20"
           >
             Télécharger PDF Certifié
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Résumé Financier */}
        <Card className="lg:col-span-2 border-none shadow-xl rounded-[32px] p-8">
          <CardHeader className="px-0 pt-0">
             <div className="flex justify-between items-center">
                <CardTitle className="text-2xl font-black">Résumé Financier — {report.month}</CardTitle>
                <span className="bg-emerald-50 text-emerald-600 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">Certifié Blockchain</span>
             </div>
          </CardHeader>
          <CardContent className="px-0 pt-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-slate-50 p-8 rounded-[24px] border border-slate-100">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Total Cotisations</p>
                   <p className="text-4xl font-black text-slate-900">{report.financialSummary.totalContributions.toLocaleString()} <span className="text-sm opacity-30">FCFA</span></p>
                </div>
                <div className="bg-slate-50 p-8 rounded-[24px] border border-slate-100">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Total Dépenses</p>
                   <p className="text-4xl font-black text-slate-900">{report.financialSummary.totalExpenses.toLocaleString()} <span className="text-sm opacity-30">FCFA</span></p>
                </div>
                <div className="bg-primary/5 p-8 rounded-[24px] border border-primary/10 md:col-span-2">
                   <div className="flex justify-between items-center">
                      <div>
                        <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2">Solde Actuel de la Coopérative</p>
                        <p className="text-5xl font-black text-slate-900">{report.financialSummary.balance.toLocaleString()} <span className="text-sm opacity-30 font-medium">FCFA</span></p>
                      </div>
                      <IconShield size={60} className="text-primary/20" />
                   </div>
                </div>
             </div>
          </CardContent>
        </Card>

        {/* Gouvernance Info */}
        <Card className="border-none shadow-xl rounded-[32px] p-8 bg-slate-900 text-white">
          <CardHeader className="px-0 pt-0">
             <CardTitle className="text-xl font-black">Gouvernance</CardTitle>
             <CardDescription className="text-slate-400">Métriques de participation</CardDescription>
          </CardHeader>
          <CardContent className="px-0 pt-8 space-y-8">
             <div>
                <div className="flex justify-between mb-2">
                   <span className="text-xs font-bold text-slate-400">Quorum Moyen</span>
                   <span className="text-xs font-black">{(report.governance.averageQuorum * 100).toFixed(1)}%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                   <div className="h-full bg-primary" style={{ width: `${report.governance.averageQuorum * 100}%` }}></div>
                </div>
             </div>
             
             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                   <p className="text-[10px] font-black text-slate-500 uppercase">Votes Tenus</p>
                   <p className="text-2xl font-black">{report.governance.votesHeld}</p>
                </div>
                <div className="space-y-1">
                   <p className="text-[10px] font-black text-slate-500 uppercase">Approuvés</p>
                   <p className="text-2xl font-black text-primary">{report.governance.votesApproved}</p>
                </div>
             </div>

             <div className="pt-8 border-t border-white/5">
                <p className="text-[10px] font-black text-primary uppercase mb-4 tracking-widest">Preuve de Validité</p>
                <div className="bg-white/5 p-4 rounded-2xl space-y-3">
                   <div className="flex justify-between items-center text-[10px]">
                      <span className="text-slate-500">HASH RAPPORT</span>
                      <span className="font-mono text-white/60 truncate ml-4">{report.blockchainProof.reportHash.substring(0, 16)}...</span>
                   </div>
                   <div className="flex justify-between items-center text-[10px]">
                      <span className="text-slate-500">BLOC LEDGER</span>
                      <span className="font-bold text-primary">#{report.blockchainProof.lastBlockNumber}</span>
                   </div>
                </div>
             </div>
          </CardContent>
        </Card>
      </div>

      {/* Détails Techniques pour US5 */}
      <div className="bg-white rounded-[32px] p-12 border border-slate-100 shadow-sm">
         <h3 className="text-2xl font-black mb-8">Détails de l'Audit Gouvernemental</h3>
         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-12">
            {[
               { label: "ID Coopérative", val: report.cooperative.id },
               { label: "Membres Actifs", val: report.membership.activeMembers },
               { label: "Nouveaux Membres", val: report.membership.newMembers },
               { label: "Signataire 1", val: report.cooperative.president + " (P)" },
               { label: "Signataire 2", val: report.cooperative.treasurer + " (T)" },
            ].map((item, i) => (
               <div key={i}>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{item.label}</p>
                  <p className="text-lg font-bold text-slate-900">{item.val}</p>
               </div>
            ))}
         </div>
      </div>
    </div>
  );
}
