require('dotenv').config();
const crypto = require('node:crypto');
const fs = require('node:fs');
const { spawn } = require('node:child_process');
const mysql = require('mysql2/promise');

(async () => {
  const file = process.argv[2]; const target = process.argv[3];
  if (!file || !target || target === process.env.DB_NAME || !/^[_a-zA-Z0-9]+$/.test(target)) throw new Error('Uso seguro: node scripts/restoreDatabase.js <archivo.enc> <base_prueba_diferente>');
  const key = Buffer.from(process.env.BACKUP_ENCRYPTION_KEY || '', 'base64'); const payload = fs.readFileSync(file);
  if (key.length !== 32 || payload.subarray(0, 5).toString() !== 'DZBK1') throw new Error('Backup o clave inválida');
  const iv = payload.subarray(5, 17); const tag = payload.subarray(17, 33); const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv); decipher.setAuthTag(tag); const sql = Buffer.concat([decipher.update(payload.subarray(33)), decipher.final()]).toString('utf8').replace(/USE `?business_inventory`?;/gi, `USE ${target};`);
  const admin = await mysql.createConnection({ host: process.env.DB_HOST, port: Number(process.env.DB_PORT || 3306), user: process.env.DB_ADMIN_USER || 'root', password: process.env.DB_ADMIN_PASSWORD || '1234' }); await admin.query(`CREATE DATABASE IF NOT EXISTS ${target} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`); await admin.end();
  const mysqlPath = process.env.MYSQL_PATH || 'C:\\Program Files\\MySQL\\MySQL Server 26.10\\bin\\mysql.exe'; const child = spawn(mysqlPath, ['-h', process.env.DB_HOST, '-P', process.env.DB_PORT || '3306', '-u', process.env.DB_ADMIN_USER || 'root', target], { env: { ...process.env, MYSQL_PWD: process.env.DB_ADMIN_PASSWORD || '1234' } }); child.stdin.end(sql); child.stderr.pipe(process.stderr); child.on('close', (code) => { if (code) process.exitCode = code; else console.log(`Restauración verificada en base de prueba: ${target}`); });
})().catch((error) => { console.error(error.message); process.exit(1); });
