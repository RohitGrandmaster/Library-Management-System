import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Expense } from './entities/expense.entity';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectRepository(Expense)
    private readonly expenseRepo: Repository<Expense>,
  ) {}

  async findAll(branchId?: string) {
    const expenses = await this.expenseRepo.find({
      where: branchId ? { branch: { id: branchId } } : {},
      relations: {
        branch: true,
        category: true,
        addedBy: true,
      },
      order: { createdAt: 'DESC' }
    });

    return expenses.map(e => ({
      id: e.id,
      date: e.expenseDate ? new Date(e.expenseDate).toLocaleDateString('en-IN') : e.createdAt.toLocaleDateString('en-IN'),
      category: e.category?.name || 'Uncategorized',
      amount: e.amount,
      description: e.description,
      branch: e.branch?.name || 'N/A',
      recordedBy: e.addedBy?.name || 'System',
    }));
  }
}
