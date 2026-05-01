import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'db.json');

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'credit' | 'debit';
  category: string;
  txHash: string;
}

export interface Proposal {
  id: string;
  title: string;
  description: string;
  amount: number;
  category: string;
  createdBy: string;
  createdAt: string;
  status: 'active' | 'approved' | 'rejected';
  votesFor: number;
  votesAgainst: number;
  votes: { memberId: string; vote: 'for' | 'against'; txHash: string }[];
}

const INITIAL_DATA = {
  transactions: [
    { id: '1', date: '2023-10-24', description: "Achat d'engrais organique", amount: 1245000, type: 'debit', category: 'Engrais', txHash: '0x8F2...4C2' },
    { id: '2', date: '2023-10-22', description: "Vente récolte maïs", amount: 8210000, type: 'credit', category: 'Ventes', txHash: '0x3D1...9A4' },
    { id: '3', date: '2023-10-20', description: "Location tracteur", amount: 350000, type: 'debit', category: 'Matériel', txHash: '0x9E3...1B7' },
    { id: '4', date: '2023-10-18', description: "Subvention d'État", amount: 5000000, type: 'credit', category: 'Subventions', txHash: '0x2A4...8C5' },
    { id: '5', date: '2023-10-15', description: "Maintenance système d'irrigation", amount: 150000, type: 'debit', category: 'Infrastructure', txHash: '0x1F5...7D6' }
  ],
  proposals: [
    { 
      id: 'p1', title: 'Expansion du parc photovoltaïque', description: 'Installer des panneaux solaires supplémentaires sur le hangar nord pour réduire les coûts énergétiques de la coopérative.', 
      amount: 15000000, category: 'Infrastructure', createdBy: 'Admin', createdAt: '2023-10-01', 
      status: 'active', votesFor: 12, votesAgainst: 3, votes: [] 
    },
    { 
      id: 'p2', title: 'Achat groupé de tracteurs électriques', description: 'Renouveler la flotte de tracteurs avec des modèles électriques pour une agriculture plus verte.', 
      amount: 45000000, category: 'Matériel', createdBy: 'Admin', createdAt: '2023-10-05', 
      status: 'active', votesFor: 42, votesAgainst: 40, votes: [] 
    },
    { 
      id: 'p3', title: 'Changement de prestataire logistique', description: 'Passer à un transporteur local pour la distribution de nos produits.', 
      amount: 0, category: 'Logistique', createdBy: 'Admin', createdAt: '2023-09-15', 
      status: 'approved', votesFor: 92, votesAgainst: 5, votes: [] 
    }
  ],
  equipment: [
    { name: 'John Deere 8R #04', id: 'JD-2023-004', status: 'Opérationnel', color: 'var(--ve-green)', date: '15 Oct 2023' },
    { name: 'Moissonneuse Class #01', id: 'CL-2022-001', status: 'En Maintenance', color: '#F59E0B', date: '28 Oct 2023' },
    { name: 'Tracteur Kubota #12', id: 'KB-2023-012', status: 'Opérationnel', color: 'var(--ve-green)', date: '10 Sep 2023' },
    { name: 'Drone Surveillance A1', id: 'DR-2024-001', status: 'Opérationnel', color: 'var(--ve-green)', date: '01 Nov 2023' }
  ],
  alerts: [
    { title: 'Vidange Requise', description: 'John Deere #08 — 450h dépassées', type: 'critical' },
    { title: 'Contrôle Technique', description: 'Remorque Benne #02 — Échéance dans 3 jours', type: 'warning' },
    { title: 'Changement Filtres', description: 'Système Irrigation Sud — Maintenance préventive', type: 'info' }
  ],
  equipmentStats: [
    { label: 'TRACTEURS', val: '12', icon: '🚜' },
    { label: 'MOISSONNEUSES', val: '4', icon: '🌾' },
    { label: 'UTILITAIRES', val: '8', icon: '🛻' },
    { label: 'OUTILS DIVERS', val: '45', icon: '🔧' }
  ]
};

function readDB() {
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify(INITIAL_DATA, null, 2));
    return INITIAL_DATA;
  }
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
}

function writeDB(data: any) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

export const getDB = () => readDB();

export const addTransaction = (tx: Transaction) => {
  const db = readDB();
  db.transactions.unshift(tx);
  writeDB(db);
};

export const addProposal = (p: Proposal) => {
  const db = readDB();
  db.proposals.unshift(p);
  writeDB(db);
};

export const castVote = (proposalId: string, vote: 'for' | 'against', memberId: string, txHash: string) => {
  const db = readDB();
  const p = db.proposals.find((x: any) => x.id === proposalId);
  if (p) {
    if (vote === 'for') p.votesFor++;
    else p.votesAgainst++;
    p.votes.push({ memberId, vote, txHash });
    writeDB(db);
    return true;
  }
  return false;
};
