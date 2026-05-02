import { NextResponse } from 'next/server';
import { castVote } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { proposalId, vote, memberId, txHash } = await req.json();
    const success = castVote(proposalId, vote, memberId, txHash);
    if (success) {
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ success: false, error: 'Vote impossible ou déjà effectué' }, { status: 400 });
  } catch (error) {
    console.error('Vote API Error:', error);
    return NextResponse.json({ success: false, error: 'Erreur serveur' }, { status: 500 });
  }
}
