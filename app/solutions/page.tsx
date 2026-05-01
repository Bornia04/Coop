import type { Metadata } from 'next';
import Link from 'next/link';
import { IconShield, IconTrendingUp, IconFileText, IconVote, IconAlertTriangle, IconCreditCard } from '@/components/Icons';

export const metadata: Metadata = {
  title: 'Solutions — CoopLedger',
  description: 'Nos solutions blockchain pour les coopératives agricoles du Togo.',
};

const solutions = [
  { Icon: IconTrendingUp, title: 'Registre Financier Immuable', desc: "Chaque transaction enregistrée sur la blockchain est permanente et vérifiable par tous les membres.", tag: 'Blockchain' },
  { Icon: IconVote, title: 'Gouvernance Démocratique', desc: "Smart Contracts pour valider les dépenses importantes par vote des membres — aucune décision unilatérale possible.", tag: 'Smart Contracts' },
  { Icon: IconShield, title: 'Sécurité des Fonds', desc: "Les règles de gestion sont encodées dans le code. Impossible de contourner les procédures de retrait sans consensus.", tag: 'Sécurité' },
  { Icon: IconFileText, title: 'Rapports Certifiés IFAD', desc: "Génération automatique de rapports de transparence conformes aux exigences des bailleurs de fonds internationaux.", tag: 'Conformité' },
  { Icon: IconAlertTriangle, title: 'Anti-Fraude', desc: "Système d'alertes automatiques pour toute anomalie détectée dans les flux financiers de la coopérative.", tag: 'Anti-fraude' },
  { Icon: IconCreditCard, title: 'Accès au Crédit', desc: "Un historique financier transparent et certifié augmente par 3 les chances d'obtenir un financement bancaire.", tag: 'Financement' },
];

export default function Solutions() {
  return (
    <>
      <section className="page-hero" style={{backgroundImage:"url('/img/bg-img/sol.jpg')"}}>
        <div className="page-hero-overlay" />
        <div className="page-hero-content">
          <div className="section-tag">Nos Solutions</div>
          <h1>Des solutions <span>blockchain</span> pour votre coopérative</h1>
          <nav className="breadcrumb"><Link href="/">Accueil</Link><span>/</span><span>Solutions</span></nav>
        </div>
      </section>
      <section className="section">
        <div className="section-inner">
          <div className="section-header">
            <div className="section-tag">Technologie & Impact</div>
            <h2>Comment CoopLedger <span>résout</span> vos problèmes</h2>
            <p>Chaque solution est conçue pour répondre à un problème concret rencontré par les coopératives agricoles togolaises.</p>
          </div>
          <div className="solutions-grid">
            {solutions.map(({ Icon, title, desc, tag }) => (
              <div className="solution-card" key={title}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'1rem'}}>
                  <div className="service-icon"><Icon size={24} color="var(--ve-gold)" /></div>
                  <span style={{background:'rgba(240,180,41,0.1)',color:'var(--ve-gold)',padding:'0.2rem 0.6rem',borderRadius:'20px',fontSize:'0.75rem',fontWeight:600}}>{tag}</span>
                </div>
                <h4>{title}</h4><p>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="cta-banner" style={{backgroundImage:"url('/img/bg-img/c.jpg')"}}>
        <div className="cta-overlay" />
        <div className="cta-inner">
          <div>
            <h2>Prêt à transformer votre <span>coopérative ?</span></h2>
            <p>Contactez-nous pour une démo gratuite et découvrez comment CoopLedger peut vous aider.</p>
          </div>
          <Link href="/contact" className="btn-white">Demander une démo</Link>
        </div>
      </section>
    </>
  );
}
