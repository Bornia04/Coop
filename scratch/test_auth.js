const crypto = require('crypto');

class AuthService {
  static async hashPassword(password) {
    return new Promise((resolve, reject) => {
      const salt = crypto.randomBytes(16).toString('hex');
      crypto.pbkdf2(password, salt, 1000, 64, 'sha512', (err, derivedKey) => {
        if (err) reject(err);
        resolve(salt + ':' + derivedKey.toString('hex'));
      });
    });
  }

  static async verifyPassword(password, hash) {
    if (!hash.includes(':')) {
      return password === hash;
    }
    const [salt, key] = hash.split(':');
    return new Promise((resolve, reject) => {
      crypto.pbkdf2(password, salt, 1000, 64, 'sha512', (err, derivedKey) => {
        if (err) reject(err);
        resolve(key === derivedKey.toString('hex'));
      });
    });
  }
}

async function test() {
  const pass = "password123";
  const hash = await AuthService.hashPassword(pass);
  console.log("Generated Hash:", hash);
  const isValid = await AuthService.verifyPassword(pass, hash);
  console.log("Is Valid (correct pass):", isValid);
  const isInvalid = await AuthService.verifyPassword("wrongpass", hash);
  console.log("Is Valid (wrong pass):", isInvalid);
  
  // Test with a sample from the real DB if possible
  const realHashFromDB = "5cc9f308390c58f22fa6aa5452a89c84:86844df5547107e4fcc6f2c86d0ff1bf79d35852cdbd3091ab4c9aa1b4ed3ba1f469523e1696e78a4505effc968728fa57888779e986e021aa557c14bc6a997c";
  // We don't know the password for bo@gmail.com, but let's assume it was "123" or something.
}

test();
