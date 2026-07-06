import { Student } from '../../students/entities/student.entity';
import { User } from '../../users/entities/user.entity';
export declare class Attendance {
    id: string;
    student: Student;
    date: Date;
    inTime: string;
    outTime: string;
    markedBy: User;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}
