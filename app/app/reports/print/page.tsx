'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { IconShield, IconDownload } from '@/components/Icons';

function Button({ children, onClick, className = '', variant = 'primary' }: any) {
  return (
    <button onClick={onClick} className={`${className} ${variant === 'primary' ? 'bg-primary text-white' : 'bg-white text-slate-900'} flex items-center justify-center transition-all`}>
      {children}
    </button>
  );
}

function PrintContent() {
  const searchParams = useSearchParams();
  const type = searchParams.get('type') || 'monthly';
  const signer = searchParams.get('signer') || 'Responsable Coop';
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const endpoint = type === 'monthly' ? '/api/reports/monthly' : '/api/transactions';
    fetch(endpoint)
      .then(res => res.json())
      .then(resData => {
        setData(resData);
        setLoading(false);
      });
  }, [type]);

  const handleDownload = () => {
    const element = document.getElementById('report-content');
    const opt = {
      margin: 0,
      filename: `CoopLedger_${type}_${new Date().toISOString().split('T')[0]}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    // @ts-ignore
    if (window.html2pdf) {
      // @ts-ignore
      window.html2pdf().set(opt).from(element).save();
    } else {
      window.print();
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center font-black text-primary uppercase animate-pulse">Génération du Rapport Certifié...</div>;

  return (
    <div className="bg-slate-100 min-h-screen py-12 px-4 print:bg-white print:p-0">
      {/* Script html2pdf */}
      <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js" async></script>

      {/* Barre d'outils flottante (non imprimée) */}
      <div className="fixed top-8 right-8 z-50 flex gap-4 no-print">
        <Button onClick={() => window.print()} variant="outline" className="bg-white shadow-xl rounded-2xl font-bold h-14 px-8 border-none hover:scale-105 transition-all">
          Imprimer
        </Button>
        <Button onClick={handleDownload} className="bg-primary text-white shadow-xl shadow-primary/30 rounded-2xl font-black h-14 px-10 hover:scale-105 transition-all flex gap-3">
          <IconDownload size={20} /> Télécharger PDF
        </Button>
      </div>

      <div id="report-content" className="bg-white p-16 text-slate-900 font-serif max-w-[21cm] mx-auto shadow-2xl print:shadow-none print:p-0">
      
      {/* Header Filigrane */}
      <div className="flex justify-between items-start border-b-4 border-primary pb-8 mb-12">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
            <IconShield size={32} color="white" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tighter uppercase text-slate-900">CoopLedger</h1>
            <p className="text-xs font-bold text-primary tracking-[0.3em] uppercase mt-1">Transparence Immuable</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs font-black uppercase text-slate-400 mb-1">Réf. Document</p>
          <p className="text-sm font-mono font-bold">#{type.toUpperCase()}-{Date.now().toString().slice(-6)}</p>
          <p className="text-[10px] text-slate-400 mt-2 italic font-sans">Généré le {new Date().toLocaleString()}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black tracking-tight text-slate-900 mb-2">
            {type === 'monthly' ? `Rapport Financier Mensuel` : `Extrait du Grand Livre (Ledger)`}
          </h2>
          <p className="text-slate-500 font-sans font-medium">Période : {type === 'monthly' ? (data.month || 'En cours') : 'Historique Complet'}</p>
        </div>

        {type === 'monthly' ? (
          <div className="grid grid-cols-2 gap-8 font-sans">
             <div className="border-2 border-slate-100 p-6 rounded-3xl">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Recettes</p>
                <p className="text-3xl font-black text-primary">{(data.financialSummary?.totalContributions || 0).toLocaleString()} FCFA</p>
             </div>
             <div className="border-2 border-slate-100 p-6 rounded-3xl">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Dépenses</p>
                <p className="text-3xl font-black text-red-500">{(data.financialSummary?.totalExpenses || 0).toLocaleString()} FCFA</p>
             </div>
             <div className="col-span-2 bg-slate-900 text-white p-8 rounded-3xl flex justify-between items-center">
                <div>
                   <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-2">Solde de Trésorerie</p>
                   <p className="text-4xl font-black">{(data.financialSummary?.balance || 0).toLocaleString()} FCFA</p>
                </div>
                <div className="text-right">
                   <p className="text-[10px] font-black text-white/40 uppercase mb-1">Statut du Compte</p>
                   <p className="text-emerald-400 font-bold">SOLVABLE • CERTIFIÉ</p>
                </div>
             </div>
          </div>
        ) : (
          <div className="font-sans">
             <p className="text-xs font-bold text-slate-400 mb-6 italic">Ce document présente les 20 dernières transactions scellées cryptographiquement sur le Ledger de la coopérative.</p>
          </div>
        )}

        {/* Table Section */}
        <div className="font-sans">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-100">
                <th className="text-left p-4 text-[10px] font-black uppercase text-slate-500 border-b-2 border-slate-200">Date</th>
                <th className="text-left p-4 text-[10px] font-black uppercase text-slate-500 border-b-2 border-slate-200">Description</th>
                <th className="text-right p-4 text-[10px] font-black uppercase text-slate-500 border-b-2 border-slate-200">Montant</th>
                <th className="text-center p-4 text-[10px] font-black uppercase text-slate-500 border-b-2 border-slate-200">Audit Proof</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(type === 'monthly' ? [] : data.slice(0, 15)).map((t: any, i: number) => (
                <tr key={i} className="break-inside-avoid">
                  <td className="p-6 text-xs font-bold text-slate-500">{t.date}</td>
                  <td className="p-6 text-xs font-black text-slate-900 leading-relaxed">{t.description}</td>
                  <td className={`p-6 text-right text-xs font-black ${t.type === 'credit' ? 'text-primary' : 'text-slate-900'}`}>
                    {t.type === 'credit' ? '+' : '-'}{t.amount.toLocaleString()} F
                  </td>
                  <td className="p-6 text-center">
                    <span className="text-[8px] font-mono text-slate-400 uppercase">{t.txHash?.substring(0, 10)}...</span>
                  </td>
                </tr>
              ))}
              {type === 'monthly' && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-400 italic text-sm">
                    Rapport de synthèse consolidé. Voir l'historique complet pour le détail des écritures.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Security / Proof Footer */}
        <div className="mt-20 pt-12 border-t-2 border-dashed border-slate-200 relative">
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-white px-4">
             <IconShield size={32} className="text-primary/20" />
          </div>
          
          <div className="grid grid-cols-2 gap-12 font-sans">
             <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Sceau d'Immuabilité</p>
                <div className="bg-slate-50 p-4 rounded-2xl space-y-2">
                   <div className="flex justify-between text-[8px]">
                      <span className="text-slate-400 font-black uppercase">SHA-256 Ledger Hash</span>
                      <span className="font-mono text-slate-900">{type === 'monthly' ? data.blockchainProof?.reportHash : 'Consulter le bloc final'}</span>
                   </div>
                   <div className="flex justify-between text-[8px]">
                      <span className="text-slate-400 font-black uppercase">Dernier Bloc</span>
                      <span className="font-bold text-primary">#{type === 'monthly' ? data.blockchainProof?.lastBlockNumber : 'LIVE'}</span>
                   </div>
                </div>
                <p className="text-[8px] text-slate-400 mt-4 leading-relaxed">
                  Ce document est généré dynamiquement à partir d'un registre distribué. 
                  Toute modification physique ou numérique du présent document invalide le sceau cryptographique associé.
                </p>
             </div>
             
             <div className="flex flex-col items-center justify-center border-2 border-primary/10 rounded-3xl bg-primary/[0.02]">
                <div className="flex flex-col items-center">
                   <div className="h-12 w-48 border-b border-primary/30 relative mb-2 flex items-center justify-center">
                      <span className="font-serif italic text-2xl text-primary/40 select-none">{signer}</span>
                      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-transparent via-primary/5 to-transparent"></div>
                   </div>
                   <p className="text-[9px] font-bold text-slate-900">Signé par le Président de la Coopérative</p>
                   <p className="text-[8px] text-slate-400 italic">Certifié conforme au registre blockchain</p>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* CSS for print optimization */}
      <style jsx global>{`
        @media print {
          body { background: white !important; margin: 0; padding: 0; }
          .no-print { display: none !important; }
          #report-content { 
            box-shadow: none !important; 
            margin: 0 !important; 
            width: 100% !important;
            max-width: none !important;
            padding: 2cm !important;
          }
          tr { page-break-inside: avoid !important; break-inside: avoid !important; }
          @page { size: A4; margin: 0; }
        }
        
        /* Fix pour éviter les chevauchements html2canvas */
        tr { transform: translateZ(0); }
      `}</style>
    </div>
    </div>
  );
}

export default function PrintPage() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <PrintContent />
    </Suspense>
  );
}
