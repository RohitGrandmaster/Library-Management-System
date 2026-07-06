import { Branch } from '../../branches/entities/branch.entity';
import { StudentSlot } from '../../student-slots/entities/student-slot.entity';
import { Subscription } from '../../subscriptions/entities/subscription.entity';
export declare class Student {
    id: string;
    smartId: string;
    name: string;
    phone: string;
    parentPhone: string;
    email: string;
    college: string;
    photoUrl: string;
    documents: {
        aadhar?: string;
        idProof?: string;
        photo?: string;
    };
    status: string;
    exitDate: Date;
    commitmentReliabilityScore: number;
    referralBonusBalance: number;
    isAlumni: boolean;
    branch: Branch;
    referredBy: Student;
    slots: StudentSlot[];
    referrals: Student[];
    subscriptions: Subscription[];
    joinDate: Date;
    updatedAt: Date;
}
