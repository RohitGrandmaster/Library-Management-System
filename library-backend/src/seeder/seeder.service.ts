import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Role } from '../roles/entities/role.entity';
import { Permission } from '../permissions/entities/permission.entity';
import { Tenant } from '../tenants/entities/tenant.entity';
import { Branch } from '../branches/entities/branch.entity';
import { User } from '../users/entities/user.entity';
import { Shift } from '../shifts/entities/shift.entity';
import { Seat } from '../seats/entities/seat.entity';
import { Plan } from '../plans/entities/plan.entity';
import { Student } from '../students/entities/student.entity';
import { Subscription } from '../subscriptions/entities/subscription.entity';
import { Payment } from '../payments/entities/payment.entity';
import { Expense } from '../expenses/entities/expense.entity';
import { StudentSlot } from '../student-slots/entities/student-slot.entity';

const BCRYPT_COST = 12;

/**
 * ═══════════════════════════════════════════════════
 *  DEFAULT LOGIN CREDENTIALS (stored hashed in DB)
 * ═══════════════════════════════════════════════════
 *
 *  SUPERADMIN:
 *    Phone    : 9000000001
 *    Password : Library@2025
 *    Email    : superadmin@smartlibrary.com
 *
 *  ADMIN:
 *    Phone    : 9000000002
 *    Password : Library@2025
 *    Email    : admin@smartlibrary.com
 *
 *  MANAGER:
 *    Phone    : 9000000003
 *    Password : Library@2025
 *    Email    : manager@smartlibrary.com
 *
 *  All passwords are bcrypt hashed (cost=12) before storing.
 *  No plaintext passwords exist in the database.
 * ═══════════════════════════════════════════════════
 */

@Injectable()
export class SeederService {
  private readonly logger = new Logger(SeederService.name);

  constructor(
    @InjectRepository(Role) private roleRepo: Repository<Role>,
    @InjectRepository(Permission) private permissionRepo: Repository<Permission>,
    @InjectRepository(Tenant) private tenantRepo: Repository<Tenant>,
    @InjectRepository(Branch) private branchRepo: Repository<Branch>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Shift) private shiftRepo: Repository<Shift>,
    @InjectRepository(Seat) private seatRepo: Repository<Seat>,
    @InjectRepository(Plan) private planRepo: Repository<Plan>,
    @InjectRepository(Student) private studentRepo: Repository<Student>,
    @InjectRepository(Subscription) private subscriptionRepo: Repository<Subscription>,
    @InjectRepository(StudentSlot) private slotRepo: Repository<StudentSlot>,
    @InjectRepository(Payment) private paymentRepo: Repository<Payment>,
    @InjectRepository(Expense) private expenseRepo: Repository<Expense>,
  ) {}

  async seedCoreData() {
    this.logger.log('Starting Core DB Seeding...');

    // ── 1. Roles ────────────────────────────────────────────────────────────
    const roles = ['superadmin', 'admin', 'manager'];
    const createdRoles: Record<string, Role> = {};
    for (const r of roles) {
      let role = await this.roleRepo.findOne({ where: { name: r } });
      if (!role) {
        role = this.roleRepo.create({ name: r, description: `Role for ${r}` });
        await this.roleRepo.save(role);
      }
      createdRoles[r] = role;
    }
    this.logger.log('✅ Roles seeded');

    // ── 2. Tenant ────────────────────────────────────────────────────────────
    let tenant = await this.tenantRepo.findOne({ where: { name: 'SmartLibrary Demo' } });
    if (!tenant) {
      tenant = this.tenantRepo.create({
        name: 'SmartLibrary Demo',
        ownerEmail: 'superadmin@smartlibrary.com',
        isActive: true,
      });
      await this.tenantRepo.save(tenant);
    }
    this.logger.log('✅ Tenant seeded');

    // ── 3. Branches ──────────────────────────────────────────────────────────
    const branchDefs = [
      { name: 'StudyNest Patna',    isActive: true },
      { name: 'BrainKraft Jaipur',  isActive: true },
      { name: 'ReadHive Lucknow',   isActive: false },
    ];
    const createdBranches: Record<string, Branch> = {};
    for (const b of branchDefs) {
      let branch = await this.branchRepo.findOne({
        where: { name: b.name },
        relations: { tenant: true },
      });
      if (!branch) {
        branch = this.branchRepo.create({ name: b.name, isActive: b.isActive, tenant });
        await this.branchRepo.save(branch);
      }
      createdBranches[b.name] = branch;
    }
    this.logger.log('✅ Branches seeded');

    // ── 4. Users (hashed passwords, same password for all 3 roles) ──────────
    const defaultPassword = 'Library@2025';
    const passwordHash = await bcrypt.hash(defaultPassword, BCRYPT_COST);

    const userDefs = [
      {
        email: 'superadmin@smartlibrary.com',
        phone: '9000000001',
        name: 'Super Admin',
        passwordHash,
        role: createdRoles['superadmin'],
        branch: undefined,
        tenantId: tenant.id,
      },
      {
        email: 'admin@smartlibrary.com',
        phone: '9000000002',
        name: 'Admin User',
        passwordHash,
        role: createdRoles['admin'],
        branch: createdBranches['StudyNest Patna'],
        tenantId: tenant.id,
      },
      {
        email: 'manager@smartlibrary.com',
        phone: '9000000003',
        name: 'Manager User',
        passwordHash,
        role: createdRoles['manager'],
        branch: createdBranches['StudyNest Patna'],
        tenantId: tenant.id,
      },
    ];

    for (const u of userDefs) {
      let user = await this.userRepo
        .createQueryBuilder('user')
        .where('user.phone = :phone', { phone: u.phone })
        .getOne();

      if (!user) {
        user = this.userRepo.create({
          email: u.email,
          phone: u.phone,
          name: u.name,
          password: u.passwordHash,
          role: u.role,
          branch: u.branch,
          tenantId: u.tenantId,
          isActive: true,
          failedLoginAttempts: 0,
        });
        await this.userRepo.save(user);
        this.logger.log(`✅ User seeded: ${u.email} (role: ${u.role.name})`);
      } else {
        // Update existing user's password to hashed version
        await this.userRepo
          .createQueryBuilder()
          .update(User)
          .set({
            password: u.passwordHash,
            tenantId: u.tenantId,
            isActive: true,
            failedLoginAttempts: 0,
            lockUntil: null,
          })
          .where('phone = :phone', { phone: u.phone })
          .execute();
        this.logger.log(`🔄 User updated: ${u.email}`);
      }
    }
    this.logger.log('✅ Users seeded with bcrypt-hashed passwords');

    this.logger.log('Core DB Seeding Completed!');
    return {
      message: 'Core seeding completed successfully',
      credentials: {
        note: 'All users share the same password for demo purposes',
        superadmin: { phone: '9000000001', password: 'Library@2025', email: 'superadmin@smartlibrary.com' },
        admin:      { phone: '9000000002', password: 'Library@2025', email: 'admin@smartlibrary.com' },
        manager:    { phone: '9000000003', password: 'Library@2025', email: 'manager@smartlibrary.com' },
      },
    };
  }

  async seedAdminData() {
    this.logger.log('Starting Admin DB Seeding...');
    const branch = await this.branchRepo.findOne({
      where: { name: 'StudyNest Patna' },
      relations: { tenant: true },
    });

    if (!branch) throw new Error('Branch not found. Run POST /api/v1/seed/core first.');
    const bId = branch.id;

    // ── Shifts ──────────────────────────────────────────────────────────────
    const shiftDefs = [
      { name: 'Morning',  startTime: '06:00', endTime: '12:00' },
      { name: 'Evening',  startTime: '12:00', endTime: '18:00' },
      { name: 'Night',    startTime: '18:00', endTime: '23:00' },
      { name: 'Full Day', startTime: '06:00', endTime: '23:00' },
    ];
    for (const s of shiftDefs) {
      let shift = await this.shiftRepo.findOne({ where: { name: s.name, branch: { id: bId } } });
      if (!shift) {
        shift = this.shiftRepo.create();
        shift.name = s.name;
        shift.branch = branch;
        shift.startTime = s.startTime;
        shift.endTime = s.endTime;
        await this.shiftRepo.save(shift);
      }
    }
    this.logger.log('✅ Shifts seeded');

    // ── Seats ────────────────────────────────────────────────────────────────
    for (let i = 1; i <= 30; i++) {
      let seat = await this.seatRepo.findOne({ where: { seatNumber: `S${i}`, branch: { id: bId } } });
      if (!seat) {
        seat = this.seatRepo.create();
        seat.seatNumber = `S${i}`;
        seat.branch = branch;
        await this.seatRepo.save(seat);
      }
    }
    this.logger.log('✅ Seats seeded (S1-S30)');

    // ── Plans ────────────────────────────────────────────────────────────────
    const planDefs = [
      { name: 'Monthly',    price: 1000, durationDays: 30  },
      { name: 'Quarterly',  price: 2800, durationDays: 90  },
      { name: 'Half-Yearly',price: 5000, durationDays: 180 },
      { name: 'Yearly',     price: 9000, durationDays: 365 },
    ];
    for (const p of planDefs) {
      let plan = await this.planRepo.findOne({ where: { name: p.name, branch: { id: bId } } });
      if (!plan) {
        plan = this.planRepo.create();
        plan.name = p.name;
        plan.price = p.price;
        plan.durationDays = p.durationDays;
        plan.branch = branch;
        await this.planRepo.save(plan);
      }
    }
    this.logger.log('✅ Plans seeded');

    // ── Students, Slots, Subscriptions & Payments ────────────────────────────
    const studentDefs = [
      { name: 'Rohan Sharma',  smartId: 'ST-002', phone: '9111000001', status: 'active',    due: 0,   planName: 'Monthly',   shiftName: 'Morning', seatNum: 'S1' },
      { name: 'Priya Mehta',   smartId: 'ST-003', phone: '9111000002', status: 'active',    due: 0,   planName: 'Quarterly', shiftName: 'Evening', seatNum: 'S2' },
      { name: 'Amit Verma',    smartId: 'ST-004', phone: '9111000003', status: 'active',    due: 500, planName: 'Monthly',   shiftName: 'Morning', seatNum: 'S3' },
      { name: 'Sneha Rao',     smartId: 'ST-006', phone: '9111000004', status: 'active',    due: 0,   planName: 'Yearly',    shiftName: 'Full Day', seatNum: 'S4' },
      { name: 'Karan Singh',   smartId: 'ST-010', phone: '9111000005', status: 'suspended', due: 1500,planName: 'Monthly',   shiftName: 'Night',    seatNum: 'S5' },
    ];

    for (const s of studentDefs) {
      let student = await this.studentRepo.findOne({ where: { smartId: s.smartId, branch: { id: bId } } });
      if (!student) {
        student = this.studentRepo.create();
        student.name = s.name;
        student.smartId = s.smartId;
        student.phone = s.phone;
        student.branch = branch;
        student.status = s.status === 'suspended' ? 'suspended' : 'active';
        await this.studentRepo.save(student);

        // Assign Plan (Subscription)
        const plan = await this.planRepo.findOne({ where: { name: s.planName, branch: { id: bId } } });
        if (plan) {
          const sub = this.subscriptionRepo.create();
          sub.student = student;
          sub.plan = plan;
          sub.baseAmount = plan.price;
          sub.discountApplied = 0;
          sub.totalAmount = plan.price;
          sub.paidAmount = plan.price - s.due;
          sub.dueAmount = s.due;
          sub.status = s.status;
          sub.startDate = new Date();
          sub.endDate = new Date(new Date().setMonth(new Date().getMonth() + (plan.durationDays / 30)));
          await this.subscriptionRepo.save(sub);

          // Assign Slot (Shift & Seat)
          const shift = await this.shiftRepo.findOne({ where: { name: s.shiftName, branch: { id: bId } } });
          const seat = await this.seatRepo.findOne({ where: { seatNumber: s.seatNum, branch: { id: bId } } });
          if (shift && seat) {
            const slot = this.slotRepo.create();
            slot.student = student;
            slot.shift = shift;
            slot.seat = seat;
            slot.validFrom = sub.startDate;
            slot.validTill = sub.endDate;
            await this.slotRepo.save(slot);
          }

          // Payment Record
          if (sub.paidAmount > 0) {
            const payment = this.paymentRepo.create();
            payment.amount = sub.paidAmount;
            payment.mode = 'UPI';
            payment.paymentDate = new Date();
            payment.student = student;
            payment.subscription = sub;
            await this.paymentRepo.save(payment);
          }
        }
      }
    }
    this.logger.log('✅ Students, Slots & Subscriptions seeded');

    this.logger.log('Admin DB Seeding Completed!');
    return { message: 'Admin data seeding completed successfully' };
  }
}
