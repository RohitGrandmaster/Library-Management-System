import { Seat } from '../../seats/entities/seat.entity';
import { Student } from '../../students/entities/student.entity';
import { Shift } from '../../shifts/entities/shift.entity';
export declare class SeatHistory {
    id: string;
    seat: Seat;
    student: Student;
    shift: Shift;
    occupiedFrom: Date;
    occupiedTill: Date;
    reason: string;
    createdAt: Date;
    updatedAt: Date;
}
