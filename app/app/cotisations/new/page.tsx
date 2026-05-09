'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { IconShield } from '@/components/Icons';

export default function NewCotisation() {
  const [formData, setFormData] = useState({
    member: '',
    amount: '',
    category: 'COTISATION'
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: `Cotisation: ${formData.member}`,
          amount: Number(formData.amount),
          type: 'credit',
          category: formData.category,
          from: formData.member,
          to: 'Coopérative',
          status: 'pending' // En attente de signature du président
        }),
      });

      if (res.ok) {
        setSuccess(true);
        setFormData({ member: '', amount: '', category: 'COTISATION' });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10">
      <Card className="border-none shadow-2xl rounded-[32px] p-6">
        <CardHeader>
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-4">
             <IconShield size={24} />
          </div>
          <CardTitle className="text-3xl font-black">Enregistrer une Cotisation</CardTitle>
          <CardDescription>
            Use Case 1 : Saisie par le Trésorier pour validation multi-sig.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {success && (
              <div className="bg-emerald-50 text-emerald-600 p-4 rounded-2xl text-sm font-bold border border-emerald-100">
                Transaction enregistrée avec succès ! En attente de signature du Président.
              </div>
            )}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Nom du Membre</label>
              <Input 
                placeholder="Jean-Pierre Mensah" 
                className="rounded-xl border-slate-100 bg-slate-50 h-12 font-bold"
                value={formData.member}
                onChange={(e) => setFormData({...formData, member: e.target.value})}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Montant (FCFA)</label>
                <Input 
                  type="number"
                  placeholder="10000" 
                  className="rounded-xl border-slate-100 bg-slate-50 h-12 font-bold"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Catégorie</label>
                <select 
                  className="w-full h-12 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-sm font-bold"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  <option value="COTISATION">Cotisation Annuelle</option>
                  <option value="ADHESION">Frais d'Adhésion</option>
                  <option value="DONS">Don / Aide</option>
                </select>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full h-14 rounded-2xl text-lg font-black shadow-xl shadow-primary/20" disabled={loading}>
              {loading ? 'Traitement...' : 'Valider et Signer (Trésorier)'}
            </Button>
            <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-tighter">
              Cette transaction sera envoyée au Président pour scellage final.
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
