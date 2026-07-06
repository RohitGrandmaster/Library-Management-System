import { Tenant } from '../../tenants/entities/tenant.entity';
import { User } from '../../users/entities/user.entity';
export declare class Branch {
    id: string;
    tenant: Tenant;
    name: string;
    address: string;
    gstNumber: string;
    isActive: boolean;
    users: User[];
    createdAt: Date;
    updatedAt: Date;
}
