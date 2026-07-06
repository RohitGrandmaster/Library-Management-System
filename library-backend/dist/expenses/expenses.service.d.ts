import { Repository } from 'typeorm';
import { Expense } from './entities/expense.entity';
export declare class ExpensesService {
    private readonly expenseRepo;
    constructor(expenseRepo: Repository<Expense>);
    findAll(branchId?: string): Promise<{
        id: string;
        date: string;
        category: string;
        amount: number;
        description: string;
        branch: string;
        recordedBy: string;
    }[]>;
}
