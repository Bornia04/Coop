import { NextResponse } from 'next/server';
import { getDB, writeDB, addTransaction } from '@/lib/db';
import { Blockchain } from '@/lib/blockchain';

export async function POST(req: Request) {
  const db = getDB();
  const { amountPerMember, description } = await req.json();

  const members = db.users.filter((u: any) => u.role === 'membre');
  
  if (members.length === 0) {
    return NextResponse.json({ error: "Aucun membre éligible" }, { status: 400 });
  }

  // Distribution on-chain
  for (const member of members) {
    const tx = {
      description: description || "Prime de Participation Blockchain",
      amount: amountPerMember,
      type: 'credit',
      category: 'RECOMPENSE',
      from: 'Pool de Gouvernance',
      to: member.name,
      date: new Date().toLocaleDateString('fr-FR'),
      status: 'confirmed',
      txHash: Blockchain.hashData({ to: member.name, amount: amountPerMember, ts: Date.now() })
    };
    
    // On utilise la logique de base de données pour sceller
    db.transactions.push(tx);
    
    // Créer un bloc pour cette distribution
    const lastBlock = db.blocks[db.blocks.length - 1];
    const previousHash = lastBlock ? lastBlock.hash : "00000000000000000000000000000000";
    const blockData = { type: 'REWARD_DISTRIBUTION', member: member.name, amount: amountPerMember };
    const newBlock = Blockchain.createBlock(db.blocks.length, blockData, previousHash);
    db.blocks.push(newBlock);
  }

  writeDB(db);

  return NextResponse.json({ 
    success: true, 
    message: `${members.length} primes distribuées et scellées on-chain.` 
  });
}
