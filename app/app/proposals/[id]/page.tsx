'use client';
import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { type Proposal } from '@/lib/db';
import { generateTxHash } from '@/lib/blockchain';
import { IconShield, IconCheck, IconX, IconClock, IconBell } from '@/components/Icons';

export default function ProposalDetail() {
  const { id } = useParams<{ id: string }>();
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [totalMembers, setTotalMembers] = useState<number>(150); // Default to 150 if fails

  const prevVotesCount = useRef<number>(0);

  const fetchProposal = () => {
    fetch('/api/proposals')
      .then(res => res.json())
      .then(data => {
        const found = data.find((p: Proposal) => p.id === id);
        if (found) {
          // Détection de nouveau vote pour notification
          if (prevVotesCount.current > 0 && found.votes.length > prevVotesCount.current) {
            setNotification(`Nouveau vote scellé par ${found.votes[found.votes.length - 1].memberId} !`);
            setTimeout(() => setNotification(null), 5000);
          }
          prevVotesCount.current = found.votes.length;
          setProposal(found);
        }
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProposal();
    fetch('/api/stats').then(res => res.json()).then(data => {
      if (data.totalMembers) setTotalMembers(data.totalMembers);
    });
    const interval = setInterval(fetchProposal, 3000); 
    return () => clearInterval(interval);
  }, [id]);

  // Timer logic
  useEffect(() => {
    if (!proposal || proposal.status !== 'active') return;

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const end = new Date(proposal.expiresAt).getTime();
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft('EXPIRÉ');
        fetchProposal();
        clearInterval(timer);
      } else {
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft(`${mins}:${secs < 10 ? '0' : ''}${secs}`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [proposal]);

  const handleVote = async (vote: 'for' | 'against') => {
    setVoting(true);
    setError(null);
    const txHash = await generateTxHash({ id, vote, ts: Date.now() });
    
    const response = await fetch('/api/vote', {
      method: 'POST',
      body: JSON.stringify({ 
        proposalId: id, 
        vote, 
        memberId: localStorage.getItem('user_name') || 'M1', 
        txHash 
      })
    });
    
    if (!response.ok) {
      setError('Impossible de voter (Deadline expirée ou déjà voté).');
    } else {
      fetchProposal();
    }
    setVoting(false);
  };

  if (loading) return <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: '#059669', fontWeight: 800 }}>Synchronisation Blockchain...</div>;
  if (!proposal) return <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: '#EF4444', fontWeight: 800 }}>Proposition introuvable.</div>;

  const total = proposal.votesFor + proposal.votesAgainst;
  const pct = total > 0 ? Math.round((proposal.votesFor / total) * 100) : 0;
  const isActive = proposal.status === 'active';

  return (
    <div style={{ padding: '1rem 0' }}>
      
      {/* Toast Notification */}
      {notification && (
        <div style={{ position: 'fixed', top: '2rem', right: '2rem', background: '#059669', color: 'white', padding: '1rem 2rem', borderRadius: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', gap: '1rem', zIndex: 1000, animation: 'slideIn 0.3s ease-out' }}>
          <IconBell size={20} />
          <span style={{ fontWeight: 800 }}>{notification}</span>
        </div>
      )}

      <div style={{ marginBottom: '2.5rem' }}>
        <Link href="/app/proposals" style={{ color: '#64748B', fontWeight: 800, fontSize: '0.95rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          ← Retour à la Gouvernance
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '3rem' }}>
        
        <div>
          <div style={{ background: 'white', padding: '3.5rem', borderRadius: '40px', boxShadow: '0 10px 30px -5px rgba(0,0,0,0.05)', border: '1px solid #F1F5F9' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <span style={{ background: '#DCFCE7', color: '#059669', padding: '0.5rem 1.2rem', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 900, letterSpacing: '0.05em' }}>PROPOSITION OFFICIELLE</span>
                {isActive && (
                  <span style={{ background: '#FEF2F2', color: '#EF4444', padding: '0.5rem 1.2rem', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <IconClock size={14} /> CLÔTURE DANS {timeLeft}
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', background: isActive ? '#059669' : (proposal.status === 'approved' ? '#059669' : '#EF4444'), color: 'white', padding: '0.5rem 1.5rem', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 900 }}>
                 <IconShield size={16} /> {proposal.status.toUpperCase()}
              </div>
            </div>
            
            <h1 style={{ fontSize: '2.8rem', fontWeight: 900, color: '#0F172A', marginBottom: '2rem', lineHeight: 1.2 }}>{proposal.title}</h1>
            <div style={{ color: '#475569', fontSize: '1.2rem', lineHeight: 1.8, marginBottom: '3.5rem' }}>{proposal.description}</div>
            
            <div style={{ borderTop: '2px solid #F1F5F9', paddingTop: '2.5rem', display: 'flex', gap: '3rem' }}>
              <div>
                <p style={{ fontSize: '0.8rem', fontWeight: 800, color: '#94A3B8', marginBottom: '0.5rem' }}>CRÉÉ PAR</p>
                <p style={{ fontWeight: 800, color: '#0F172A' }}>{proposal.createdBy}</p>
              </div>
              <div>
                <p style={{ fontSize: '0.8rem', fontWeight: 800, color: '#94A3B8', marginBottom: '0.5rem' }}>ID TRANSACTION</p>
                <code style={{ fontSize: '0.85rem', color: '#64748B' }}>{proposal.txHash?.slice(0, 16) || 'SCELLE_SUR_LEDGER'}...</code>
              </div>
            </div>
          </div>
          
          <div style={{ background: 'white', marginTop: '3rem', borderRadius: '32px', padding: '2.5rem', boxShadow: '0 10px 30px -5px rgba(0,0,0,0.05)', border: '1px solid #F1F5F9' }}>
             <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0F172A', marginBottom: '2rem' }}>Registre des Suffrages</h3>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {proposal.votes.length === 0 ? (
                  <p style={{ textAlign: 'center', padding: '3rem', color: '#94A3B8', fontWeight: 600 }}>Aucun vote n'a encore été scellé pour cette proposition.</p>
                ) : [...proposal.votes].reverse().map((v, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.2rem', background: '#F8FAFC', borderRadius: '16px' }}>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                       <div style={{ width: '40px', height: '40px', background: '#E2E8F0', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: '#64748B' }}>
                         {v.memberId[0]}
                       </div>
                       <div>
                         <p style={{ fontWeight: 800, color: '#0F172A' }}>{v.memberId}</p>
                         <p style={{ fontFamily: 'monospace', fontSize: '0.7rem', color: '#94A3B8' }}>TX: {v.txHash?.slice(0, 20) || 'BLOCK_CONFIRMED'}...</p>
                       </div>
                     </div>
                     <span style={{ 
                        fontWeight: 900, 
                        color: v.vote === 'for' ? '#059669' : '#EF4444',
                        background: v.vote === 'for' ? '#DCFCE7' : '#FEF2F2',
                        padding: '0.4rem 1rem',
                        borderRadius: '100px',
                        fontSize: '0.75rem'
                      }}>
                        {v.vote === 'for' ? 'POUR' : 'CONTRE'}
                      </span>
                  </div>
                ))}
             </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
           
           <div style={{ background: 'white', padding: '2.5rem', borderRadius: '32px', boxShadow: '0 10px 30px -5px rgba(0,0,0,0.05)', border: '1px solid #F1F5F9' }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0F172A', marginBottom: '2rem' }}>État du Scrutin</h3>
              
              <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <span style={{ fontWeight: 800, color: '#059669' }}>POUR ({pct}%)</span>
                  <span style={{ fontWeight: 800, color: '#EF4444' }}>CONTRE ({100 - pct}%)</span>
                </div>
                <div style={{ height: '14px', background: '#F1F5F9', borderRadius: '100px', overflow: 'hidden', display: 'flex' }}>
                  <div style={{ width: `${pct}%`, background: '#059669', transition: 'width 0.5s ease' }}></div>
                  <div style={{ width: `${100 - pct}%`, background: '#EF4444', transition: 'width 0.5s ease' }}></div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', padding: '1.5rem', background: '#F8FAFC', borderRadius: '20px', marginBottom: '2.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                  <span style={{ color: '#64748B', fontWeight: 600 }}>Total des membres</span>
                  <span style={{ fontWeight: 800, color: '#0F172A' }}>{totalMembers}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                  <span style={{ color: '#64748B', fontWeight: 600 }}>Votes exprimés</span>
                  <span style={{ fontWeight: 800, color: '#0F172A' }}>{total}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                  <span style={{ color: '#64748B', fontWeight: 600 }}>Quorum (51% requis)</span>
                  <span style={{ 
                    fontWeight: 800, 
                    color: (total / totalMembers) >= 0.51 ? '#059669' : '#EF4444' 
                  }}>
                    {Math.round((total / totalMembers) * 100)}% { (total / totalMembers) >= 0.51 ? '✓ Atteint' : '✗ Insuffisant' }
                  </span>
                </div>
              </div>
              
              {error && (
                <div style={{ background: '#FEF2F2', color: '#EF4444', padding: '1rem', borderRadius: '12px', fontSize: '0.9rem', fontWeight: 800, marginBottom: '1.5rem', textAlign: 'center', border: '1px solid #FECACA' }}>
                  {error}
                </div>
              )}
              
              {isActive ? (
                <div style={{ background: '#F1F5F9', padding: '1.5rem', borderRadius: '16px', textAlign: 'center', fontWeight: 800, color: '#059669', border: '1px solid #DCFCE7' }}>
                   📱 VOTEZ VIA L'APPLICATION MOBILE
                </div>
              ) : (
                <div style={{ background: '#F1F5F9', padding: '1.5rem', borderRadius: '16px', textAlign: 'center', fontWeight: 800, color: '#64748B' }}>
                  LE VOTE EST TERMINÉ
                </div>
              )}
           </div>

           <div style={{ background: '#0F172A', padding: '2.5rem', borderRadius: '32px', color: 'white' }}>
             <div style={{ marginBottom: '1.5rem' }}>
               <IconShield size={32} color="#10B981" />
             </div>
             <h4 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem' }}>Vérification Blockchain</h4>
             <p style={{ opacity: 0.6, fontSize: '0.9rem', lineHeight: 1.6 }}>
                Chaque vote est unique et protégé par votre clé cryptographique. Une fois émis, il est impossible de le modifier ou de le supprimer du registre.
             </p>
           </div>

        </div>

      </div>
      
      <style jsx>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
