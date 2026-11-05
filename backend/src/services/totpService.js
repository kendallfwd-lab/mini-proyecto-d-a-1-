const crypto = require('node:crypto');
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
const key = () => { const value = process.env.MFA_ENCRYPTION_KEY || ''; if (!/^[A-Za-z0-9+/]{43}=$/.test(value)) throw new Error('MFA_ENCRYPTION_KEY debe ser una clave base64 de 32 bytes'); return Buffer.from(value, 'base64'); };
function base32Encode(buffer) { let bits = ''; for (const byte of buffer) bits += byte.toString(2).padStart(8, '0'); let output = ''; for (let i = 0; i < bits.length; i += 5) output += alphabet[parseInt(bits.slice(i, i + 5).padEnd(5, '0'), 2)]; return output; }
function base32Decode(value) { let bits = ''; for (const char of value.replace(/=+$/, '').toUpperCase()) bits += alphabet.indexOf(char).toString(2).padStart(5, '0'); const bytes = []; for (let i = 0; i + 8 <= bits.length; i += 8) bytes.push(parseInt(bits.slice(i, i + 8), 2)); return Buffer.from(bytes); }
function generateSecret() { return base32Encode(crypto.randomBytes(20)); }
function encryptSecret(secret) { const iv = crypto.randomBytes(12); const cipher = crypto.createCipheriv('aes-256-gcm', key(), iv); const ciphertext = Buffer.concat([cipher.update(secret, 'utf8'), cipher.final()]); return { ciphertext, iv, tag: cipher.getAuthTag() }; }
function decryptSecret(row) { const decipher = crypto.createDecipheriv('aes-256-gcm', key(), row.mfa_secret_iv); decipher.setAuthTag(row.mfa_secret_tag); return Buffer.concat([decipher.update(row.mfa_secret_ciphertext), decipher.final()]).toString('utf8'); }
function code(secret, time = Date.now()) { const counter = Math.floor(time / 30000); const buffer = Buffer.alloc(8); buffer.writeBigUInt64BE(BigInt(counter)); const digest = crypto.createHmac('sha1', base32Decode(secret)).update(buffer).digest(); const offset = digest[digest.length - 1] & 15; return String((digest.readUInt32BE(offset) & 0x7fffffff) % 1000000).padStart(6, '0'); }
function verifyCode(secret, value) { const clean = String(value || '').replace(/\s/g, ''); return /^[0-9]{6}$/.test(clean) && [-1, 0, 1].some((step) => crypto.timingSafeEqual(Buffer.from(code(secret, Date.now() + step * 30000)), Buffer.from(clean))); }
function uri(secret, email) { return `otpauth://totp/Drop_Zone:${encodeURIComponent(email)}?secret=${secret}&issuer=Drop_Zone&algorithm=SHA1&digits=6&period=30`; }
module.exports = { generateSecret, encryptSecret, decryptSecret, verifyCode, uri };
