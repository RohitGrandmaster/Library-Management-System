import { Student } from '../../students/entities/student.entity';
import { Shift } from '../../shifts/entities/shift.entity';
import { Seat } from '../../seats/entities/seat.entity';
import { User } from '../../users/entities/user.entity';
export declare class ShiftMigration {
    id: string;
    student: Student;
    fromShift: Shift;
    toShift: Shift;
    fromSeat: Seat;
    toSeat: Seat;
    feeAdjustment: number;
    processedBy: User;
    migratedAt: Date;
    updatedAt: Date;
}
