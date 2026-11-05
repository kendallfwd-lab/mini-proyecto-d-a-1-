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
  output.write(prompt);
  input.setRawMode(true);
  return new Promise((resolve) => {
    let value = '';
    const onData = (chunk) => {
      const text = chunk.toString();
      if (text === '\n' || text === '\r') { input.setRawMode(false); input.off('data', onData); output.write('\n'); resolve(value); }
      else if (text === '\u0003') process.exit(1);
      else if (text === '\u007f') value = value.slice(0, -1);
      else value += text;
    };
    input.on('data', onData);
  });
}

(async () => {
  const rl = readline.createInterface({ input, output });
  try {
    const email = (await rl.question('Correo del administrador principal: ')).trim().toLowerCase();
    const password = await askHidden(rl, 'Contraseña actual: ');
    const code = await askHidden(rl, 'Código MFA actual de 6 dígitos: ');
    const user = await model.findByEmail(email);
    if (!user || !user.es_principal || !user.mfa_enabled || !(await bcrypt.compare(password, user.password_hash)) || !totp.verifyCode(totp.decryptSecret(user), code)) {
      throw new Error('Credenciales o código MFA actual inválidos.');
    }
    const secret = totp.generateSecret();
    await model.saveMfa(user.id, totp.encryptSecret(secret));
    await model.invalidateToken(user.id);
    await sessionModel.revokeUser(user.id);
    console.log('MFA rotado. El secreto anterior quedó invalidado.');
    console.log(`Nuevo secreto MFA (guárdalo solo en tu Authenticator): ${secret}`);
    console.log(`Nueva URI para Authenticator: ${totp.uri(secret, user.correo)}`);
  } finally { rl.close(); await pool.end(); }
})().catch((error) => { console.error(error.message); process.exitCode = 1; });
