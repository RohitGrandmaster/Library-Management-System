import { Role } from '../../roles/entities/role.entity';
export declare class Permission {
    id: string;
    name: string;
    description: string;
    roles: Role[];
    createdAt: Date;
    updatedAt: Date;
}
