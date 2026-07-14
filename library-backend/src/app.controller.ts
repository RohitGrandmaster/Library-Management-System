import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { DataSource } from 'typeorm';

@Controller('')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly dataSource: DataSource,
  ) {}

  @Get('hello')
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('communication/complaints')
  async getComplaints() {
    return this.dataSource.query('SELECT * FROM complaint ORDER BY "createdAt" DESC');
  }

  @Get('communication/notices')
  async getNotices() {
    return this.dataSource.query('SELECT * FROM notice ORDER BY "createdAt" DESC');
  }

  @Get('finance/payments')
  async getPayments() {
    // Return dummy payments based on expenses since payment table might not exist
    const exps = await this.dataSource.query('SELECT * FROM expense ORDER BY "createdAt" DESC');
    return exps.map((e: any) => ({
      id: e.id, studentName: 'Mock Student', amount: e.amount, date: e.expenseDate, status: 'completed'
    }));
  }

  @Get('finance/refunds')
  async getRefunds() {
    return [
      { id: '1', name: 'John', amount: 500, date: new Date(), status: 'processed' },
      { id: '2', name: 'Amit', amount: 1000, date: new Date(), status: 'pending' },
      { id: '3', name: 'Priya', amount: 200, date: new Date(), status: 'processed' },
    ];
  }

  @Get('seats_shifts_lockers/seat-matrix')
  async getSeatMatrix() {
    return this.dataSource.query('SELECT * FROM seat ORDER BY "seatNumber" ASC');
  }

  @Get('seats_shifts_lockers/lockers')
  async getLockers() {
    return this.dataSource.query('SELECT * FROM locker ORDER BY "lockerNumber" ASC');
  }

}
