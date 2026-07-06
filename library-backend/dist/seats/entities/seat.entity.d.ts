import { Branch } from '../../branches/entities/branch.entity';
export declare class Seat {
    id: number;
    seatNumber: string;
    branch: Branch;
    status: string;
    maintenanceLog: {
        date: Date;
        remark: string;
        doneBy?: string;
    }[];
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
