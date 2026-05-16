import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';

import { getDB, addTransaction } from '@/lib/db';

export async function GET() {
  try {
    const { transactions } = getDB();
    return NextResponse.json(transactions || []);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Validation basique
    if (!body.description || typeof body.amount !== 'number' || body.amount < 0) {
      return NextResponse.json({ error: 'Données de transaction invalides' }, { status: 400 });
    }

    const newTx = {
      ...body,
      id: 'tx' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      status: body.status || 'confirmed' // Par défaut confirmé pour la démo
    };
    addTransaction(newTx);
    return NextResponse.json(newTx);
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to add transaction' }, { status: 400 });
  }
}
