import { Branch } from '../../branches/entities/branch.entity';
export declare class Locker {
    id: number;
    lockerNumber: string;
    branch: Branch;
    status: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
