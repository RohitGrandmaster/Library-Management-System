import { Branch } from '../../branches/entities/branch.entity';
export declare class Coupon {
    id: string;
    branch: Branch;
    code: string;
    discountAmount: number;
    discountPercent: number;
    validTill: Date;
    usedCount: number;
    maxUses: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
