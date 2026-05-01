import { NextResponse } from 'next/server';
import { getDB, addProposal } from '@/lib/db';

export async function GET() {
  const { proposals } = getDB();
  return NextResponse.json(proposals);
}

export async function POST(req: Request) {
  const body = await req.json();
  const newProposal = {
    ...body,
    id: 'p' + Date.now(),
    createdAt: new Date().toISOString(),
    status: 'active',
    votesFor: 0,
    votesAgainst: 0,
    votes: []
  };
  addProposal(newProposal);
  return NextResponse.json(newProposal);
}
