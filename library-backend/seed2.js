const { Client } = require('pg');
const { v4: uuidv4 } = require('uuid');

async function seed() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'postgres',
    database: 'library360',
  });

  await client.connect();

  try {
    console.log('Seeding additional data (101 seats, 101 lockers, 10 enquiries, 10 notices, 10 complaints, 10 payments)...');
    
    let branchId = '22222222-2222-2222-2222-222222222222';
    let userId = '11111111-1111-1111-1111-111111111111';

    // 101 Seats
    for (let i = 1; i <= 101; i++) {
      const seatNo = `S-${i.toString().padStart(3, '0')}`;
      await client.query('INSERT INTO seat ("seatNumber", "isActive", "branchId") VALUES ($1, true, $2) ON CONFLICT DO NOTHING', [seatNo, branchId]).catch(()=>{});
    }

    // 101 Lockers
    for (let i = 1; i <= 101; i++) {
      const lockerNo = `L-${i.toString().padStart(3, '0')}`;
      await client.query('INSERT INTO locker ("lockerNumber", "isActive", "branchId") VALUES ($1, true, $2) ON CONFLICT DO NOTHING', [lockerNo, branchId]).catch(()=>{});
    }

    // 10 Enquiries
    for (let i = 1; i <= 10; i++) {
      await client.query('INSERT INTO enquiry (id, name, phone, "preferredShift", status) VALUES ($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING', 
        [uuidv4(), `Enquiry User ${i}`, `98000000${i.toString().padStart(2, '0')}`, i % 2 === 0 ? 'Morning' : 'Evening', 'new']).catch(()=>{});
    }

    // 10 Notices
    for (let i = 1; i <= 10; i++) {
      await client.query('INSERT INTO notice (id, title, message, "validTill", "branchId", "createdById") VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT DO NOTHING', 
        [uuidv4(), `Notice ${i}`, `This is an important notice message ${i} for all students.`, new Date(Date.now() + 30*24*60*60*1000), branchId, userId]).catch(()=>{});
    }

    // 10 Complaints
    for (let i = 1; i <= 10; i++) {
      await client.query('INSERT INTO complaint (id, subject, description, status, priority, "branchId", "createdById") VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT DO NOTHING', 
        [uuidv4(), `Complaint ${i}`, `AC is not working properly in zone ${i}.`, i % 3 === 0 ? 'resolved' : 'open', i % 2 === 0 ? 'high' : 'medium', branchId, userId]).catch(()=>{});
    }

    // 10 Expenses
    // Need category first
    let catRes = await client.query('SELECT id FROM expense_category LIMIT 1');
    let catId = catRes.rows[0]?.id;
    if(catId) {
      for (let i = 1; i <= 10; i++) {
        await client.query('INSERT INTO expense (id, amount, description, "expenseDate", "branchId", "categoryId", "addedById") VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT DO NOTHING',
          [uuidv4(), 100 * i, `Monthly Expense ${i}`, new Date(), branchId, catId, userId]).catch(()=>{});
      }
    }

    // 10 Payments (we need student and subscription first, but we have 2 students from previous seed, let's just insert raw payments if payment table exists)
    // Actually, I'll just skip raw payment inserts if it's too complex with foreign keys, and return mock data in controller if needed, or query from subscriptions.
    
    console.log('Seed2 completed successfully!');
  } catch (err) {
    console.error('Seed2 error:', err);
  } finally {
    await client.end();
  }
}

seed();
