import crypto from 'crypto';

const AUTH_SECRET = process.env.AUTH_SECRET || 'coopledger-auth-secret-key-2024';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'president' | 'tresorier' | 'membre';
  passwordHash: string;
}

/**
 * Système d'Authentification Sécurisé pour CoopLedger
 */
export class AuthService {
  /**
   * Hachage sécurisé du mot de passe avec PBKDF2
   */
  static async hashPassword(password: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const salt = crypto.randomBytes(16).toString('hex');
      crypto.pbkdf2(password, salt, 1000, 64, 'sha512', (err, derivedKey) => {
        if (err) reject(err);
        resolve(salt + ':' + derivedKey.toString('hex'));
      });
    });
  }

  /**
   * Vérification du mot de passe
   */
  static async verifyPassword(password: string, hash: string): Promise<boolean> {
    if (!hash.includes(':')) {
      return password === hash; // Support pour les comptes de test (ex: "123")
    }
    const [salt, key] = hash.split(':');
    return new Promise((resolve, reject) => {
      crypto.pbkdf2(password, salt, 1000, 64, 'sha512', (err, derivedKey) => {
        if (err) reject(err);
        resolve(key === derivedKey.toString('hex'));
      });
    });
  }

  /**
   * Génération d'un Token de Session (JWS Custom)
   */
  static generateToken(user: Partial<User>): string {
    const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
    const payload = Buffer.from(JSON.stringify({
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24) // 24h
    })).toString('base64url');

    const signature = crypto
      .createHmac('sha256', AUTH_SECRET)
      .update(`${header}.${payload}`)
      .digest('base64url');

    return `${header}.${payload}.${signature}`;
  }

  /**
   * Vérification du Token
   */
  static verifyToken(token: string): any | null {
    try {
      const [header, payload, signature] = token.split('.');
      const expectedSignature = crypto
        .createHmac('sha256', AUTH_SECRET)
        .update(`${header}.${payload}`)
        .digest('base64url');

      if (signature !== expectedSignature) return null;

      const data = JSON.parse(Buffer.from(payload, 'base64url').toString());
      if (data.exp < Math.floor(Date.now() / 1000)) return null;

      return data;
    } catch {
      return null;
    }
  }
}
