import { Permission } from '../../permissions/entities/permission.entity';
import { User } from '../../users/entities/user.entity';
export declare class Role {
    id: string;
    name: string;
    description: string;
    permissions: Permission[];
    users: User[];
    createdAt: Date;
    updatedAt: Date;
}
