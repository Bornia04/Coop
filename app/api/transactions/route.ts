import { NextResponse } from 'next/server';
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
    const newTx = {
      ...body,
      id: 'tx' + Date.now(),
      date: new Date().toISOString().split('T')[0]
    };
    addTransaction(newTx);
    return NextResponse.json(newTx);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to add transaction' }, { status: 500 });
  }
}
