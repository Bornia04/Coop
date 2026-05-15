const fs = require('fs');
const path = require('path');

const DB_PATH = path.resolve(__dirname, '../db.json');

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

  // 1. On commence par une grosse injection de capital pour être positif
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
    const category = categories[Math.floor(Math.random() * categories.length)];
    
    // On force plus de crédits ou des montants plus élevés pour les ventes
    const isCredit = Math.random() > 0.4; // 60% de chances de crédit
    const type = isCredit ? "credit" : "debit";
    
    // Les ventes de cacao rapportent gros
    const amount = isCredit ? (Math.floor(Math.random() * 1500000) + 500000) : (Math.floor(Math.random() * 400000) + 50000);
    
    txs.push({
      id: `tx_demo_${i}`,
      date: date.toISOString().split('T')[0],
      description: `${isCredit ? "VENTE RECOLTE" : "ACHAT"} - ${member.name}`,
      amount: amount,
      type: type,
      category: isCredit ? "VENTE CACAO" : category,
      status: "confirmed",
      from: type === "credit" ? member.name : "Coopérative",
      to: type === "credit" ? "Coopérative" : "Fournisseur Agrée",
      txHash: "0x" + Math.random().toString(16).substring(2, 14).toUpperCase()
    });
  }

  return txs.sort((a, b) => new Date(b.date) - new Date(a.date));
}

function updateDB() {
  const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
  db.transactions = generateTransactions(60);
  
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
    },
    {
      id: "p_demo_2",
      title: "Achat de 3 Nouveaux Tracteurs",
      description: "Modernisation de la flotte pour la saison prochaine.",
      amount: 15000000,
      category: "Équipement",
      createdBy: "Vladmir",
      createdAt: "2026-05-12T08:00:00Z",
      expiresAt: "2026-05-20T08:00:00Z",
      status: "active",
      votesFor: 8,
      votesAgainst: 0,
      votes: []
    }
  ];

  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
  console.log("Database updated with POSITIVE balance.");
}

updateDB();
