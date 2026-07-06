import { Student } from '../../students/entities/student.entity';
import { User } from '../../users/entities/user.entity';
export declare class IDCard {
    id: string;
    student: Student;
    cardNumber: string;
    qrCode: string;
    pdfUrl: string;
    isPrinted: boolean;
    printedAt: Date;
    generatedBy: User;
    createdAt: Date;
    updatedAt: Date;
}
