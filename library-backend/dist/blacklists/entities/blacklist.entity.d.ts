import { Branch } from '../../branches/entities/branch.entity';
import { User } from '../../users/entities/user.entity';
export declare class Blacklist {
    id: string;
    phone: string;
    name: string;
    reason: string;
    branch: Branch;
    addedBy: User;
    createdAt: Date;
    updatedAt: Date;
}
