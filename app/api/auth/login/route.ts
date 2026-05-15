import { NextResponse } from 'next/server';
import { getDB } from '@/lib/db';
import { AuthService } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email et mot de passe requis' }, { status: 400 });
    }

    const db = getDB();
    const user = db.users.find((u: any) => u.email === email);

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 401 });
    }

    const storedPassword = user.passwordHash || user.password;
    if (!storedPassword) {
      return NextResponse.json({ error: 'Compte mal configuré' }, { status: 500 });
    }

    const isValid = await AuthService.verifyPassword(password, storedPassword);
    if (!isValid) {
      return NextResponse.json({ error: 'Mot de passe incorrect' }, { status: 401 });
    }

    const token = AuthService.generateToken(user);

    return NextResponse.json({ 
      token, 
      user: { id: user.id, name: user.name, role: user.role, email: user.email } 
    });
  } catch (error) {
    console.error('Login Error:', error);
    return NextResponse.json({ error: 'Erreur lors de la connexion' }, { status: 500 });
  }
}
