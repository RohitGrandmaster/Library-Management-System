import { ExpensesService } from './expenses.service';
export declare class ExpensesController {
    private readonly expensesService;
    constructor(expensesService: ExpensesService);
    getAllExpenses(req: any): Promise<{
        id: string;
        date: string;
        category: string;
        amount: number;
        description: string;
        branch: string;
        recordedBy: string;
    }[]>;
}
