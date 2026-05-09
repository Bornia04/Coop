import { NextResponse } from 'next/server';
import { validateTransaction } from '@/lib/db';
import { AuthService } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { txId, presidentId, token } = await req.json();

    // Vérifier le token et le rôle
    const user = AuthService.verifyToken(token);
    if (!user || user.role !== 'president') {
      return NextResponse.json({ error: 'Accès refusé. Rôle Président requis.' }, { status: 403 });
    }

    const success = validateTransaction(txId, presidentId);
    if (success) {
      return NextResponse.json({ success: true, message: 'Transaction validée et scellée on-chain.' });
    } else {
      return NextResponse.json({ error: 'Échec de la validation.' }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
