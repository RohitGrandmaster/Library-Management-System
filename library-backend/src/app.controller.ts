import { Controller, Get, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { DataSource } from 'typeorm';

@Controller('api')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly dataSource: DataSource,
  ) {}

  @Get('hello')
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('crm/enquiries')
  async getEnquiries() {
    return this.dataSource.query('SELECT * FROM enquiry ORDER BY "createdAt" DESC');
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

  @Get('admin/students')
  async getStudents() {
    return this.dataSource.query('SELECT * FROM student ORDER BY "registrationDate" DESC');
  }

  @Get('admin/staff-users')
  async getStaffUsers() {
    return this.dataSource.query('SELECT * FROM "user" WHERE role = \'manager\' ORDER BY "createdAt" DESC');
  }

  @Get('admin/plans')
  async getPlans() {
    return this.dataSource.query('SELECT * FROM plan ORDER BY price ASC');
  }

  @Get('admin/coupons')
  async getCoupons() {
    return this.dataSource.query('SELECT * FROM coupon ORDER BY "validUntil" DESC');
  }

  @Get('admin/audit-logs')
  async getAuditLogs() {
    return this.dataSource.query('SELECT * FROM audit_log ORDER BY "createdAt" DESC');
  }

  @Get('admin/branches')
  async getBranches() {
    return this.dataSource.query('SELECT * FROM branch ORDER BY name ASC');
  }

  @Get('admin/blacklist')
  async getBlacklist() {
    return this.dataSource.query('SELECT * FROM blacklist ORDER BY date DESC');
  }

  @Get('admin/expenses')
  async getAdminExpenses() {
    return this.dataSource.query('SELECT * FROM expense ORDER BY "createdAt" DESC');
  }

  @Get('admin/expense-categories')
  async getAdminExpenseCategories() {
    return [
      { id: '1', name: 'Rent', description: 'Monthly rent' },
      { id: '2', name: 'Electricity', description: 'Power bill' },
    ];
  }

  @Get('admin/permissions')
  async getAdminPermissions() {
    return [
      {
        module: 'Students',
        actions: [
          { label: 'View Students',    key: 'students.view',   roles: { Manager: true  } },
          { label: 'Add Student',      key: 'students.add',    roles: { Manager: true  } },
          { label: 'Edit Student',     key: 'students.edit',   roles: { Manager: true  } },
          { label: 'Delete Student',   key: 'students.delete', roles: { Manager: false } },
          { label: 'Mark Exit',        key: 'students.exit',   roles: { Manager: true  } },
        ],
      },
      {
        module: 'Finance',
        actions: [
          { label: 'Collect Fee',      key: 'finance.collect', roles: { Manager: true  } },
          { label: 'View Payments',    key: 'finance.view',    roles: { Manager: true  } },
          { label: 'View Profit',      key: 'finance.profit',  roles: { Manager: false } },
          { label: 'Issue Refund',     key: 'finance.refund',  roles: { Manager: false } },
          { label: 'Apply Discount',   key: 'finance.discount',roles: { Manager: true  } },
        ],
      }
    ];
  }
}
