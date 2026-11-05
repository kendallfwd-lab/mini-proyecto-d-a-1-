require('dotenv').config();
const mysql = require('mysql2/promise');

(async () => {
  const admin = await mysql.createConnection({ host: process.env.DB_HOST, port: Number(process.env.DB_PORT || 3306), user: process.env.DB_USER, password: process.env.DB_PASSWORD });
  const username = process.env.DB_APP_USER || 'business_inventory_app';
  const password = process.env.DB_APP_PASSWORD;
  if (!password) throw new Error('Falta DB_APP_PASSWORD en .env');
  const quotedUser = admin.escape(username);
  const quotedPassword = admin.escape(password);
  await admin.query(`CREATE USER IF NOT EXISTS ${quotedUser}@'localhost' IDENTIFIED BY ${quotedPassword}`);
  await admin.query(`ALTER USER ${quotedUser}@'localhost' IDENTIFIED BY ${quotedPassword}`);
  await admin.query(`GRANT SELECT, INSERT, UPDATE, DELETE, EXECUTE ON business_inventory.* TO ${quotedUser}@'localhost'`);
  await admin.query('FLUSH PRIVILEGES');
  console.log(`Usuario MySQL de aplicación configurado: ${username}`);
  await admin.end();
})().catch((error) => { console.error(error.message); process.exit(1); });
