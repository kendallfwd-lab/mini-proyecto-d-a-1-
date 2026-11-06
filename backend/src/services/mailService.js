const nodemailer = require('nodemailer');

function required(name) {
  const value = String(process.env[name] || '').trim();
  if (!value) throw new Error(`Falta configurar ${name} en backend/.env`);
  return value;
}

function transporter() {
  return nodemailer.createTransport({
    host: required('MAIL_HOST'),
    port: Number(process.env.MAIL_PORT || 465),
    secure: String(process.env.MAIL_SECURE || 'true') === 'true',
    auth: { user: required('MAIL_USER'), pass: required('MAIL_PASSWORD') },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000
  });
}

async function send({ to, subject, text, html }) {
  return transporter().sendMail({ from: process.env.MAIL_FROM || required('MAIL_USER'), to, subject, text, html });
}

async function sendTest() {
  const recipient = process.env.MAIL_TEST_TO || required('MAIL_USER');
  return send({
    to: recipient,
    subject: 'Prueba de correo · Drop_Zone',
    text: 'Este es un mensaje de prueba del backend de Drop_Zone.',
    html: '<p>Este es un mensaje de prueba del backend de <strong>Drop_Zone</strong>.</p>'
  });
}

async function sendLoginCode(to, code) { return send({ to, subject: 'Tu código de acceso · Drop_Zone', text: `Tu código temporal de Drop_Zone es: ${code}. Expira en 10 minutos y solo puede usarse una vez.`, html: `<p>Tu código temporal de Drop_Zone es:</p><p style="font-size:28px;font-weight:bold;letter-spacing:6px">${code}</p><p>Expira en 10 minutos y solo puede usarse una vez.</p>` }); }
module.exports = { send, sendTest, sendLoginCode };
