import { Repository } from 'typeorm';
import { Student } from './entities/student.entity';
export declare class StudentsService {
    private readonly studentRepo;
    constructor(studentRepo: Repository<Student>);
    findAll(branchId?: string): Promise<{
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
    findOne(id: string, branchId?: string): Promise<{
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
