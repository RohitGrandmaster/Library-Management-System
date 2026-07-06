import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
    @InjectRepository(Payment) private paymentRepo: Repository<Payment>,
    @InjectRepository(Expense) private expenseRepo: Repository<Expense>,
  ) {}

  async seedCoreData() {
    this.logger.log('Starting Core DB Seeding...');
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

    let tenant = await this.tenantRepo.findOne({ where: { name: 'City Reading Hub' } });
    if (!tenant) {
      tenant = this.tenantRepo.create({
        name: 'City Reading Hub',
        ownerEmail: 'rajesh@cityreadinghub.com',
      });
      await this.tenantRepo.save(tenant);
    }

    const branches = [
      { name: 'StudyNest Patna', isActive: true },
      { name: 'BrainKraft Jaipur', isActive: true },
      { name: 'ReadHive Lucknow', isActive: false },
    ];
    const createdBranches: Record<string, Branch> = {};
    for (const b of branches) {
      let branch = await this.branchRepo.findOne({ where: { name: b.name }, relations: { tenant: true } });
      if (!branch) {
        branch = this.branchRepo.create({
          name: b.name,
          isActive: b.isActive,
          tenant: tenant,
        });
        await this.branchRepo.save(branch);
      }
      createdBranches[b.name] = branch;
    }

    const users = [
      {
        email: 'owner@smartlibrary.com',
        phone: '9876543210',
        name: 'Rajesh Kumar',
        password: 'Owner@1234',
        role: createdRoles['superadmin'],
        branch: undefined,
      },
      {
        email: 'admin@smartlibrary.com',
        phone: '9876543211',
        name: 'Admin User',
        password: 'Admin@1234',
        role: createdRoles['admin'],
        branch: createdBranches['StudyNest Patna'],
      },
      {
        email: 'manager@smartlibrary.com',
        phone: '9876543212',
        name: 'Manager User',
        password: 'Manager@1234',
        role: createdRoles['manager'],
        branch: createdBranches['StudyNest Patna'],
      }
    ];

    for (const u of users) {
      let user = await this.userRepo.findOne({ where: { email: u.email } });
      if (!user) {
        user = this.userRepo.create(u);
        await this.userRepo.save(user);
      }
    }

    this.logger.log('Core DB Seeding Completed!');
    return { message: 'Seeding completed successfully' };
  }

  async seedAdminData() {
    this.logger.log('Starting Admin DB Seeding...');
    const tenant = await this.tenantRepo.findOne({ where: { name: 'City Reading Hub' } });
    const branch = await this.branchRepo.findOne({ where: { name: 'StudyNest Patna' }, relations: { tenant: true } });

    if (!branch) throw new Error('Branch not found. Run seed/core first.');
    const bId = branch.id;

    // Shifts
    const shiftNames = ['Morning', 'Evening', 'Night', 'Full Day'];
    for (const s of shiftNames) {
      let shift = await this.shiftRepo.findOne({ where: { name: s, branch: { id: bId } } });
      if (!shift) {
        shift = this.shiftRepo.create();
        shift.name = s;
        shift.branch = branch;
        shift.startTime = '06:00';
        shift.endTime = '12:00';
        await this.shiftRepo.save(shift);
      }
    }

    // Seats
    for (let i = 1; i <= 24; i++) {
      let seat = await this.seatRepo.findOne({ where: { seatNumber: `S${i}`, branch: { id: bId } } });
      if (!seat) {
        seat = this.seatRepo.create();
        seat.seatNumber = `S${i}`;
        seat.branch = branch;
        await this.seatRepo.save(seat);
      }
    }

    // Plans
    const plans = [{ name: 'Monthly', price: 1000 }, { name: 'Quarterly', price: 2800 }];
    for (const p of plans) {
      let plan = await this.planRepo.findOne({ where: { name: p.name, branch: { id: bId } } });
      if (!plan) {
        plan = this.planRepo.create();
        plan.name = p.name;
        plan.price = p.price;
        plan.durationDays = 30;
        plan.branch = branch;
        await this.planRepo.save(plan);
      }
    }

    // Students & Payments
    const students = [
      { name: 'Rohan Sharma', smartId: 'ST-002', seat: 'S2' },
      { name: 'Priya Mehta', smartId: 'ST-003', seat: 'S3' },
      { name: 'Amit Verma', smartId: 'ST-004', seat: 'S4' },
      { name: 'Sneha Rao', smartId: 'ST-006', seat: 'S6' },
    ];

    for (const s of students) {
      let student = await this.studentRepo.findOne({ where: { smartId: s.smartId, branch: { id: bId } } });
      if (!student) {
        student = this.studentRepo.create();
        student.name = s.name;
        student.smartId = s.smartId;
        student.phone = '9999999999';
        student.branch = branch;
        await this.studentRepo.save(student);

        const payment = this.paymentRepo.create();
        payment.amount = 1500;
        payment.mode = 'UPI';
        payment.paymentDate = new Date();
        payment.student = student;
        await this.paymentRepo.save(payment);
      }
    }

    // Expenses (Skipped for now, needs ExpenseCategory Repo)

    this.logger.log('Admin DB Seeding Completed!');
    return { message: 'Admin Data Seeding completed' };
  }
}
