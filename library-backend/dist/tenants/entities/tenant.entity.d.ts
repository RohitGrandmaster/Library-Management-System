import { Branch } from '../../branches/entities/branch.entity';
export declare class Tenant {
    id: string;
    name: string;
    ownerEmail: string;
    isActive: boolean;
    branches: Branch[];
    createdAt: Date;
    updatedAt: Date;
}
