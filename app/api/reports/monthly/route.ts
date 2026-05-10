import { NextResponse } from 'next/server';
import { getDB } from '@/lib/db';
import { Blockchain } from '@/lib/blockchain';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const month = searchParams.get('month') || 'Avril 2024';

  const db = getDB();
  
  // 1. Calculs Financiers
  const confirmedTx = db.transactions.filter((t: any) => t.status === 'confirmed');
  const totalContributions = confirmedTx
    .filter((t: any) => t.category === 'Cotisations' || t.category === 'COTISATION' || t.type === 'credit')
    .reduce((sum: number, t: any) => sum + t.amount, 0);
    
  const totalExpenses = confirmedTx
    .filter((t: any) => t.type === 'debit')
    .reduce((sum: number, t: any) => sum + t.amount, 0);

  const balance = totalContributions - totalExpenses;

  // 2. Métriques de Gouvernance
  const votesHeld = db.proposals.length;
  const votesApproved = db.proposals.filter((p: any) => p.status === 'approved').length;
  const avgQuorum = db.proposals.length > 0 
    ? db.proposals.reduce((sum: number, p: any) => sum + (p.votesFor + p.votesAgainst), 0) / (db.proposals.length * db.users.length) 
    : 0.78; // Mocked average if no history

  // 3. Structure du Rapport (Alignée sur le Cahier de Charge)
  const report = {
    month,
    generatedAt: new Date().toISOString(),
    cooperative: {
      name: "Coopérative d'Aného",
      id: "COOP_ANEHO_2026",
      president: "Kofi",
      treasurer: "Ama"
    },
    financialSummary: {
      totalContributions,
      totalExpenses,
      totalRewards: totalExpenses * 0.05, // Simulation de ristournes
      balance,
      currency: "FCFA"
    },
    membership: {
      totalMembers: db.users.length,
      activeMembers: db.users.length,
      newMembers: 0
    },
    governance: {
      votesHeld,
      votesApproved,
      votesRejected: votesHeld - votesApproved,
      averageQuorum: avgQuorum,
      averageApprovalRate: 0.85
    },
    blockchainProof: {
      reportHash: Blockchain.hashData({ totalContributions, totalExpenses, balance }),
      lastBlockNumber: db.blocks.length,
      timestamp: Date.now(),
      signature: "0xSignatureGovernanceContract_Custom_SHA256"
    }
  };

  return NextResponse.json(report);
}
