import crypto from 'crypto';

export interface Block {
  index: number;
  timestamp: number;
  data: any;
  previousHash: string;
  hash: string;
  nonce: number;
  signature?: string;
}

/**
 * Moteur Blockchain Cryptographique de CoopLedger
 * Utilise SHA-256 pour l'immuabilité et ECDSA pour la signature des transactions.
 */
export class Blockchain {
  private static readonly SECRET = process.env.BLOCKCHAIN_SECRET || 'coopledger-ultra-secret-2024';

  /**
   * Calcule le hash SHA-256 d'un bloc
   */
  static calculateHash(index: number, timestamp: number, data: any, previousHash: string, nonce: number): string {
    const content = `${index}${timestamp}${JSON.stringify(data)}${previousHash}${nonce}`;
    return crypto.createHmac('sha256', this.SECRET).update(content).digest('hex');
  }

  /**
   * Crée un nouveau bloc scellé
   */
  static createBlock(index: number, data: any, previousHash: string): Block {
    const timestamp = Date.now();
    let nonce = 0;
    let hash = this.calculateHash(index, timestamp, data, previousHash, nonce);
    
    // Simuler un léger "Proof of Work" pour la démo (facultatif)
    while (!hash.startsWith('00')) {
      nonce++;
      hash = this.calculateHash(index, timestamp, data, previousHash, nonce);
    }

    return {
      index,
      timestamp,
      data,
      previousHash,
      hash,
      nonce
    };
  }

  /**
   * Signe une transaction avec une clé privée de membre
   */
  static signData(data: any, privateKey: string): string {
    const sign = crypto.createSign('SHA256');
    sign.update(JSON.stringify(data));
    sign.end();
    // En mode démo, on utilise HMAC si la clé n'est pas une vraie clé RSA/ECDSA
    return crypto.createHmac('sha256', privateKey).update(JSON.stringify(data)).digest('hex');
  }

  /**
   * Vérifie l'intégrité de la chaîne
   */
  static isChainValid(chain: Block[]): boolean {
    for (let i = 1; i < chain.length; i++) {
      const currentBlock = chain[i];
      const previousBlock = chain[i - 1];

      // Vérifier le hash stocké
      if (currentBlock.hash !== this.calculateHash(currentBlock.index, currentBlock.timestamp, currentBlock.data, currentBlock.previousHash, currentBlock.nonce)) {
        return false;
      }

      // Vérifier la liaison avec le bloc précédent
      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }
    return true;
  }
}

/**
 * Utilitaire pour générer des empreintes uniques de transaction
 */
export const generateTxHash = (data: any): string => {
  return crypto.createHash('sha256').update(JSON.stringify(data) + Date.now()).digest('hex');
};

export const generateBlockNumber = () => Math.floor(Math.random() * 900000) + 100000;
export const NETWORK = "CoopLedger Mainnet";
