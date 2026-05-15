import { NextResponse, NextRequest } from 'next/server';
import { getDB } from '@/lib/db';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = getDB();
  
  const user = db.users.find((u: any) => u.id === id);
  if (!user) {
    return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
  }

  const confirmedTx = db.transactions.filter((t: any) => t.status === 'confirmed');
  
  // Solde global de la coopérative
  const totalIn = confirmedTx.filter((t: any) => t.type === 'credit').reduce((s: number, t: any) => s + t.amount, 0);
  const totalOut = confirmedTx.filter((t: any) => t.type === 'debit').reduce((s: number, t: any) => s + t.amount, 0);
  const globalBalance = totalIn - totalOut;

  // Données spécifiques au membre
  const memberContributions = confirmedTx
    .filter((t: any) => t.from === user.name)
    .reduce((s: number, t: any) => s + t.amount, 0);

  // Simulation de primes basées sur la participation aux votes (Réaliste : 2000 FCFA par vote)
  const votedCount = db.proposals.filter((p: any) => p.votes && p.votes.some((v: any) => v.memberId === id)).length;
  const totalRewards = votedCount * 2000;

  // Solde calculé : Base fixe de bienvenue (15000) + Cotisations réelles + Primes réelles
  const memberBalance = 15000 + memberContributions + totalRewards;

  // Historique complet (Filtré pour le membre)
  const memberHistory = confirmedTx
    .filter((t: any) => t.from === user.name || t.to === user.name)
    .map((t: any) => ({
      ...t,
      blockHash: t.txHash,
      signature: t.signature || 'Certifié Ledger'
    }));

  return NextResponse.json({
    member: user.name,
    balance: memberBalance,
    globalBalance,
    totalContributions: memberContributions,
    totalRewards,
    transactions: memberHistory
  });
}
