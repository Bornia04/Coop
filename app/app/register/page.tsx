'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { IconShield } from '@/components/Icons';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'membre'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erreur d\'inscription');
      }

      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('user_name', data.user.name);
      localStorage.setItem('user_role', data.user.role);
      
      window.location.href = '/app/dashboard';
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#022C22] px-4">
      <div className="w-full max-w-[480px] space-y-8">
        <div className="text-center">
          <Link href="/" className="text-4xl font-black text-primary tracking-tighter">CoopLedger</Link>
          <p className="text-white/60 mt-2 font-medium">Rejoignez la coopérative décentralisée</p>
        </div>

        <Card className="border-none shadow-2xl rounded-[32px] p-4">
          <CardHeader className="space-y-1">
            <CardTitle className="text-3xl font-black text-slate-900">Inscription</CardTitle>
            <CardDescription className="text-base text-slate-500">
              Créez votre compte pour participer à la gouvernance.
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
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4 group-focus-within/field:text-primary transition-colors">Nom Complet</label>
                <div className="p-1 rounded-2xl bg-slate-50 border border-slate-200 group-focus-within/field:border-primary group-hover/field:bg-slate-100/50 transition-all duration-300 shadow-sm group-focus-within/field:shadow-md">
                  <input 
                    placeholder="Kofi Mensah" 
                    className="w-full bg-transparent border-none focus:ring-0 text-slate-900 font-bold p-4 h-14"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="space-y-4 group/field">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4 group-focus-within/field:text-primary transition-colors">Email</label>
                <div className="p-1 rounded-2xl bg-slate-50 border border-slate-200 group-focus-within/field:border-primary group-hover/field:bg-slate-100/50 transition-all duration-300 shadow-sm group-focus-within/field:shadow-md">
                  <input 
                    type="email" 
                    placeholder="nom@coop.com" 
                    className="w-full bg-transparent border-none focus:ring-0 focus:outline-none rounded-2xl text-slate-900 font-bold p-4 h-14"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
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
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="space-y-4 group/field">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4 group-focus-within/field:text-primary transition-colors">Rôle souhaité</label>
                <div className="p-1 rounded-2xl bg-slate-50 border border-slate-200 group-focus-within/field:border-primary group-hover/field:bg-slate-100/50 transition-all duration-300 shadow-sm group-focus-within/field:shadow-md">
                  <select 
                    className="w-full h-14 rounded-2xl border-none bg-transparent px-3 py-2 text-sm font-bold focus:ring-0 focus:outline-none"
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                    required
                  >
                    <option value="membre">Membre Agriculteur</option>
                    <option value="tresorier">Trésorier</option>
                    <option value="president">Président</option>
                  </select>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-6 mt-4">
              <Button type="submit" className="w-full h-16 rounded-2xl text-lg font-black shadow-2xl shadow-primary/30 transition-all hover:scale-[1.01] active:scale-[0.98]" disabled={loading}>
                {loading ? 'Création en cours...' : 'Créer mon Compte'}
              </Button>
              <div className="text-center text-sm mb-4">
                <span className="text-slate-500 font-medium">Déjà inscrit ? </span>
                <Link href="/app/login" className="text-primary font-bold hover:underline">Se connecter</Link>
              </div>
            </CardFooter>
          </form>
        </Card>

        <div className="flex items-center justify-center gap-2 text-white/40 text-[10px] font-black uppercase tracking-tighter">
          <IconShield size={14} /> Inscription Sécurisée et Protégée
        </div>
      </div>
    </div>
  );
}
