import { Student } from '../../students/entities/student.entity';
import { Shift } from '../../shifts/entities/shift.entity';
export declare class Waitlist {
    id: string;
    student: Student;
    preferredShift: Shift;
    preferredSlots: {
        start: string;
        end: string;
    }[];
    isActive: boolean;
    addedAt: Date;
    updatedAt: Date;
}
