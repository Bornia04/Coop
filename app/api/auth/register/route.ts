import { NextResponse } from 'next/server';
import { getDB, writeDB } from '@/lib/db'; 
import { AuthService } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { email, password, name, role } = await req.json();

    if (!email || !password || !name) {
      return NextResponse.json({ error: 'Champs manquants' }, { status: 400 });
    }

    const db = getDB();
    const userExists = db.users.find((u: any) => u.email === email);

    if (userExists) {
      return NextResponse.json({ error: 'Cet utilisateur existe déjà' }, { status: 400 });
    }

    const passwordHash = await AuthService.hashPassword(password);
    const newUser = {
      id: 'u' + Date.now(),
      email,
      name,
      role: role || 'membre',
      passwordHash
    };

    db.users.push(newUser);
    writeDB(db);

    const token = AuthService.generateToken(newUser);

    return NextResponse.json({ 
      token, 
      user: { id: newUser.id, name: newUser.name, role: newUser.role, email: newUser.email } 
    });
  } catch (error) {
    console.error('Register Error:', error);
    return NextResponse.json({ error: 'Erreur lors de l\'inscription' }, { status: 500 });
  }
}
