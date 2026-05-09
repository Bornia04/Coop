'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { IconMapPin, IconPhone, IconMail, IconClock, IconSend } from '@/components/Icons';
import { useNotify } from '@/components/NotificationProvider';

export default function Contact() {
  const [sent, setSent] = useState(false);
  const { notify } = useNotify();
  return (
    <div className="min-h-screen bg-[#020617] text-white pt-32 pb-20 px-6">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/20 blur-[120px] rounded-full -z-10 opacity-30"></div>
      
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full mb-6">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Contact</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6">
            Bâtissons <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400">l'avenir</span> ensemble.
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-white/50 font-medium leading-relaxed">
            Une question ? Un projet ? Notre équipe d'experts blockchain est à votre écoute pour propulser votre coopérative.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Info Cards */}
          <div className="lg:col-span-5 space-y-6">
            {[
              { Icon: IconMapPin, label: 'Siège Social', val: 'Quartier Administratif, Lomé - Togo' },
              { Icon: IconPhone, label: 'Téléphone', val: '+228 97 25 40 50' },
              { Icon: IconMail, label: 'Email Direct', val: 'contact@coopledger.tg' },
              { Icon: IconClock, label: 'Disponibilité', val: 'Lun – Sam, 8h00 – 17h00' },
            ].map((info, i) => (
              <div key={i} className="flex items-center gap-6 p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-primary/30 transition-all group">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <info.Icon size={24} className="text-primary" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-1">{info.label}</p>
                  <p className="text-lg font-bold text-white/90">{info.val}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Contact Form Card */}
          <div className="lg:col-span-7">
            <div className="p-1 rounded-[40px] bg-gradient-to-br from-primary/20 to-transparent">
              <div className="bg-[#0f172a] rounded-[38px] p-8 md:p-12 border border-white/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[80px] -mr-32 -mt-32"></div>
                
                {sent ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-primary/20 text-primary rounded-full flex items-center justify-center mx-auto mb-8 text-3xl animate-bounce">✓</div>
                    <h3 className="text-3xl font-black mb-4">Message envoyé !</h3>
                    <p className="text-white/50 mb-8">Nous reviendrons vers vous dans les plus brefs délais.</p>
                    <Button onClick={() => setSent(false)} variant="outline" className="h-14 px-10 rounded-2xl border-white/10 bg-white/5 font-bold">Envoyer un autre message</Button>
                  </div>
                ) : (
                  <form onSubmit={e => { 
                    e.preventDefault(); 
                    setSent(true); 
                    notify("Demande Envoyée", "Nous avons bien reçu votre message et vous répondrons bientôt.", "success");
                  }} className="space-y-6 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3 group/field">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-4 group-focus-within/field:text-primary transition-colors">Prénom</label>
                        <div className="p-1 rounded-2xl bg-white/5 border border-white/10 group-focus-within/field:border-primary/50 group-hover/field:bg-white/[0.08] transition-all duration-300 shadow-lg group-focus-within/field:shadow-primary/5">
                          <input type="text" placeholder="John" className="w-full bg-transparent border-none focus:ring-0 text-white placeholder:text-white/20 font-semibold p-4" required />
                        </div>
                      </div>
                      <div className="space-y-3 group/field">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-4 group-focus-within/field:text-primary transition-colors">Nom</label>
                        <div className="p-1 rounded-2xl bg-white/5 border border-white/10 group-focus-within/field:border-primary/50 group-hover/field:bg-white/[0.08] transition-all duration-300 shadow-lg group-focus-within/field:shadow-primary/5">
                          <input type="text" placeholder="Doe" className="w-full bg-transparent border-none focus:ring-0 text-white placeholder:text-white/20 font-semibold p-4" required />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3 group/field">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-4 group-focus-within/field:text-primary transition-colors">Email Professionnel</label>
                      <div className="p-1 rounded-2xl bg-white/5 border border-white/10 group-focus-within/field:border-primary/50 group-hover/field:bg-white/[0.08] transition-all duration-300 shadow-lg group-focus-within/field:shadow-primary/5">
                        <input type="email" placeholder="john@coop.org" className="w-full bg-transparent border-none focus:ring-0 text-white placeholder:text-white/20 font-semibold p-4" required />
                      </div>
                    </div>
                    <div className="space-y-3 group/field">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-4 group-focus-within/field:text-primary transition-colors">Votre Message</label>
                      <div className="p-1 rounded-3xl bg-white/5 border border-white/10 group-focus-within/field:border-primary/50 group-hover/field:bg-white/[0.08] transition-all duration-300 shadow-lg group-focus-within/field:shadow-primary/5">
                        <textarea placeholder="Comment pouvons-nous vous aider ?" className="w-full bg-transparent border-none focus:ring-0 text-white placeholder:text-white/20 font-semibold p-4 min-h-[180px] resize-none" required />
                      </div>
                    </div>
                    <Button type="submit" className="w-full h-16 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black text-lg shadow-2xl shadow-primary/30 transition-all hover:scale-[1.01] active:scale-[0.98] mt-4">
                      Envoyer ma demande <IconSend size={20} className="ml-3" />
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

