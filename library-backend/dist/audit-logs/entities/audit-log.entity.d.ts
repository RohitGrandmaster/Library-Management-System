import { User } from '../../users/entities/user.entity';
export declare class AuditLog {
    id: string;
    entity: string;
    entityId: string;
    action: string;
    oldValues: any;
    newValues: any;
    performedBy: User;
    ipAddress: string;
    timestamp: Date;
}
