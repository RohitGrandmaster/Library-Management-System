import { Test, TestingModule } from '@nestjs/testing';
import { StudentSlotsController } from './student-slots.controller';

describe('StudentSlotsController', () => {
  let controller: StudentSlotsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudentSlotsController],
    }).compile();

    controller = module.get<StudentSlotsController>(StudentSlotsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
