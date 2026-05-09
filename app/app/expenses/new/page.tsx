'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { IconShield } from '@/components/Icons';

export default function NewExpense() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: 'ACHAT ENGRAIS',
    beneficiary: ''
  });

  const [userRole, setUserRole] = useState('');
  useEffect(() => {
    setUserRole(localStorage.getItem('user_role') || '');
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const tx = {
      ...formData,
      amount: parseFloat(formData.amount),
      type: 'debit',
      from: 'Caisse Coopérative',
      to: formData.beneficiary || 'Fournisseur',
      date: new Date().toLocaleDateString('fr-FR'),
      status: 'confirmed', // Directement confirmé car initié par un responsable de confiance
      recordedBy: localStorage.getItem('user_name')
    };

    const res = await fetch('/api/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tx)
    });

    if (res.ok) {
      router.push('/app/transactions');
    }
    setLoading(false);
  };

  if (userRole !== 'president' && userRole !== 'tresorier') {
    return <div className="p-10 text-center font-black text-red-500 uppercase">Accès non autorisé</div>;
  }

  return (
    <div className="max-w-2xl mx-auto py-10">
      <Card className="border-none shadow-2xl rounded-[40px] overflow-hidden">
        <div className="bg-slate-900 p-8 text-white flex justify-between items-center">
          <div>
            <CardTitle className="text-3xl font-black">Enregistrer une Dépense</CardTitle>
            <CardDescription className="text-slate-400 mt-2 font-medium">Retrait de fonds certifié on-chain</CardDescription>
          </div>
          <IconShield size={48} className="text-primary opacity-50" />
        </div>
        <CardContent className="p-10">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Motif de la dépense</label>
              <Input 
                placeholder="Ex: Achat groupé d'engrais NPK" 
                className="h-14 rounded-2xl border-slate-100 bg-slate-50 font-bold px-6 focus:ring-primary"
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Montant (FCFA)</label>
                <Input 
                  type="number" 
                  placeholder="0.00" 
                  className="h-14 rounded-2xl border-slate-100 bg-slate-50 font-black px-6 text-xl text-red-600"
                  value={formData.amount}
                  onChange={e => setFormData({...formData, amount: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Bénéficiaire / Fournisseur</label>
                <Input 
                  placeholder="Nom du fournisseur" 
                  className="h-14 rounded-2xl border-slate-100 bg-slate-50 font-bold px-6"
                  value={formData.beneficiary}
                  onChange={e => setFormData({...formData, beneficiary: e.target.value})}
                />
              </div>
            </div>

            <div className="pt-6">
              <Button 
                type="submit" 
                disabled={loading}
                className="w-full h-16 rounded-[24px] text-lg font-black shadow-xl shadow-primary/20 hover:scale-[1.01] transition-all"
              >
                {loading ? 'SCELLAGE SUR LA BLOCKCHAIN...' : 'CERTIFIER LE RETRAIT'}
              </Button>
              <p className="text-center text-[10px] text-slate-400 mt-4 font-bold uppercase tracking-tighter">
                En cliquant, vous générez une preuve immuable de ce retrait.
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
