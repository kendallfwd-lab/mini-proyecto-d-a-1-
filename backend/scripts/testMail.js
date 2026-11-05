require('dotenv').config();
const pool = require('../src/config/database');
const mail = require('../src/services/mailService');

(async () => {
  try {
    const result = await mail.sendTest();
    console.log(`Correo de prueba enviado. ID: ${result.messageId}`);
  } finally {
    await pool.end();
  }
})().catch((error) => { console.error(`No se pudo enviar el correo: ${error.message}`); process.exitCode = 1; });
