import { NextResponse } from 'next/server';
import { getDB, addTransaction } from '@/lib/db';

export async function GET() {
  const { transactions } = getDB();
  return NextResponse.json(transactions);
}

export async function POST(req: Request) {
  const body = await req.json();
  const newTx = {
    ...body,
    id: 'tx' + Date.now(),
    date: new Date().toISOString().split('T')[0]
  };
  addTransaction(newTx);
  return NextResponse.json(newTx);
}
