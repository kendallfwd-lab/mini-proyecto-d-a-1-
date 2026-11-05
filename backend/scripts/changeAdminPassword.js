require('dotenv').config();
const readline = require('node:readline/promises');
const { stdin: input, stdout: output } = require('node:process');
const bcrypt = require('bcryptjs');
const pool = require('../src/config/database');
const model = require('../src/models/usuarioModel');
const sessionModel = require('../src/models/sessionModel');
const totp = require('../src/services/totpService');

function askHidden(rl, prompt) {
  if (!input.isTTY || !input.setRawMode) throw new Error('Ejecute este comando desde una terminal interactiva.');
  output.write(prompt); input.setRawMode(true);
  return new Promise((resolve) => {
    let value = '';
    const onData = (chunk) => { const text = chunk.toString(); if (text === '\n' || text === '\r') { input.setRawMode(false); input.off('data', onData); output.write('\n'); resolve(value); } else if (text === '\u0003') process.exit(1); else if (text === '\u007f') value = value.slice(0, -1); else value += text; };
    input.on('data', onData);
  });
}

(async () => {
  const rl = readline.createInterface({ input, output });
  try {
    const email = (await rl.question('Correo del administrador principal: ')).trim().toLowerCase();
    const current = await askHidden(rl, 'Contraseña actual: ');
    const code = await askHidden(rl, 'Código MFA actual de 6 dígitos: ');
    const next = await askHidden(rl, 'Nueva contraseña (mínimo 8 caracteres): ');
    const confirm = await askHidden(rl, 'Repite la nueva contraseña: ');
    const user = await model.findByEmail(email);
    if (!user || !user.es_principal || !user.mfa_enabled || !(await bcrypt.compare(current, user.password_hash)) || !totp.verifyCode(totp.decryptSecret(user), code)) throw new Error('Credenciales o código MFA actual inválidos.');
    if (next.length < 8 || next !== confirm) throw new Error('La nueva contraseña debe tener al menos 8 caracteres y coincidir.');
    await model.updatePassword(user.id, await bcrypt.hash(next, 12));
    await sessionModel.revokeUser(user.id);
    console.log('Contraseña actualizada. Todas las sesiones anteriores fueron revocadas.');
  } finally { rl.close(); await pool.end(); }
})().catch((error) => { console.error(error.message); process.exitCode = 1; });
