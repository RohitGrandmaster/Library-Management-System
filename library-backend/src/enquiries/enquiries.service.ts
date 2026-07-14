import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Enquiry } from './entities/enquiry.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class EnquiriesService {
  constructor(
    @InjectRepository(Enquiry)
    private readonly enquiryRepo: Repository<Enquiry>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async findAll() {
    let enquiries = await this.enquiryRepo.find({
      relations: { handledBy: true, convertedToStudent: true },
      order: { createdAt: 'DESC' },
    });

    const hasVisited = enquiries.some(e => e.status === 'visited');
    if (!hasVisited) {
      await this.enquiryRepo.clear(); // Clear old partial dummies

      // Create dummy data for all 5 statuses
      const mockUser = await this.userRepo.findOne({ where: {} }) || null;
      
      const dummies = [
        this.enquiryRepo.create({ name: 'Ramesh Singh', phone: '9876543210', preferredShift: 'Morning', status: 'new', handledBy: mockUser as any }),
        this.enquiryRepo.create({ name: 'Suresh Kumar', phone: '9988776655', preferredShift: 'Evening', status: 'visited', handledBy: mockUser as any }),
        this.enquiryRepo.create({ name: 'Priya Sharma', phone: '9123456789', preferredShift: 'Night', status: 'interested', handledBy: mockUser as any }),
        this.enquiryRepo.create({ name: 'Amit Verma', phone: '9900112233', preferredShift: 'Morning', status: 'converted', handledBy: mockUser as any }),
        this.enquiryRepo.create({ name: 'Neha Gupta', phone: '9811223344', preferredShift: 'Afternoon', status: 'lost', handledBy: mockUser as any }),
      ];
      await this.enquiryRepo.save(dummies);
      enquiries = await this.enquiryRepo.find({
        relations: { handledBy: true, convertedToStudent: true },
        order: { createdAt: 'DESC' },
      });
    }

    return enquiries;
  }

  async findOne(id: string) {
    return this.enquiryRepo.findOne({
      where: { id },
      relations: { handledBy: true, convertedToStudent: true },
    });
  }

  async updateStatus(id: string, status: string, reason?: string) {
    const enquiry = await this.enquiryRepo.findOne({ where: { id } });
    if (!enquiry) return null;
    
    enquiry.status = status.toLowerCase();
    
    if (reason) {
      enquiry.followUps = [
        {
          date: new Date(),
          remark: `Status updated to ${status} - ${reason}`,
          by: 'Admin',
        },
        ...enquiry.followUps,
      ];
    }
    
    return this.enquiryRepo.save(enquiry);
  }

  async addFollowUp(id: string, followUp: { date: Date; remark: string; by: string }) {
    const enquiry = await this.enquiryRepo.findOne({ where: { id } });
    if (!enquiry) return null;

    enquiry.followUps = [followUp, ...enquiry.followUps];
    return this.enquiryRepo.save(enquiry);
  }
}
