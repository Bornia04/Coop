import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, role } = body;

    // Simulation d'une authentification réussie
    // Dans un vrai projet, on vérifierait le mot de passe ici
    const name = email.split('@')[0].replace('.', ' ').replace(/^./, (str: string) => str.toUpperCase());

    return NextResponse.json({
      token: 'mock_jwt_token_for_demo',
      user: {
        id: 'u_' + Math.random().toString(36).substr(2, 9),
        name: name,
        email: email,
        role: role,
      }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
