import { Student } from '../../students/entities/student.entity';
import { Subscription } from '../../subscriptions/entities/subscription.entity';
import { User } from '../../users/entities/user.entity';
export declare class Payment {
    id: string;
    student: Student;
    subscription: Subscription;
    amount: number;
    mode: string;
    transactionId: string;
    lateFee: number;
    remark: string;
    receivedBy: User;
    isDeleted: boolean;
    paymentDate: Date;
    updatedAt: Date;
}
