import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;
    const role = body.role || 'membre';

    // Authentification "Porte Ouverte" pour la démo
    const name = email.includes('@') 
      ? email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1)
      : email;

    return NextResponse.json({
      token: 'demo_token_' + Date.now(),
      user: {
        id: 'user_' + Math.random().toString(36).substring(2, 9),
        name: name,
        email: email,
        role: role,
      }
    });
  } catch (error) {
    return NextResponse.json({ 
      token: 'emergency_token',
      user: { id: 'guest', name: 'Invité Démo', email: 'guest@coop.com', role: 'membre' }
    });
  }
}
