import { Branch } from '../../branches/entities/branch.entity';
import { User } from '../../users/entities/user.entity';
export declare class BulkImport {
    id: string;
    branch: Branch;
    entityType: string;
    fileName: string;
    totalRows: number;
    successCount: number;
    failureCount: number;
    errors: {
        row: number;
        error: string;
    }[];
    uploadedBy: User;
    uploadedAt: Date;
    updatedAt: Date;
}
