const { Client } = require('pg');
const client = new Client({ user: 'postgres', host: 'localhost', database: 'library360', password: 'postgres', port: 5432 });
client.connect().then(() => {
  return client.query('SELECT id, name, "smartId" FROM student ORDER BY "joinDate" DESC LIMIT 5');
}).then(res => {
  console.log(JSON.stringify(res.rows, null, 2));
  client.end();
}).catch(console.error);
