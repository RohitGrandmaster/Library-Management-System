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
  const branchId = '22222222-2222-2222-2222-222222222222';
  const tenantId = '33333333-3333-3333-3333-333333333333';
  const userId = '11111111-1111-1111-1111-111111111111';

  try {
    console.log('Seeding admin data...');

    // 10 students
    for (let i = 1; i <= 10; i++) {
      await client.query('INSERT INTO student (id, "fullName", "phoneNumber", "email", "registrationDate", "tenantId", "branchId") VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT DO NOTHING',
        [uuidv4(), `Student ${i}`, `80000000${i.toString().padStart(2, '0')}`, `student${i}@test.com`, new Date(), tenantId, branchId]).catch(()=>{});
    }

    // 10 staff users
    for (let i = 1; i <= 10; i++) {
      await client.query('INSERT INTO "user" (id, "fullName", email, phone, role, "tenantId", "branchId", "isActive") VALUES ($1, $2, $3, $4, $5, $6, $7, true) ON CONFLICT DO NOTHING',
        [uuidv4(), `Staff ${i}`, `staff${i}@test.com`, `70000000${i.toString().padStart(2, '0')}`, 'manager', tenantId, branchId]).catch(()=>{});
    }

    // 10 plans
    for (let i = 1; i <= 10; i++) {
      await client.query('INSERT INTO plan (id, name, "durationInDays", price, "branchId", "isActive") VALUES ($1, $2, $3, $4, $5, true) ON CONFLICT DO NOTHING',
        [uuidv4(), `Plan ${i}`, 30 * i, 500 * i, branchId]).catch(()=>{});
    }

    // 10 coupons
    for (let i = 1; i <= 10; i++) {
      await client.query('INSERT INTO coupon (id, code, "discountType", "discountValue", "validUntil", "branchId", "isActive") VALUES ($1, $2, $3, $4, $5, $6, true) ON CONFLICT DO NOTHING',
        [uuidv4(), `COUPON${i}`, i % 2 === 0 ? 'percentage' : 'fixed', 10 * i, new Date(Date.now() + 30*24*60*60*1000), branchId]).catch(()=>{});
    }

    // 10 audit logs
    for (let i = 1; i <= 10; i++) {
      await client.query('INSERT INTO audit_log (id, action, entity, "entityId", details, "userId", "tenantId", "branchId") VALUES ($1, $2, $3, $4, $5, $6, $7, $8) ON CONFLICT DO NOTHING',
        [uuidv4(), 'CREATE', 'Student', uuidv4(), `Created student ${i}`, userId, tenantId, branchId]).catch(()=>{});
    }

    // 10 branches
    for (let i = 1; i <= 10; i++) {
      await client.query('INSERT INTO branch (id, name, address, "contactPhone", "tenantId", "isActive") VALUES ($1, $2, $3, $4, $5, true) ON CONFLICT DO NOTHING',
        [uuidv4(), `Branch ${i}`, `Address ${i}`, `60000000${i.toString().padStart(2, '0')}`, tenantId]).catch(()=>{});
    }

    // 10 blacklist entries
    for (let i = 1; i <= 10; i++) {
      await client.query('INSERT INTO blacklist (id, reason, date, "branchId") VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING',
        [uuidv4(), `Rule violation ${i}`, new Date(), branchId]).catch(()=>{});
    }

    console.log('Seed3 completed successfully!');
  } catch (err) {
    console.error('Seed3 error:', err);
  } finally {
    await client.end();
  }
}

seed();
