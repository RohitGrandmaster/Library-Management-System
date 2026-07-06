import { Branch } from '../../branches/entities/branch.entity';
import { User } from '../../users/entities/user.entity';
export declare class ExpenseCategory {
    id: string;
    name: string;
    branch: Branch;
    createdAt: Date;
    updatedAt: Date;
}
export declare class Expense {
    id: string;
    branch: Branch;
    category: ExpenseCategory;
    amount: number;
    description: string;
    expenseDate: Date;
    addedBy: User;
    createdAt: Date;
    updatedAt: Date;
}
