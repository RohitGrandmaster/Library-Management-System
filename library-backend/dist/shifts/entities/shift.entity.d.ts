import { Branch } from '../../branches/entities/branch.entity';
export declare class Shift {
    id: string;
    branch: Branch;
    name: string;
    startTime: string;
    endTime: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
