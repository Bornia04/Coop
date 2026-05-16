import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';

import { getDB, addProposal } from '@/lib/db';

export async function GET() {
  try {
    const { proposals } = getDB();
    return NextResponse.json(proposals || []);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validation basique
    if (!body.title || !body.description || typeof body.amount !== 'number') {
      return NextResponse.json({ error: 'Données de proposition invalides' }, { status: 400 });
    }

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
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to create proposal' }, { status: 500 });
  }
}
