'use client';
import Link from 'next/link';
import { useState } from 'react';
import { IconDollar, IconArrowLeftRight, IconUsers, IconEye, IconLock, IconBarChart, IconArrowRight, IconPlus } from '@/components/Icons';

const services = [
  { Icon: IconDollar, title: 'Gestion des contributions', desc: 'Enregistrez et suivez facilement les cotisations de chaque membre en temps réel.' },
  { Icon: IconArrowLeftRight, title: 'Suivi des transactions', desc: "Visualisez toutes les entrées et sorties d'argent avec un historique clair et détaillé." },
  { Icon: IconUsers, title: 'Gestion des membres', desc: 'Ajoutez, modifiez et gérez les membres de votre coopérative facilement.' },
  { Icon: IconEye, title: 'Transparence totale', desc: 'Chaque membre peut consulter les opérations pour renforcer la confiance.' },
  { Icon: IconLock, title: 'Accès sécurisé', desc: 'Différents rôles (président, trésorier, membre) pour un contrôle sécurisé.' },
  { Icon: IconBarChart, title: 'Statistiques simples', desc: 'Analysez la croissance de votre caisse avec des indicateurs clairs.' },
];
const steps = [
  { num: '01', title: 'Créer votre groupe', desc: 'Initialisez votre coopérative et ajoutez les membres.' },
  { num: '02', title: 'Enregistrer les contributions', desc: 'Ajoutez les cotisations et les transactions facilement.' },
  { num: '03', title: 'Suivre les finances', desc: "Consultez les mouvements et l'état de la caisse en temps réel." },
  { num: '04', title: 'Renforcer la confiance', desc: 'Une transparence totale pour tous les membres.' },
];
const faqs = [
  { q: "À qui s'adresse CoopLedger ?", a: 'CoopLedger est conçu pour les coopératives, tontines, associations et groupes souhaitant gérer leurs finances de manière transparente.' },
  { q: 'Les données sont-elles sécurisées ?', a: "Oui, l'accès est sécurisé grâce à un système de rôles (président, trésorier, membre)." },
  { q: 'Puis-je suivre les transactions ?', a: 'Oui, toutes les transactions sont enregistrées et consultables en temps réel.' },
  { q: 'Est-ce facile à utiliser ?', a: 'Oui, CoopLedger est conçu pour être simple et accessible même sans compétences techniques.' },
];

export default function Services() {
  const [openFaq, setOpenFaq] = useState(0);
  return (
    <>
      <section className="page-hero" style={{backgroundImage:"url('/img/bg-img/z.jpg')"}}>
        <div className="page-hero-overlay" />
        <div className="page-hero-content">
          <div className="section-tag">Ce que nous proposons</div>
          <h1>Des solutions pour une <span>gestion coopérative transparente</span></h1>
          <nav className="breadcrumb"><Link href="/">Accueil</Link><span>/</span><span>Services</span></nav>
        </div>
      </section>
      <section className="section">
        <div className="section-inner">
          <div className="services-grid">
            {services.map(({ Icon, title, desc }) => (
              <div className="service-card" key={title}>
                <div className="service-icon"><Icon size={24} color="var(--ve-gold)" /></div>
                <h4>{title}</h4><p>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section" style={{background:'var(--ve-dark2)',borderTop:'1px solid var(--ve-border)',borderBottom:'1px solid var(--ve-border)'}}>
        <div className="section-inner">
          <div className="section-header">
            <div className="section-tag">Comment ça fonctionne</div>
            <h2>Démarrer est <span>Simple</span></h2>
          </div>
          <div className="process-grid">
            {steps.map((s, i) => (
              <div key={s.num} style={{display:'contents'}}>
                <div className="process-step">
                  <div className="process-num">{s.num}</div>
                  <h5>{s.title}</h5><p>{s.desc}</p>
                </div>
                {i < steps.length - 1 && <div className="process-arrow"><IconArrowRight size={24} color="var(--ve-gold)" /></div>}
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="section-inner">
          <div className="faq-grid">
            <div>
              <div className="section-tag">Foire aux Questions</div>
              <h2 style={{color:'var(--ve-white)',fontSize:'clamp(1.6rem,2.5vw,2rem)',fontWeight:800,marginBottom:'1rem'}}>Questions <span style={{color:'var(--ve-gold)'}}>fréquentes</span></h2>
              <p style={{color:'var(--ve-text-muted)',marginBottom:'2rem'}}>Vous ne trouvez pas votre réponse ? <Link href="/contact" style={{color:'var(--ve-gold)'}}>Contactez-nous</Link></p>
              <Link href="/contact" className="btn-primary">Nous contacter</Link>
            </div>
            <div className="faq-list">
              {faqs.map((f, i) => (
                <div className={`faq-item ${openFaq === i ? 'open' : ''}`} key={i}>
                  <div className="faq-q" onClick={() => setOpenFaq(openFaq === i ? -1 : i)}>
                    <span>{f.q}</span><IconPlus size={18} color="var(--ve-gold)" />
                  </div>
                  <div className="faq-a">{f.a}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
