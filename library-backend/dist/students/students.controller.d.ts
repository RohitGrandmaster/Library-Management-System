import { StudentsService } from './students.service';
export declare class StudentsController {
    private readonly studentsService;
    constructor(studentsService: StudentsService);
    getAllStudents(req: any): Promise<{
        id: string;
        smartId: string;
        name: string;
        phone: string;
        branch: string;
        shift: string;
        seat: string;
        plan: string;
        status: string;
        due: number;
        joined: string;
        email: string;
        parentPhone: string;
        college: string;
    }[]>;
    getStudentById(id: string, req: any): Promise<{
        id: string;
        smartId: string;
        name: string;
        firstName: string;
        lastName: string;
        phone: string;
        email: string;
        parentPhone: string;
        college: string;
        branch: string;
        shift: string;
        seat: string;
        plan: string;
        status: string;
        due: number;
        joined: string;
        history: {
            plan: string;
            startDate: Date;
            endDate: Date;
            amount: number;
            status: string;
        }[];
    }>;
}
