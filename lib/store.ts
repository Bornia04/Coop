export type TxCategory = 'Semences' | 'Engrais' | 'Ventes' | 'Primes' | 'Réserves' | 'Équipement' | 'Frais Admin';
export type TxType = 'credit' | 'debit';
export type ProposalStatus = 'active' | 'approved' | 'rejected';

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: TxType;
  category: TxCategory;
  txHash: string;
  blockNumber: number;
  confirmedAt: string;
}

export interface Vote {
  memberId: string;
  vote: 'for' | 'against';
  txHash: string;
  timestamp: string;
}

export interface Proposal {
  id: string;
  title: string;
  description: string;
  amount: number;
  category: TxCategory;
  createdBy: string;
  createdAt: string;
  deadline: string;
  status: ProposalStatus;
  votesFor: number;
  votesAgainst: number;
  totalMembers: number;
  votes: Vote[];
  txHash: string;
  blockNumber: number;
  executionTxHash?: string;
}

export interface Member {
  id: string;
  name: string;
  role: 'admin' | 'tresorier' | 'membre';
  joinedAt: string;
  contributions: number;
}

export interface CoopStore {
  balance: number;
  totalRevenue: number;
  totalExpenses: number;
  transactions: Transaction[];
  proposals: Proposal[];
  members: Member[];
  lastSync: string;
  currentUser: Member;
}

const SEED_DATA: CoopStore = {
  balance: 4850000,
  totalRevenue: 8200000,
  totalExpenses: 3350000,
  lastSync: new Date().toISOString(),
  currentUser: {
    id: 'm1', name: 'Kofi Amouzou', role: 'tresorier',
    joinedAt: '2024-01-15', contributions: 250000
  },
  members: [
    { id: 'm1', name: 'Kofi Amouzou', role: 'tresorier', joinedAt: '2024-01-15', contributions: 250000 },
    { id: 'm2', name: 'Ama Koffi', role: 'admin', joinedAt: '2024-01-10', contributions: 300000 },
    { id: 'm3', name: 'Yao Mensah', role: 'membre', joinedAt: '2024-02-01', contributions: 150000 },
    { id: 'm4', name: 'Akosua Doe', role: 'membre', joinedAt: '2024-02-15', contributions: 120000 },
    { id: 'm5', name: 'Kwame Asante', role: 'membre', joinedAt: '2024-03-01', contributions: 180000 },
  ],
  transactions: [
    { id: 't1', date: '2026-04-28', description: 'Vente café - Lot Q1 2026', amount: 1200000, type: 'credit', category: 'Ventes', txHash: '0xabc123def456789012345678901234567890abcdef123456789012345678901234', blockNumber: 18423001, confirmedAt: '2026-04-28T09:15:00Z' },
    { id: 't2', date: '2026-04-25', description: 'Achat semences maïs - 200kg', amount: 480000, type: 'debit', category: 'Semences', txHash: '0x1f2e3d4c5b6a7988776655443322110099887766554433221100998877665544', blockNumber: 18421500, confirmedAt: '2026-04-25T11:30:00Z' },
    { id: 't3', date: '2026-04-20', description: 'Primes membres - Mars 2026', amount: 350000, type: 'debit', category: 'Primes', txHash: '0xdeadbeef1234567890abcdef1234567890abcdef1234567890abcdef12345678', blockNumber: 18418200, confirmedAt: '2026-04-20T14:00:00Z' },
    { id: 't4', date: '2026-04-15', description: 'Cotisations membres - Avril', amount: 940000, type: 'credit', category: 'Réserves', txHash: '0xcafebabe9876543210fedcba9876543210fedcba9876543210fedcba98765432', blockNumber: 18415000, confirmedAt: '2026-04-15T08:00:00Z' },
    { id: 't5', date: '2026-04-10', description: 'Achat engrais NPK - 500kg', amount: 620000, type: 'debit', category: 'Engrais', txHash: '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef', blockNumber: 18410500, confirmedAt: '2026-04-10T10:45:00Z' },
    { id: 't6', date: '2026-04-05', description: 'Vente cacao - Coopérative SOTOCO', amount: 2100000, type: 'credit', category: 'Ventes', txHash: '0xfedcba9876543210fedcba9876543210fedcba9876543210fedcba9876543210', blockNumber: 18406000, confirmedAt: '2026-04-05T16:20:00Z' },
    { id: 't7', date: '2026-03-28', description: 'Frais administratifs Q1', amount: 85000, type: 'debit', category: 'Frais Admin', txHash: '0x1122334455667788990011223344556677889900112233445566778899001122', blockNumber: 18398000, confirmedAt: '2026-03-28T09:00:00Z' },
    { id: 't8', date: '2026-03-20', description: 'Équipement irrigation - Pompe', amount: 380000, type: 'debit', category: 'Équipement', txHash: '0xaabbccddeeff00112233445566778899aabbccddeeff00112233445566778899', blockNumber: 18390000, confirmedAt: '2026-03-20T13:15:00Z' },
    { id: 't9', date: '2026-03-15', description: 'Vente semences - excédent', amount: 290000, type: 'credit', category: 'Semences', txHash: '0x9988776655443322110099887766554433221100998877665544332211009988', blockNumber: 18385000, confirmedAt: '2026-03-15T11:00:00Z' },
    { id: 't10', date: '2026-03-10', description: 'Cotisations membres - Mars', amount: 940000, type: 'credit', category: 'Réserves', txHash: '0x5544332211009988776655443322110099887766554433221100998877665544', blockNumber: 18380000, confirmedAt: '2026-03-10T08:30:00Z' },
    { id: 't11', date: '2026-03-05', description: 'Prime vente café exceptionnel', amount: 730000, type: 'credit', category: 'Primes', txHash: '0x4433221100998877665544332211009988776655443322110099887766554433', blockNumber: 18375000, confirmedAt: '2026-03-05T15:00:00Z' },
    { id: 't12', date: '2026-02-28', description: 'Engrais foliaire - traitement', amount: 195000, type: 'debit', category: 'Engrais', txHash: '0x3322110099887766554433221100998877665544332211009988776655443322', blockNumber: 18368000, confirmedAt: '2026-02-28T09:45:00Z' },
  ],
  proposals: [
    {
      id: 'p1', title: 'Achat engrais Q2 2026', description: 'Acquisition de 1 tonne d\'engrais NPK pour la saison Q2. Fournisseur : AgriTogo SARL. Devis validé par le comité technique.',
      amount: 850000, category: 'Engrais', createdBy: 'Ama Koffi', createdAt: '2026-04-29T10:00:00Z',
      deadline: '2026-05-03T23:59:59Z', status: 'active', votesFor: 18, votesAgainst: 5, totalMembers: 47,
      votes: [], txHash: '0xproposal1hash1234567890abcdef1234567890abcdef1234567890abcdef1234', blockNumber: 18425000
    },
    {
      id: 'p2', title: 'Construction hangar de stockage', description: 'Construction d\'un hangar de 200m² pour stocker les récoltes et éviter les pertes post-récolte estimées à 15% annuellement.',
      amount: 1500000, category: 'Équipement', createdBy: 'Kofi Amouzou', createdAt: '2026-04-10T09:00:00Z',
      deadline: '2026-04-15T23:59:59Z', status: 'approved', votesFor: 31, votesAgainst: 8, totalMembers: 47,
      votes: [], txHash: '0xproposal2hash5678901234abcdef5678901234abcdef5678901234abcdef5678', blockNumber: 18405000,
      executionTxHash: '0xexecuted2hash9012345678abcdef9012345678abcdef9012345678abcdef9012'
    },
    {
      id: 'p3', title: 'Achat véhicule utilitaire', description: 'Acquisition d\'un pick-up pour le transport des récoltes vers les marchés. Coût estimé 3 500 000 FCFA.',
      amount: 3500000, category: 'Équipement', createdBy: 'Yao Mensah', createdAt: '2026-03-20T14:00:00Z',
      deadline: '2026-03-25T23:59:59Z', status: 'rejected', votesFor: 12, votesAgainst: 29, totalMembers: 47,
      votes: [], txHash: '0xproposal3hash3456789012cdef3456789012cdef3456789012cdef3456789012', blockNumber: 18388000
    },
  ]
};

const STORE_KEY = 'coopledger_store';

export function getStore(): CoopStore {
  if (typeof window === 'undefined') return SEED_DATA;
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) {
      localStorage.setItem(STORE_KEY, JSON.stringify(SEED_DATA));
      return SEED_DATA;
    }
    return JSON.parse(raw);
  } catch {
    return SEED_DATA;
  }
}

export function saveStore(store: CoopStore): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORE_KEY, JSON.stringify(store));
}

export function resetStore(): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORE_KEY, JSON.stringify(SEED_DATA));
}

export function addTransaction(store: CoopStore, description: string, amount: number, type: TxType, category: TxCategory): CoopStore {
  const newTx: Transaction = {
    id: 't' + (store.transactions.length + 1),
    date: new Date().toISOString().split('T')[0],
    description,
    amount,
    type,
    category,
    txHash: '0x' + Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join(''),
    blockNumber: store.transactions[0].blockNumber + Math.floor(Math.random() * 10),
    confirmedAt: new Date().toISOString()
  };

  const newStore = {
    ...store,
    transactions: [newTx, ...store.transactions],
    balance: type === 'credit' ? store.balance + amount : store.balance - amount,
    totalRevenue: type === 'credit' ? store.totalRevenue + amount : store.totalRevenue,
    totalExpenses: type === 'debit' ? store.totalExpenses + amount : store.totalExpenses
  };

  saveStore(newStore);
  return newStore;
}

export function formatFCFA(amount: number): string {
  return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA';
}

export function getMonthlyData(transactions: Transaction[]) {
  const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'];
  const now = new Date();
  return months.map((month, i) => {
    const targetMonth = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    const monthTx = transactions.filter(t => {
      const d = new Date(t.date);
      return d.getMonth() === targetMonth.getMonth() && d.getFullYear() === targetMonth.getFullYear();
    });
    const revenue = monthTx.filter(t => t.type === 'credit').reduce((s, t) => s + t.amount, 0);
    const expenses = monthTx.filter(t => t.type === 'debit').reduce((s, t) => s + t.amount, 0);
    return { month, revenue, expenses };
  });
}

export function getCategoryData(transactions: Transaction[]) {
  const cats: Record<string, number> = {};
  transactions.filter(t => t.type === 'debit').forEach(t => {
    cats[t.category] = (cats[t.category] || 0) + t.amount;
  });
  const colors = ['#f0b429','#10b981','#3b82f6','#8b5cf6','#ef4444','#f97316','#06b6d4'];
  return Object.entries(cats).map(([name, value], i) => ({ name, value, color: colors[i % colors.length] }));
}
