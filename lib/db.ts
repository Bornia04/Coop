import fs from 'fs';
import path from 'path';

// On cherche le db.json à la racine du projet CoopLedger
const DB_PATH = path.resolve(process.cwd(), 'db.json');

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'credit' | 'debit';
  category: string;
  txHash: string;
  status: 'pending' | 'confirmed';
  validatedBy?: string; // ID du Président
  from?: string;
  to?: string;
  signature?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'president' | 'tresorier' | 'membre';
  passwordHash: string;
}

export interface Proposal {
  id: string;
  title: string;
  description: string;
  amount: number;
  category: string;
  createdBy: string;
  createdAt: string;
  expiresAt: string; // ISO String
  status: 'active' | 'approved' | 'rejected';
  votesFor: number;
  votesAgainst: number;
  votes: { memberId: string; vote: 'for' | 'against'; txHash: string }[];
  txHash?: string;
  blockNumber?: number;
}

const INITIAL_DATA = {
  users: [
    { id: 'u1', email: 'president@coop.com', name: 'Jean Dupont', role: 'president', passwordHash: 'demo-salt:8f457f461f185cc8933ddac481e5a18d0e32a73b4d8c03cec38c8c4c881669296fb6ea4508c6cd61e3b7cf0e8f9331139742f050355baa64487d962fa9631870' },
    { id: 'u2', email: 'tresorier@coop.com', name: 'Marie Curie', role: 'tresorier', passwordHash: 'demo-salt:8f457f461f185cc8933ddac481e5a18d0e32a73b4d8c03cec38c8c4c881669296fb6ea4508c6cd61e3b7cf0e8f9331139742f050355baa64487d962fa9631870' },
    { id: 'u3', email: 'membre@coop.com', name: 'Paul Valéry', role: 'membre', passwordHash: 'demo-salt:8f457f461f185cc8933ddac481e5a18d0e32a73b4d8c03cec38c8c4c881669296fb6ea4508c6cd61e3b7cf0e8f9331139742f050355baa64487d962fa9631870' }
  ],
  transactions: [
    { id: 'tx_20', date: '2024-04-10', description: "Vente Riz - Coopérative de la Vallée", amount: 4200000, type: 'credit', category: 'Ventes', txHash: '0xBC_RIZ_2024_001', status: 'confirmed', from: 'Acheteur Global', to: 'Coopérative' },
    { id: 'tx_19', date: '2024-04-05', description: "Achat Système de Pompage Solaire", amount: 2800000, type: 'debit', category: 'Infrastructure', txHash: '0xBC_SOLAR_PUMP_2024', status: 'confirmed', from: 'Coopérative', to: 'SolarTech' },
    { id: 'tx_18', date: '2024-03-25', description: "Exportation Ananas - Marché Européen", amount: 9500000, type: 'credit', category: 'Ventes', txHash: '0xBC_ANANAS_EXPORT_2024', status: 'confirmed', from: 'Membres', to: 'Coopérative' }
  ],
  proposals: [
    { 
      id: 'p5', title: 'Unité de transformation de manioc', description: 'Ajouter de la valeur à notre production en transformant le manioc en gari et tapioca sur place.', 
      amount: 25000000, category: 'Infrastructure', createdBy: 'Président', createdAt: new Date().toISOString(), 
      expiresAt: new Date(Date.now() + 10 * 24 * 3600000).toISOString(),
      status: 'active', votesFor: 45, votesAgainst: 12, votes: [], txHash: '0xBlockchain_Manioc_Plan' 
    },
    { 
      id: 'p1', title: 'Expansion du parc photovoltaïque', description: 'Installer des panneaux solaires supplémentaires sur le hangar nord pour réduire les coûts énergétiques.', 
      amount: 15000000, category: 'Infrastructure', createdBy: 'Admin', createdAt: '2023-10-01', 
      expiresAt: new Date(Date.now() + 30 * 24 * 3600000).toISOString(),
      status: 'active', votesFor: 65, votesAgainst: 12, votes: [], txHash: '0x7d2f...1a9e' 
    },
    { 
      id: 'p2', title: 'Achat groupé de tracteurs électriques', description: 'Renouveler la flotte de tracteurs avec des modèles électriques pour une agriculture durable.', 
      amount: 45000000, category: 'Matériel', createdBy: 'Admin', createdAt: '2023-10-05', 
      expiresAt: new Date(Date.now() + 15 * 24 * 3600000).toISOString(),
      status: 'active', votesFor: 42, votesAgainst: 40, votes: [], txHash: '0x3a1b...8c4d' 
    }
  ],
  equipment: [
    { name: 'John Deere 8R #04', id: 'JD-2023-004', status: 'Opérationnel', color: '#10B981', date: '15 Apr 2024' },
    { name: 'Moissonneuse Class #01', id: 'CL-2022-001', status: 'En Maintenance', color: '#F59E0B', date: '28 Apr 2024' },
    { name: 'Tracteur Kubota #12', id: 'KB-2023-012', status: 'Opérationnel', color: '#10B981', date: '10 Mar 2024' },
    { name: 'Drone Surveillance A1', id: 'DR-2024-001', status: 'Opérationnel', color: '#10B981', date: '01 May 2024' },
    { name: 'Système Irrigation #08', id: 'IR-2021-008', status: 'Alerte Filtre', color: '#EF4444', date: '22 Apr 2024' }
  ],
  alerts: [
    { title: 'Vidange Requise', description: 'John Deere #08 — 450h dépassées', type: 'critical' },
    { title: 'Contrôle Technique', description: 'Camion Iveco #02 — Échéance dans 3 jours', type: 'warning' },
    { title: 'Changement Filtres', description: 'Système Irrigation Sud — Maintenance préventive', type: 'info' }
  ],
  equipmentStats: [
    { label: 'TRACTEURS', val: '14', icon: '🚜' },
    { label: 'MOISSONNEUSES', val: '4', icon: '🌾' },
    { label: 'UTILITAIRES', val: '9', icon: '🛻' },
    { label: 'OUTILS DIVERS', val: '52', icon: '🔧' }
  ],
  blocks: [
    { 
      index: 0, timestamp: 1714550400000, 
      data: { type: 'GENESIS', content: 'CoopLedger Genesis Block' }, 
      previousHash: '0', hash: '00000xGENESIS_BLOCK_DATA_HASH_SECURE', nonce: 42 
    },
    { 
      index: 1, timestamp: 1714636800000, 
      data: { type: 'TRANSACTION', content: 'Initial Capital Injection' }, 
      previousHash: '00000xGENESIS_BLOCK_DATA_HASH_SECURE', hash: '00000xINITIAL_DEPOSIT_HASH_V1', nonce: 128 
    }
  ]
};

function readDB() {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  let db: any;
  if (!fs.existsSync(DB_PATH)) {
    db = { ...INITIAL_DATA };
  } else {
    const content = fs.readFileSync(DB_PATH, 'utf-8');
    try {
      db = content && content.trim() !== '' ? JSON.parse(content) : { ...INITIAL_DATA };
    } catch (e) {
      db = { ...INITIAL_DATA };
    }
  }

  // Assurer l'existence de toutes les tables avec données de secours si vides
  db.users = (db.users && db.users.length > 0) ? db.users : INITIAL_DATA.users;
  db.transactions = (db.transactions && db.transactions.length > 0) ? db.transactions : INITIAL_DATA.transactions;
  db.proposals = (db.proposals && db.proposals.length > 0) ? db.proposals : INITIAL_DATA.proposals;
  db.blocks = (db.blocks && db.blocks.length > 0) ? db.blocks : INITIAL_DATA.blocks;
  db.equipment = (db.equipment && db.equipment.length > 0) ? db.equipment : INITIAL_DATA.equipment;
  db.alerts = (db.alerts && db.alerts.length > 0) ? db.alerts : INITIAL_DATA.alerts;
  db.equipmentStats = (db.equipmentStats && db.equipmentStats.length > 0) ? db.equipmentStats : INITIAL_DATA.equipmentStats;

  // Auto-conclusion des votes expirés
  let changed = false;
  const now = new Date();
  
  db.proposals.forEach((p: Proposal) => {
    if (p.status === 'active' && p.expiresAt && new Date(p.expiresAt) < now) {
      p.status = p.votesFor >= p.votesAgainst ? 'approved' : 'rejected';
      changed = true;
      
      // Enregistrer la clôture dans le Ledger
      if (p.status === 'approved') {
        db.transactions.unshift({
          id: 'exec_' + Date.now(),
          date: now.toISOString().split('T')[0],
          description: `DÉCISION ADOPTÉE: ${p.title}`,
          amount: p.amount,
          type: 'debit',
          category: p.category,
          status: 'confirmed',
          from: 'Coopérative',
          to: 'Fournisseur (En attente)',
          txHash: '0xEXEC_VOTE_' + p.id
        });
      } else {
        db.transactions.unshift({
          id: 'rej_' + Date.now(),
          date: now.toISOString().split('T')[0],
          description: `DÉCISION REJETÉE: ${p.title}`,
          amount: 0,
          type: 'debit',
          category: 'Gouvernance',
          status: 'confirmed',
          txHash: '0xREJ_VOTE_' + p.id
        });
      }
    }
  });

  if (changed || !fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
  }

  return db;
}

export function writeDB(data: any) {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

export const getDB = () => readDB();

import { Blockchain } from './blockchain';

export const addTransaction = (tx: Transaction) => {
  const db = readDB();
  db.transactions.unshift(tx);
  
  // Scellage Blockchain
  const lastBlock = db.blocks[db.blocks.length - 1];
  const previousHash = lastBlock ? lastBlock.hash : '00000000000000000000000000000000';
  const newBlock = Blockchain.createBlock(db.blocks.length, { type: 'TRANSACTION', content: tx }, previousHash);
  db.blocks.push(newBlock);

  writeDB(db);
};

export const addProposal = (p: Partial<Proposal>) => {
  const db = readDB();
  const fullProposal: Proposal = {
    id: p.id || 'p' + Date.now(),
    title: p.title || '',
    description: p.description || '',
    amount: p.amount || 0,
    category: p.category || 'Général',
    createdBy: p.createdBy || 'Anonyme',
    createdAt: new Date().toISOString(),
    expiresAt: p.expiresAt || new Date(Date.now() + 4 * 60000).toISOString(), // 4 min par défaut
    status: 'active',
    votesFor: 0,
    votesAgainst: 0,
    votes: [],
    ...p
  };
  db.proposals.unshift(fullProposal);

  // Scellage Blockchain
  const lastBlock = db.blocks[db.blocks.length - 1];
  const previousHash = lastBlock ? lastBlock.hash : '00000000000000000000000000000000';
  const newBlock = Blockchain.createBlock(db.blocks.length, { type: 'PROPOSAL', content: fullProposal }, previousHash);
  db.blocks.push(newBlock);

  writeDB(db);
};

export const castVote = (proposalId: string, vote: 'for' | 'against', memberId: string, txHash: string) => {
  const db = readDB();
  const p = db.proposals.find((x: any) => x.id === proposalId);
  
  if (!p || p.status !== 'active') return false;

  // Vérifier deadline
  if (new Date(p.expiresAt) < new Date()) {
    return false;
  }

  // 1. Limiter à 1 vote par personne
  const alreadyVoted = p.votes.some((v: any) => v.memberId === memberId);
  if (alreadyVoted) return false;

  // 2. Enregistrer le vote
  if (vote === 'for') p.votesFor++;
  else p.votesAgainst++;
  
  p.votes.push({ memberId, vote, txHash });

  // 3. Logique de conclusion immédiate si quorum atteint
  const totalVotes = p.votesFor + p.votesAgainst;
  if (totalVotes >= db.users.length) { 
    p.status = p.votesFor > p.votesAgainst ? 'approved' : 'rejected';
  }

  // 4. Enregistrer dans le Ledger (Transactions) pour la traçabilité
  db.transactions.unshift({
    id: 'block_' + Date.now(),
    date: new Date().toISOString().split('T')[0],
    description: `VOTE SCÉLLÉ: ${p.title} (${vote === 'for' ? 'POUR' : 'CONTRE'})`,
    amount: 0,
    type: 'credit',
    category: 'Gouvernance',
    txHash: txHash
  });

  // 5. Scellage Blockchain
  const lastBlock = db.blocks[db.blocks.length - 1];
  const previousHash = lastBlock ? lastBlock.hash : '00000000000000000000000000000000';
  const newBlock = Blockchain.createBlock(db.blocks.length, { type: 'VOTE', content: { proposalId, vote, memberId, txHash } }, previousHash);
  db.blocks.push(newBlock);

  writeDB(db);
  return true;
};

export const validateTransaction = (txId: string, presidentId: string) => {
  const db = readDB();
  const tx = db.transactions.find((t: Transaction) => t.id === txId);
  
  if (!tx || tx.status !== 'pending') return false;

  tx.status = 'confirmed';
  tx.validatedBy = presidentId;
  tx.signature = Blockchain.signData(tx, 'PRESIDENT_PRIVATE_KEY_SIM');

  // Scellage Final dans la Blockchain
  const lastBlock = db.blocks[db.blocks.length - 1];
  const previousHash = lastBlock ? lastBlock.hash : '00000000000000000000000000000000';
  const newBlock = Blockchain.createBlock(db.blocks.length, { type: 'VALIDATION', content: tx }, previousHash);
  db.blocks.push(newBlock);

  writeDB(db);
  return true;
};
