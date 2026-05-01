#!/bin/bash

echo "🚀 Installation de CoopLedger..."

# 1. Installer les dépendances
npm install

# 2. Configurer la base de données PostgreSQL via Docker
docker-compose up -d

# 3. Initialiser Prisma
npx prisma generate
npx prisma db push

echo "✅ Installation terminée ! Lancez 'npm run dev' pour démarrer."
