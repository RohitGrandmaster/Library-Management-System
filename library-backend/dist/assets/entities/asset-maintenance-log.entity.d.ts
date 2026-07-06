import { Asset } from './asset.entity';
import { User } from '../../users/entities/user.entity';
export declare class AssetMaintenanceLog {
    id: string;
    asset: Asset;
    remark: string;
    nextDueDate: Date;
    cost: number;
    servicedDate: Date;
    servicedBy: User;
    createdAt: Date;
    updatedAt: Date;
}
