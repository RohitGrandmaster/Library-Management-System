import { Branch } from '../../branches/entities/branch.entity';
import { Role } from '../../roles/entities/role.entity';
export declare class User {
    id: string;
    phone: string;
    email: string;
    name: string;
    password: string;
    branch: Branch;
    role: Role;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
