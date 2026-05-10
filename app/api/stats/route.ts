import { NextResponse } from 'next/server';
import { getDB } from '@/lib/db';

export async function GET() {
  const db = getDB();
  return NextResponse.json({
    totalMembers: db.users.length,
    activeProposals: db.proposals.filter((p: any) => p.status === 'active').length,
    totalTransactions: db.transactions.length
  });
}
