'use client';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{ background: '#0F172A', padding: '5rem 10%', borderTop: '1px solid rgba(255,255,255,0.1)', color: 'white' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '4rem' }}>
        <div>
           <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#10B981', marginBottom: '1.5rem' }}>CoopLedger</div>
           <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, marginBottom: '2rem', maxWidth: '300px' }}>
             La terre produit, la Blockchain certifie, la communauté grandit.
           </p>
           <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>© 2024 CoopLedger. Révolutions Rurales au Togo.</p>
        </div>
        <div>
           <h4 style={{ fontWeight: 800, marginBottom: '1.5rem', fontSize: '0.9rem', color: '#10B981' }}>PLATEFORME</h4>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)' }}>
             <Link href="/app/dashboard" style={{ color: 'inherit', textDecoration: 'none' }}>Dashboard</Link>
             <Link href="/app/transactions" style={{ color: 'inherit', textDecoration: 'none' }}>Ledger Public</Link>
             <Link href="/app/proposals" style={{ color: 'inherit', textDecoration: 'none' }}>Gouvernance</Link>
           </div>
        </div>
        <div>
           <h4 style={{ fontWeight: 800, marginBottom: '1.5rem', fontSize: '0.9rem', color: '#10B981' }}>SOCIÉTÉ</h4>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)' }}>
             <Link href="/a-propos" style={{ color: 'inherit', textDecoration: 'none' }}>Vision</Link>
             <Link href="/contact" style={{ color: 'inherit', textDecoration: 'none' }}>Contact</Link>
             <Link href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Rapports</Link>
           </div>
        </div>
        <div>
           <h4 style={{ fontWeight: 800, marginBottom: '1.5rem', fontSize: '0.9rem', color: '#10B981' }}>LÉGAL</h4>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)' }}>
             <Link href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Confidentialité</Link>
             <Link href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Conditions</Link>
           </div>
        </div>
      </div>
    </footer>
  );
}

