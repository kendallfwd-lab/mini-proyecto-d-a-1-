require('dotenv').config();

const readline = require('node:readline/promises');
const { stdin: input, stdout: output } = require('node:process');
const bcrypt = require('bcryptjs');
const pool = require('../src/config/database');

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function askPassword(rl) {
  if (!input.isTTY || !input.setRawMode) throw new Error('El bootstrap debe ejecutarse desde una terminal interactiva.');
  output.write('Contraseña: ');
  return new Promise((resolve) => {
    input.setRawMode(true);
    let value = '';
    const onData = (chunk) => {
      const text = chunk.toString();
      if (text === '\n' || text === '\r') {
        input.setRawMode(false); input.off('data', onData); output.write('\n'); resolve(value);
      } else if (text === '\u0003') process.exit(1);
      else if (text === '\u007f') value = value.slice(0, -1);
      else value += text;
    };
    input.on('data', onData);
  });
}

async function main() {
  const connection = await pool.getConnection();
  try {
    const [existing] = await connection.query('SELECT id FROM usuarios WHERE es_principal = 1 LIMIT 1');
    if (existing.length) throw new Error('Ya existe un administrador principal. Bootstrap rechazado.');
    const rl = readline.createInterface({ input, output });
    const nombre = (await rl.question('Nombre del administrador: ')).trim();
    const correo = (await rl.question('Correo del administrador: ')).trim().toLowerCase();
    const password = (await askPassword(rl)).trim();
    rl.close();
    if (nombre.length < 2) throw new Error('El nombre debe tener al menos 2 caracteres.');
    if (!emailPattern.test(correo)) throw new Error('El correo no es válido.');
    if (password.length < 8 || password.length > 72) throw new Error('La contraseña debe tener entre 8 y 72 caracteres.');
    const passwordHash = await bcrypt.hash(password, 12);
    await connection.query('INSERT INTO usuarios (nombre, correo, password_hash, es_principal, activo) VALUES (?, ?, ?, 1, 1)', [nombre, correo, passwordHash]);
    console.log('Administrador principal creado correctamente.');
  } finally { connection.release(); await pool.end(); }
}

main().catch((error) => { console.error(error.message); process.exitCode = 1; });
