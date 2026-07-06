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
export declare class SeederService {
    private roleRepo;
    private permissionRepo;
    private tenantRepo;
    private branchRepo;
    private userRepo;
    private shiftRepo;
    private seatRepo;
    private planRepo;
    private studentRepo;
    private subscriptionRepo;
    private paymentRepo;
    private expenseRepo;
    private readonly logger;
    constructor(roleRepo: Repository<Role>, permissionRepo: Repository<Permission>, tenantRepo: Repository<Tenant>, branchRepo: Repository<Branch>, userRepo: Repository<User>, shiftRepo: Repository<Shift>, seatRepo: Repository<Seat>, planRepo: Repository<Plan>, studentRepo: Repository<Student>, subscriptionRepo: Repository<Subscription>, paymentRepo: Repository<Payment>, expenseRepo: Repository<Expense>);
    seedCoreData(): Promise<{
        message: string;
    }>;
    seedAdminData(): Promise<{
        message: string;
    }>;
}
