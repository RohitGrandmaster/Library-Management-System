import { Test, TestingModule } from '@nestjs/testing';
import { StudentSlotsService } from './student-slots.service';

describe('StudentSlotsService', () => {
  let service: StudentSlotsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StudentSlotsService],
    }).compile();

    service = module.get<StudentSlotsService>(StudentSlotsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
