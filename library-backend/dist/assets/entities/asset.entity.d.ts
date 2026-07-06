import { Branch } from '../../branches/entities/branch.entity';
export declare class Asset {
    id: string;
    branch: Branch;
    name: string;
    quantity: number;
    purchaseDate: Date;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}
