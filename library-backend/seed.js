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
    console.log('Seeding database...');
    
    let branchId = '22222222-2222-2222-2222-222222222222';
    await client.query('INSERT INTO branches (id, name, "address", "isActive") VALUES ($1, $2, $3, true) ON CONFLICT DO NOTHING', 
      [branchId, 'Main Branch', '123 Test St']);

    let roleId = uuidv4();
    await client.query('INSERT INTO roles (id, name, description) VALUES ($1, $2, $3) ON CONFLICT (name) DO NOTHING', [roleId, 'manager', 'Manager Role']);
    const roleRes = await client.query('SELECT id FROM roles WHERE name = $1', ['manager']);
    roleId = roleRes.rows[0].id;

    let userId = '11111111-1111-1111-1111-111111111111';
    await client.query('INSERT INTO users (id, name, email, phone, password, "branchId", "roleId", "isActive") VALUES ($1, $2, $3, $4, $5, $6, $7, true) ON CONFLICT (phone) DO NOTHING', 
      [userId, 'Test Manager', 'manager@lib360.com', '1231231234', 'hashedpass', branchId, roleId]);

    let planId = uuidv4();
    await client.query('INSERT INTO plan (id, name, "durationDays", price, "branchId") VALUES ($1, $2, $3, $4, $5)', [planId, 'Monthly Basic', 30, 1000, branchId]);

    let catId = uuidv4();
    await client.query('INSERT INTO expense_category (id, name, "branchId") VALUES ($1, $2, $3)', [catId, 'Maintenance', branchId]);

    await client.query('INSERT INTO expense (id, "amount", "description", "expenseDate", "branchId", "categoryId", "addedById") VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [uuidv4(), 500.00, 'AC Repair', new Date(), branchId, catId, userId]);
    
    let shiftId = uuidv4();
    await client.query('INSERT INTO shift (id, name, "startTime", "endTime", "branchId") VALUES ($1, $2, $3, $4, $5)', [shiftId, 'Morning', '06:00:00', '14:00:00', branchId]);
    
    // Seat 1
    const seat1Res = await client.query('INSERT INTO seat ("seatNumber", "isActive", "branchId") VALUES ($1, true, $2) RETURNING id', ['A-01', branchId]);
    let seatId = seat1Res.rows[0].id;

    let stuId1 = uuidv4();
    await client.query('INSERT INTO student (id, "smartId", name, phone, "parentPhone", email, college, status, "joinDate", "branchId") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) ON CONFLICT ("branchId", "smartId") DO NOTHING',
      [stuId1, 'LIB001', 'Amit Kumar', '9998887771', '9998887770', 'amit@mail.com', 'Delhi Uni', 'active', new Date(), branchId]);
    
    // For subsequent inserts, we need the actual stuId1 if it was already there
    const stu1Res = await client.query('SELECT id FROM student WHERE "smartId" = $1', ['LIB001']);
    stuId1 = stu1Res.rows[0].id;
    
    await client.query('INSERT INTO subscription (id, "startDate", "endDate", "baseAmount", "totalAmount", "paidAmount", "dueAmount", status, "studentId", "planId") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
      [uuidv4(), new Date(), new Date(Date.now() + 30*24*60*60*1000), 1000, 1000, 1000, 0, 'active', stuId1, planId]).catch(() => {});
    
    await client.query('INSERT INTO student_slot (id, "validFrom", "validTill", "isActive", "studentId", "shiftId", "seatId") VALUES ($1, $2, $3, true, $4, $5, $6)',
      [uuidv4(), new Date(), new Date(Date.now() + 30*24*60*60*1000), stuId1, shiftId, seatId]).catch(() => {});
      
    let stuId2 = uuidv4();
    await client.query('INSERT INTO student (id, "smartId", name, phone, "parentPhone", email, college, status, "joinDate", "branchId") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) ON CONFLICT ("branchId", "smartId") DO NOTHING',
      [stuId2, 'LIB002', 'Priya Singh', '9998887772', '9998887770', 'priya@mail.com', 'Delhi Uni', 'suspended', new Date(), branchId]);
      
    const stu2Res = await client.query('SELECT id FROM student WHERE "smartId" = $1', ['LIB002']);
    stuId2 = stu2Res.rows[0].id;

    await client.query('INSERT INTO subscription (id, "startDate", "endDate", "baseAmount", "totalAmount", "paidAmount", "dueAmount", status, "studentId", "planId") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
      [uuidv4(), new Date(), new Date(Date.now() + 30*24*60*60*1000), 1000, 1000, 500, 500, 'expired', stuId2, planId]).catch(() => {});
      
    const seat2Res = await client.query('INSERT INTO seat ("seatNumber", "isActive", "branchId") VALUES ($1, true, $2) RETURNING id', ['A-02', branchId]).catch(async () => await client.query('SELECT id FROM seat WHERE "seatNumber" = $1', ['A-02']));
    let seatId2 = seat2Res.rows[0].id;

    await client.query('INSERT INTO student_slot (id, "validFrom", "validTill", "isActive", "studentId", "shiftId", "seatId") VALUES ($1, $2, $3, true, $4, $5, $6)',
      [uuidv4(), new Date(), new Date(Date.now() + 30*24*60*60*1000), stuId2, shiftId, seatId2]).catch(() => {});

    console.log('Seed completed successfully!');
  } catch (err) {
    console.error('Seed error:', err);
  } finally {
    await client.end();
  }
}

seed();
