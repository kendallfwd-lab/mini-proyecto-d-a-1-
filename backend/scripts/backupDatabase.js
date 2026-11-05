require('dotenv').config();
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const { spawn } = require('node:child_process');

const key = Buffer.from(process.env.BACKUP_ENCRYPTION_KEY || '', 'base64');
if (key.length !== 32) throw new Error('BACKUP_ENCRYPTION_KEY debe ser base64 de 32 bytes');
const dump = process.env.MYSQLDUMP_PATH || 'C:\\Program Files\\MySQL\\MySQL Server 26.10\\bin\\mysqldump.exe';
const directory = path.resolve(__dirname, '../../backups'); fs.mkdirSync(directory, { recursive: true });
const basename = `business_inventory-${new Date().toISOString().replace(/[:.]/g, '-')}`; const tempPath = path.join(directory, `${basename}.sql`); const outputPath = path.join(directory, `${basename}.sql.enc`);
const child = spawn(dump, ['--single-transaction', '--set-gtid-purged=OFF', '--routines', '--triggers', '-h', process.env.DB_HOST, '-P', process.env.DB_PORT || '3306', '-u', process.env.DB_USER, process.env.DB_NAME], { env: { ...process.env, MYSQL_PWD: process.env.DB_PASSWORD } });
const temp = fs.createWriteStream(tempPath); child.stdout.pipe(temp); child.stderr.on('data', (data) => process.stderr.write(data));
child.on('error', (error) => { temp.destroy(); console.error(error.message); process.exitCode = 1; });
child.on('close', (code) => { temp.close(() => { if (code !== 0) { process.exitCode = code; return; } const iv = crypto.randomBytes(12); const cipher = crypto.createCipheriv('aes-256-gcm', key, iv); const encrypted = Buffer.concat([cipher.update(fs.readFileSync(tempPath)), cipher.final()]); fs.writeFileSync(outputPath, Buffer.concat([Buffer.from('DZBK1'), iv, cipher.getAuthTag(), encrypted])); fs.unlinkSync(tempPath); console.log(`Backup cifrado creado: ${outputPath}`); }); });
