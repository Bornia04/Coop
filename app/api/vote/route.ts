import { NextResponse } from 'next/server';
import { castVote } from '@/lib/db';

export async function POST(req: Request) {
  const { proposalId, vote, memberId, txHash } = await req.json();
  const success = castVote(proposalId, vote, memberId, txHash);
  if (success) {
    return NextResponse.json({ success: true });
  }
  return NextResponse.json({ success: false }, { status: 404 });
}
