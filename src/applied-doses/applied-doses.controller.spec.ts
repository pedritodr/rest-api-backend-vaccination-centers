import { Test, TestingModule } from '@nestjs/testing';
import { AppliedDosesController } from './applied-doses.controller';
import { AppliedDosesService } from './applied-doses.service';

describe('AppliedDosesController', () => {
  let controller: AppliedDosesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppliedDosesController],
      providers: [AppliedDosesService],
    }).compile();

    controller = module.get<AppliedDosesController>(AppliedDosesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
