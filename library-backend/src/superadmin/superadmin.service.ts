import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tenant } from '../tenants/entities/tenant.entity';
import { Branch } from '../branches/entities/branch.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class SuperadminService {
  constructor(
    @InjectRepository(Tenant) private tenantRepo: Repository<Tenant>,
    @InjectRepository(Branch) private branchRepo: Repository<Branch>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  async getDashboardData() {
    const totalLibraries = await this.branchRepo.count();
    const totalStudents = 14820; // Hardcoded for now until students are seeded fully
    
    // recentLibraries mapping
    const branches = await this.branchRepo.find({ relations: { tenant: true } });
    const recentLibraries = branches.map(b => ({
      initials: b.name.substring(0, 2).toUpperCase(),
      name: b.name,
      owner: b.tenant?.ownerEmail || 'Unknown',
      students: Math.floor(Math.random() * 500),
      status: b.isActive ? 'active' : 'inactive',
      plan: 'Pro',
      joinedAt: b.createdAt || new Date(),
    }));

    return {
      kpiCards: [
        { title: "Total Libraries", value: totalLibraries.toString(), icon: "store", trend: "+4 this month" },
        { title: "Total Students", value: totalStudents.toString(), icon: "groups", subtitle: "Across all branches" },
        { title: "Platform Revenue", value: "₹ 2,14,000", icon: "currency_rupee", trend: "+18%" },
        { title: "Pending Setups", value: "5", icon: "pending_actions", alert: "Needs Attention" }
      ],
      recentLibraries,
      actionItems: [
        { icon: "warning", text: "5 Libraries Pending Setup", type: "error" },
        { icon: "credit_card_off", text: "3 Subscriptions Expiring", type: "error" },
        { icon: "support_agent", text: "8 Support Tickets Open", type: "tertiary" },
        { icon: "cloud_upload", text: "Last Backup: 2h ago", type: "tertiary" }
      ],
      systemHealth: {
        uptime: "99.97%",
        activeUsers: await this.userRepo.count(),
        apiLatency: "42ms",
        lastBackup: "2h ago"
      }
    };
  }

  async getLibraries() {
    const branches = await this.branchRepo.find({ relations: { tenant: true } });
    return branches.map(b => ({
      id: b.id,
      initials: b.name.substring(0, 2).toUpperCase(),
      name: b.name,
      owner: b.tenant?.ownerEmail || 'Unknown',
      students: Math.floor(Math.random() * 500),
      status: b.isActive ? 'active' : 'inactive',
      plan: 'Pro',
      joinedAt: b.createdAt || new Date(),
    }));
  }
}
