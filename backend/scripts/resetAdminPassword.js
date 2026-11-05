require('dotenv').config();
const readline = require('node:readline/promises');
const { stdin: input, stdout: output } = require('node:process');
const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');

function askHidden(rl, prompt) {
  if (!input.isTTY || !input.setRawMode) throw new Error('Ejecute este comando desde una terminal interactiva.');
  output.write(prompt); input.setRawMode(true);
  return new Promise((resolve) => { let value = ''; const onData = (chunk) => { const text = chunk.toString(); if (text === '\n' || text === '\r') { input.setRawMode(false); input.off('data', onData); output.write('\n'); resolve(value); } else if (text === '\u0003') process.exit(1); else if (text === '\u007f') value = value.slice(0, -1); else value += text; }; input.on('data', onData); });
}

(async () => {
  const rl = readline.createInterface({ input, output });
  const pool = mysql.createPool({ host: process.env.DB_HOST || 'localhost', port: Number(process.env.DB_PORT || 3306), user: process.env.DB_ADMIN_USER || 'root', password: process.env.DB_ADMIN_PASSWORD, database: process.env.DB_NAME || 'business_inventory' });
  try {
    if (!process.env.DB_ADMIN_PASSWORD) throw new Error('Defina DB_ADMIN_PASSWORD con la contraseña real de root.');
    const email = (await rl.question('Correo del administrador principal: ')).trim().toLowerCase();
    const next = await askHidden(rl, 'Nueva contraseña (mínimo 12 caracteres): ');
    const confirm = await askHidden(rl, 'Repita la nueva contraseña: ');
    if (next.length < 12 || next !== confirm) throw new Error('La contraseña debe tener al menos 12 caracteres y coincidir.');
    const [rows] = await pool.query('SELECT id FROM usuarios WHERE correo = ? AND es_principal = 1 LIMIT 1', [email]);
    if (!rows[0]) throw new Error('No existe un administrador principal con ese correo.');
    await pool.query('UPDATE usuarios SET password_hash = ?, version_token = version_token + 1 WHERE id = ?', [await bcrypt.hash(next, 12), rows[0].id]);
    await pool.query('UPDATE sesiones SET revocada_en = CURRENT_TIMESTAMP WHERE usuario_id = ? AND revocada_en IS NULL', [rows[0].id]);
    console.log('Contraseña restablecida y sesiones anteriores revocadas.');
  } finally { rl.close(); await pool.end(); }
})().catch((error) => { console.error(error.message); process.exitCode = 1; });
