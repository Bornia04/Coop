'use client';
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { IconShield } from '@/components/Icons';

export default function EquipmentPage() {
  const [items, setItems] = useState([
    { id: 1, name: 'Tracteur Massey Ferguson', status: 'optimal', lastRepair: '12/03/2024', value: '15,000,000' },
    { id: 2, name: 'Pompe Solaire Irrigation', status: 'optimal', lastRepair: '01/04/2024', value: '2,500,000' },
    { id: 3, name: 'Drone Surveillance (DJI)', status: 'maintenance', lastRepair: '05/05/2024', value: '1,200,000' },
  ]);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    setUserRole(localStorage.getItem('user_role') || 'membre');
  }, []);

  const handleRepair = async (id: number, name: string) => {
    if (!confirm(`Engager les frais de réparation pour ${name} ?`)) return;

    // Simulation de la transaction blockchain de maintenance
    const tx = {
      description: `Maintenance Équipement : ${name}`,
      amount: 45000,
      type: 'debit',
      category: 'MAINTENANCE',
      from: 'Caisse Coopérative',
      to: 'Atelier Mécanique Central',
      date: new Date().toLocaleDateString('fr-FR'),
      status: 'confirmed'
    };

    await fetch('/api/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tx)
    });

    setItems(items.map(item => item.id === id ? { ...item, status: 'optimal', lastRepair: new Date().toLocaleDateString('fr-FR') } : item));
    alert("Réparation certifiée et payée via le Ledger.");
  };

  return (
    <div className="space-y-10 p-1">
      <div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Parc d'<span className="text-primary">Équipement</span></h1>
        <p className="text-slate-500 mt-2 text-lg">Inventaire des actifs certifiés et suivi de maintenance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {items.map((item) => (
          <Card key={item.id} className="border-none shadow-xl rounded-[32px] overflow-hidden group">
            <div className={`h-3 ${item.status === 'optimal' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
            <CardHeader className="p-8 pb-4">
              <div className="flex justify-between items-start">
                <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${item.status === 'optimal' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                  {item.status === 'optimal' ? 'Opérationnel' : 'En Maintenance'}
                </span>
                <IconShield size={20} className="text-slate-200" />
              </div>
              <CardTitle className="text-2xl font-black text-slate-900 mt-6">{item.name}</CardTitle>
            </CardHeader>
            <CardContent className="p-8 pt-0 space-y-6">
              <div className="flex justify-between items-end border-b border-slate-50 pb-4">
                <p className="text-[10px] font-black text-slate-400 uppercase">Valeur Asset</p>
                <p className="font-black text-slate-900">{item.value} <span className="text-[8px] opacity-40">FCFA</span></p>
              </div>
              <div className="flex justify-between items-end">
                <p className="text-[10px] font-black text-slate-400 uppercase">Dernière Révision</p>
                <p className="font-bold text-slate-600 text-sm">{item.lastRepair}</p>
              </div>

              {(userRole === 'president' || userRole === 'tresorier') && item.status === 'maintenance' && (
                <Button 
                  onClick={() => handleRepair(item.id, item.name)}
                  className="w-full h-12 rounded-2xl font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-200 mt-4"
                >
                  Payer Réparation (Blockchain)
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="bg-white p-8 rounded-[32px] border border-slate-100 flex items-center justify-between shadow-sm">
         <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary text-3xl font-black italic">
               %
            </div>
            <div>
               <h4 className="text-xl font-black text-slate-900">Distribution de Primes</h4>
               <p className="text-sm text-slate-500">Distribuer les ristournes annuelles aux membres actifs.</p>
            </div>
         </div>
         {(userRole === 'president') && (
            <Button className="rounded-2xl h-14 px-10 font-black shadow-xl shadow-primary/20">Lancer l'Airdrop de Saison</Button>
         )}
      </div>
    </div>
  );
}
