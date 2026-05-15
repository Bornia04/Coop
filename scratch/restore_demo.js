const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DB_PATH = path.resolve(__dirname, '../db.json');

// Simulation simple de hachage de bloc
function calculateHash(index, previousHash, timestamp, data, nonce) {
  return crypto
    .createHash('sha256')
    .update(index + previousHash + timestamp + JSON.stringify(data) + nonce)
    .digest('hex');
}

function generateBlocks(transactions) {
  const blocks = [];
  
  // Bloc Genèse
  let previousHash = "00000xGENESIS_BLOCK_DATA_HASH_SECURE";
  blocks.push({
    index: 0,
    timestamp: 1714550400000,
    data: { type: 'GENESIS', content: 'CoopLedger Genesis Block' },
    previousHash: '0',
    hash: previousHash,
    nonce: 42
  });

  // Un bloc pour chaque transaction
  transactions.forEach((tx, i) => {
    const index = i + 1    const timestamp = new Date(tx.date).getTime();
;
    const data = { type: 'TRANSACTION', content: tx };
    const nonce = Math.floor(Math.random() * 1000);
    const hash = calculateHash(index, previousHash, timestamp, data, nonce);
    
    blocks.push({
      index,
      timestamp,
      data,
      previousHash,
      hash: "0000" + hash.substring(4), // Simulation de Proof of Work (prefix 0000)
      nonce
    });
    
    previousHash = hash;
  });

  return blocks;
}

const members = [
  { name: "Jean-Pierre Mensah", id: "user_3", role: "membre" },
  { name: "Marie-Noëlle Agbé", id: "user_4", role: "membre" },
  { name: "Kofi Mensah", id: "user_1", role: "president" },
  { name: "Ama Togbe", id: "user_2", role: "tresorier" },
  { name: "Paul Dossou", id: "user_5", role: "membre" },
  { name: "Vladmir", id: "vlad", role: "president" }
];

const categories = ["VENTE CACAO", "COTISATION", "SEMENCES", "MATÉRIEL", "ENGRAIS", "MAINTENANCE"];

function generateTransactions(count) {
  const txs = [];
  const start = new Date("2026-05-01");
  const end = new Date("2026-05-15");

  txs.push({
    id: `tx_init_0`,
    date: "2026-05-01",
    description: "Injection Capital Initial - Fond de Roulement",
    amount: 25000000,
    type: "credit",
    category: "CAPITAL",
    status: "confirmed",
    from: "Membres Fondateurs",
    to: "Coopérative",
    txHash: "0xGENESIS_DEPOSIT_2026"
  });

  for (let i = 0; i < count; i++) {
    const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    const member = members[Math.floor(Math.random() * members.length)];
    const isCredit = Math.random() > 0.4;
    const type = isCredit ? "credit" : "debit";
    const amount = isCredit ? (Math.floor(Math.random() * 1500000) + 500000) : (Math.floor(Math.random() * 400000) + 50000);
    
    txs.push({
      id: `tx_demo_${i}`,
      date: date.toISOString().split('T')[0],
      description: `${isCredit ? "VENTE RECOLTE" : "ACHAT"} - ${member.name}`,
      amount: amount,
      type: type,
      category: isCredit ? "VENTE CACAO" : categories[Math.floor(Math.random() * categories.length)],
      status: "confirmed",
      from: type === "credit" ? member.name : "Coopérative",
      to: type === "credit" ? "Coopérative" : "Fournisseur Agrée",
      txHash: "0x" + Math.random().toString(16).substring(2, 14).toUpperCase()
    });
  }

  return txs.sort((a, b) => new Date(a.date) - new Date(b.date));
}

function updateDB() {
  const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
  const transactions = generateTransactions(60);
  db.transactions = [...transactions].reverse(); // Plus récent en premier pour l'affichage
  db.blocks = generateBlocks(transactions); // Chronologique pour la chaine
  
  db.proposals = [
    {
      id: "p_demo_1",
      title: "Extension du Hangar de Stockage",
      description: "Construction d'une nouvelle zone de 200m2 pour le stockage du cacao sec.",
      amount: 4500000,
      category: "Infrastructure",
      createdBy: "Kofi Mensah",
      createdAt: "2026-05-10T10:00:00Z",
      expiresAt: "2026-05-18T10:00:00Z",
      status: "active",
      votesFor: 12,
      votesAgainst: 2,
      votes: []
    }
  ];

  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
  console.log("Database updated with 61 Blocks in Blockchain Feed.");
}

updateDB();
