'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { IconShield, IconTractor, IconGouvernance, IconTransactions } from '@/components/Icons';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-primary selection:text-white overflow-x-hidden pt-20">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-6 min-h-[90vh] flex items-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 hover:scale-105"
          style={{ backgroundImage: 'linear-gradient(to bottom, rgba(2, 6, 23, 0.8), rgba(2, 6, 23, 0.9)), url("https://images.unsplash.com/photo-1592982537447-7440770cbfc9?q=80&w=2070&auto=format&fit=crop")' }}
        ></div>
        
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/20 blur-[120px] rounded-full z-10 opacity-30"></div>
        <div className="max-w-7xl mx-auto text-center relative z-20">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full mb-8 animate-fade-in">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Mainnet Local Actif</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-[1.1] mb-8">
            La Confiance <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400">Immuable</span> <br />
            pour l'Agriculture.
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-white/50 font-medium leading-relaxed mb-12">
            Révolutionnez la gestion de votre coopérative avec la puissance de la blockchain. 
            Transparence totale, gouvernance participative et sécurité SHA-256.
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <Link href="/app/register">
              <Button className="h-16 px-12 rounded-2xl bg-white text-slate-950 font-black text-lg hover:scale-105 transition-transform">Démarrer maintenant</Button>
            </Link>
            <Link href="/app/transactions">
              <Button variant="outline" className="h-16 px-12 rounded-2xl border-white/10 bg-white/5 font-black text-lg hover:bg-white/10">Explorer le Ledger</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="solutions" className="max-w-7xl mx-auto px-6 py-32 grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { title: 'Traçabilité Totale', desc: 'Chaque centime est enregistré on-chain de manière indélébile.', icon: IconTransactions },
          { title: 'Vote Décentralisé', desc: 'Les membres décident ensemble de l\'avenir de la coopérative.', icon: IconGouvernance },
          { title: 'Impact Réel', desc: 'Mesurez et prouvez votre impact aux partenaires financiers.', icon: IconTractor },
        ].map((feat, i) => (
          <div key={i} className="group p-10 rounded-[40px] bg-white/5 border border-white/10 hover:border-primary/50 transition-all hover:bg-white/[0.07]">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
              <feat.icon size={32} className="text-primary" />
            </div>
            <h3 className="text-2xl font-black mb-4">{feat.title}</h3>
            <p className="text-white/50 leading-relaxed font-medium">{feat.desc}</p>
          </div>
        ))}
      </section>

      {/* Stats Section */}
      <section id="blockchain" className="border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-6 py-20 flex flex-wrap justify-center gap-20 md:gap-40">
          {[
            { label: 'Transactions', value: '1,240+' },
            { label: 'Membres', value: '150+' },
            { label: 'Blocs Scellés', value: '4,892' },
          ].map((stat, i) => (
            <div key={stat.label} className="text-center">
              <p className="text-5xl font-black mb-2">{stat.value}</p>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Impact Section Placeholder */}
      <section id="impact" className="max-w-7xl mx-auto px-6 py-32 text-center">
         <h2 className="text-4xl md:text-6xl font-black mb-8">Notre Impact</h2>
         <p className="text-white/50 max-w-2xl mx-auto text-lg">Plus qu'une plateforme, une révolution pour l'autonomie des agriculteurs.</p>
      </section>
    </div>
  );
}
