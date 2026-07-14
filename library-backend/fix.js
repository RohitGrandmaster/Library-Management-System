const bcrypt = require('bcrypt');
const { Client } = require('pg');

async function fix() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'postgres',
    database: 'library360'
  });
  await client.connect();
  try {
    const res = await client.query('SELECT id, password FROM users');
    let updated = 0;
    for (let row of res.rows) {
      if (!row.password.startsWith('$2b$')) {
        const hash = await bcrypt.hash(row.password, 12);
        await client.query('UPDATE users SET password = $1 WHERE id = $2', [hash, row.id]);
        updated++;
      }
    }
    console.log('Updated ' + updated + ' passwords');
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}
fix();
