require('dotenv').config();
const fs = require('node:fs');
const path = require('node:path');
const readline = require('node:readline/promises');
const { stdin: input, stdout: output } = require('node:process');

function askHidden(rl, prompt) {
  if (!input.isTTY || !input.setRawMode) throw new Error('Ejecute este comando desde una terminal interactiva.');
  output.write(prompt); input.setRawMode(true);
  return new Promise((resolve) => {
    let value = '';
    const onData = (chunk) => { const text = chunk.toString(); if (text === '\n' || text === '\r') { input.setRawMode(false); input.off('data', onData); output.write('\n'); resolve(value); } else if (text === '\u0003') process.exit(1); else if (text === '\u007f') value = value.slice(0, -1); else value += text; };
    input.on('data', onData);
  });
}

function setEnv(content, key, value) {
  const line = `${key}=${value}`;
  const pattern = new RegExp(`^${key}=.*$`, 'm');
  return pattern.test(content) ? content.replace(pattern, line) : `${content.trimEnd()}\n${line}\n`;
}

(async () => {
  const rl = readline.createInterface({ input, output });
  try {
    const user = (await rl.question('Correo remitente [salazarvargaskendall@gmail.com]: ')).trim() || 'salazarvargaskendall@gmail.com';
    const password = await askHidden(rl, 'Contraseña de aplicación de Google (oculta): ');
    if (!/^\S+@\S+\.\S+$/.test(user) || password.replace(/\s/g, '').length < 16) throw new Error('Correo o contraseña de aplicación inválidos.');
    const envPath = path.resolve(__dirname, '../.env');
    let content = fs.readFileSync(envPath, 'utf8');
    for (const [key, value] of [['MAIL_HOST', 'smtp.gmail.com'], ['MAIL_PORT', '465'], ['MAIL_SECURE', 'true'], ['MAIL_USER', user], ['MAIL_PASSWORD', password.replace(/\s/g, '')], ['MAIL_FROM', `Drop_Zone <${user}>`]]) content = setEnv(content, key, value);
    fs.writeFileSync(envPath, content, { encoding: 'utf8', mode: 0o600 });
    console.log('Configuración de correo guardada localmente en backend/.env.');
  } finally { rl.close(); }
})().catch((error) => { console.error(error.message); process.exitCode = 1; });
