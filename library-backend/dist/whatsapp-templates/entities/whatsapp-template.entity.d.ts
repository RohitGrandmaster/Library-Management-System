import { Branch } from '../../branches/entities/branch.entity';
import { User } from '../../users/entities/user.entity';
export declare class WhatsAppTemplate {
    id: string;
    branch: Branch;
    templateType: string;
    messageBody: string;
    variables: string[];
    isActive: boolean;
    updatedBy: User;
    createdAt: Date;
    updatedAt: Date;
}
