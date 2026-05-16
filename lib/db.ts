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
  durationHours?: number;
  txHash?: string;
  blockNumber?: number;
}

const INITIAL_DATA = {
  users: [
    { id: 'user_1', name: 'Kofi', email: 'kofi@coop.tg', role: 'president', passwordHash: '123' },
    { id: 'user_2', name: 'Ama', email: 'ama@coop.tg', role: 'tresorier', passwordHash: '123' },
    { id: 'user_3', name: 'Jean-Pierre', email: 'jp@coop.tg', role: 'membre', passwordHash: '123' },
    { id: 'vlad', email: 'vlad@gmail.com', name: 'Vladmir', role: 'president', passwordHash: '123' },
    { id: 'the', email: 'the@gmail.com', name: 'Théodore', role: 'tresorier', passwordHash: '123' },
    { id: 'prevo', email: 'prevo@gmail.com', name: 'Prévost', role: 'membre', passwordHash: '123' }
  ],
  transactions: [],
  proposals: [],
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
    }
  ]
};

let memoryDB: any = null;

function readDB() {
  if (memoryDB) return memoryDB;

  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) {
    try {
      fs.mkdirSync(dir, { recursive: true });
    } catch (e) {
      console.warn("Could not create DB directory, using memory only.");
    }
  }

  let db: any;
  if (!fs.existsSync(DB_PATH)) {
    db = { ...INITIAL_DATA };
    try {
      fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
    } catch (e) {
      console.warn("Could not write initial DB file, using memory only.");
    }
    memoryDB = db;
    return db;
  } 

  try {
    const content = fs.readFileSync(DB_PATH, 'utf-8');
    db = content && content.trim() !== '' ? JSON.parse(content) : { ...INITIAL_DATA };
  } catch (e) {
    db = { ...INITIAL_DATA };
  }

  // S'assurer que les tableaux existent sans écraser les données réelles
  db.users = db.users || INITIAL_DATA.users;
  db.transactions = db.transactions || [];
  db.proposals = db.proposals || [];
  db.blocks = db.blocks || INITIAL_DATA.blocks;
  db.equipment = db.equipment || INITIAL_DATA.equipment;
  db.alerts = db.alerts || INITIAL_DATA.alerts;
  db.equipmentStats = db.equipmentStats || INITIAL_DATA.equipmentStats;

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

  if (changed) {
    try {
      fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
    } catch (e) {
      // Ignored in production
    }
  }

  memoryDB = db;
  return db;
}

export function writeDB(data: any) {
  memoryDB = data;
  try {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
  } catch (e) {
    console.warn("Production Filesystem is Read-Only: Data saved in memory for this session.");
  }
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
    expiresAt: p.expiresAt || (p.durationHours 
      ? new Date(Date.now() + p.durationHours * 3600000).toISOString() 
      : new Date(Date.now() + 2 * 60000).toISOString()), // 2 min par défaut
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
