import { Student } from '../../students/entities/student.entity';
import { Shift } from '../../shifts/entities/shift.entity';
import { Seat } from '../../seats/entities/seat.entity';
import { Locker } from '../../lockers/entities/locker.entity';
export declare class StudentSlot {
    id: string;
    student: Student;
    shift: Shift;
    customSlots: {
        start: string;
        end: string;
        days?: string[];
    }[];
    seat: Seat;
    locker: Locker;
    validFrom: Date;
    validTill: Date;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
