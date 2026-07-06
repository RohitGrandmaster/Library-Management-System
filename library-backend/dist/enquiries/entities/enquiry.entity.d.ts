import { User } from '../../users/entities/user.entity';
import { Student } from '../../students/entities/student.entity';
export declare class Enquiry {
    id: string;
    name: string;
    phone: string;
    preferredShift: string;
    status: string;
    followUps: {
        date: Date;
        remark: string;
        by: string;
    }[];
    handledBy: User;
    convertedToStudent: Student;
    createdAt: Date;
    updatedAt: Date;
}
