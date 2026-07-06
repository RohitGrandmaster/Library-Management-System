import { Student } from '../../students/entities/student.entity';
import { Plan } from '../../plans/entities/plan.entity';
import { Coupon } from '../../coupons/entities/coupon.entity';
export declare class Subscription {
    id: string;
    student: Student;
    plan: Plan;
    startDate: Date;
    endDate: Date;
    baseAmount: number;
    discountApplied: number;
    lateFeeAdded: number;
    totalAmount: number;
    paidAmount: number;
    dueAmount: number;
    status: string;
    couponUsed: Coupon;
    isGroupDiscount: boolean;
    groupAdmissionId: string;
    createdAt: Date;
    updatedAt: Date;
}
