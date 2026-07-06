import { Student } from '../../students/entities/student.entity';
import { User } from '../../users/entities/user.entity';
export declare class Complaint {
    id: string;
    student: Student;
    title: string;
    description: string;
    status: string;
    isAnonymous: boolean;
    createdAt: Date;
    updatedAt: Date;
    resolvedAt: Date;
    resolvedBy: User;
}
