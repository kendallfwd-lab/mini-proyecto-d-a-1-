require('dotenv').config();
const readline = require('node:readline/promises');
const { stdin: input, stdout: output } = require('node:process');
const bcrypt = require('bcryptjs');
const pool = require('../src/config/database');
const totp = require('../src/services/totpService');

function askHidden(rl) { if (!input.isTTY || !input.setRawMode) throw new Error('Ejecute MFA setup desde una terminal interactiva.'); output.write('Contraseña actual: '); input.setRawMode(true); return new Promise((resolve) => { let value = ''; const onData = (chunk) => { const text = chunk.toString(); if (text === '\n' || text === '\r') { input.setRawMode(false); input.off('data', onData); output.write('\n'); resolve(value); } else if (text === '\u0003') process.exit(1); else if (text === '\u007f') value = value.slice(0, -1); else value += text; }; input.on('data', onData); }); }

(async () => {
  const rl = readline.createInterface({ input, output });
  try {
    const email = (await rl.question('Correo del administrador principal: ')).trim().toLowerCase();
    const password = await askHidden(rl);
    const [rows] = await pool.query('SELECT id, correo, password_hash, es_principal, mfa_enabled FROM usuarios WHERE correo = ? LIMIT 1', [email]);
    const user = rows[0];
    if (!user || !user.es_principal || !(await bcrypt.compare(password, user.password_hash))) throw new Error('Credenciales inválidas o usuario no principal.');
    if (user.mfa_enabled) throw new Error('MFA ya está configurado para este administrador.');
    const secret = totp.generateSecret(); const encrypted = totp.encryptSecret(secret); await pool.query('UPDATE usuarios SET mfa_enabled = 1, mfa_secret_ciphertext = ?, mfa_secret_iv = ?, mfa_secret_tag = ? WHERE id = ?', [encrypted.ciphertext, encrypted.iv, encrypted.tag, user.id]);
    console.log(`Secreto MFA: ${secret}`); console.log(`URI para Authenticator: ${totp.uri(secret, user.correo)}`); console.log('Escanea o registra el secreto en tu aplicación MFA y úsalo al iniciar sesión.');
  } finally { rl.close(); await pool.end(); }
})().catch((error) => { console.error(error.message); process.exitCode = 1; });
