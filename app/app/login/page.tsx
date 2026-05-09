'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { IconShield } from '@/components/Icons';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erreur de connexion');
      }

      // Stockage sécurisé
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('user_name', data.user.name);
      localStorage.setItem('user_role', data.user.role);
      localStorage.setItem('user_email', data.user.email);

      window.location.href = '/app/dashboard';
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#022C22] px-4">
      <div className="w-full max-w-[520px] space-y-8">
        <div className="text-center">
          <Link href="/" className="text-4xl font-black text-primary tracking-tighter">CoopLedger</Link>
          <p className="text-white/60 mt-2 font-medium">Accès Sécurisé à la Coopérative</p>
        </div>

        <Card className="border-none shadow-2xl rounded-[32px] p-4">
          <CardHeader className="space-y-1">
            <CardTitle className="text-3xl font-black text-slate-900">Bon retour</CardTitle>
            <CardDescription className="text-base text-slate-500">
              Connectez-vous pour accéder au registre de la coopérative.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-bold border border-red-100">
                  {error}
                </div>
              )}
              <div className="space-y-4 group/field">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4 group-focus-within/field:text-primary transition-colors">Email</label>
                <div className="p-1 rounded-2xl bg-slate-50 border border-slate-200 group-focus-within/field:border-primary group-hover/field:bg-slate-100/50 transition-all duration-300 shadow-sm group-focus-within/field:shadow-md">
                  <input 
                    type="email" 
                    placeholder="nom@coop.com" 
                    className="w-full bg-transparent border-none focus:ring-0 focus:outline-none rounded-2xl text-slate-900 font-bold p-4 h-14"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-4 group/field">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4 group-focus-within/field:text-primary transition-colors">Mot de passe</label>
                <div className="p-1 rounded-2xl bg-slate-50 border border-slate-200 group-focus-within/field:border-primary group-hover/field:bg-slate-100/50 transition-all duration-300 shadow-sm group-focus-within/field:shadow-md">
                  <input 
                    type="password" 
                    placeholder="••••••••" 
                    className="w-full bg-transparent border-none focus:ring-0 focus:outline-none rounded-2xl text-slate-900 font-bold p-4 h-14"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-6 mt-4">
              <Button type="submit" className="w-full h-16 rounded-2xl text-lg font-black shadow-2xl shadow-primary/30 transition-all hover:scale-[1.01] active:scale-[0.98]" disabled={loading}>
                {loading ? 'Connexion en cours...' : 'Se connecter'}
              </Button>
              <div className="text-center text-sm mb-4">
                <span className="text-slate-500 font-medium">Nouveau membre ? </span>
                <Link href="/app/register" className="text-primary font-bold hover:underline">Créer un compte</Link>
              </div>
            </CardFooter>
          </form>
        </Card>

        <div className="flex items-center justify-center gap-2 text-white/40 text-[10px] font-black uppercase tracking-tighter">
          <IconShield size={14} /> Connexion Sécurisée et Chiffrée
        </div>
      </div>
    </div>
  );
}
