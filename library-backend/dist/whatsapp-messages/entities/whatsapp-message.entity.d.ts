import { Student } from '../../students/entities/student.entity';
export declare class WhatsAppMessage {
    id: string;
    student: Student;
    phoneNumber: string;
    messageType: string;
    messageContent: string;
    status: string;
    externalMessageId: string;
    errorMessage: string;
    sentAt: Date;
    updatedAt: Date;
}
