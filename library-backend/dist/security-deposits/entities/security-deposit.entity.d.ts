import { Student } from '../../students/entities/student.entity';
import { User } from '../../users/entities/user.entity';
export declare class SecurityDeposit {
    id: string;
    student: Student;
    amount: number;
    status: string;
    refundDate: Date;
    deductionAmount: number;
    deductionReason: string;
    collectedBy: User;
    refundedBy: User;
    createdAt: Date;
    updatedAt: Date;
}
