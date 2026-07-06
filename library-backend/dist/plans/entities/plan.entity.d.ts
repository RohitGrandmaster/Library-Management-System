import { Branch } from '../../branches/entities/branch.entity';
export declare class Plan {
    id: string;
    branch: Branch;
    name: string;
    durationDays: number;
    price: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
