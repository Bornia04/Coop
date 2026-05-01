// Simulation blockchain — SHA-256 côté client
export async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function generateTxHash(data: object): Promise<string> {
  const payload = JSON.stringify(data) + Date.now() + Math.random();
  return '0x' + await sha256(payload);
}

export function generateBlockNumber(): number {
  return 18000000 + Math.floor(Math.random() * 500000);
}

export function formatHash(hash: string): string {
  if (!hash) return '';
  return hash.slice(0, 10) + '...' + hash.slice(-8);
}

export const NETWORK = 'Celo Testnet (Alfajores)';
export const EXPLORER_URL = 'https://alfajores.celoscan.io/tx/';
