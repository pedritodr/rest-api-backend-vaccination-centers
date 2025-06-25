import { Test, TestingModule } from '@nestjs/testing';
import { AppliedDosesService } from './applied-doses.service';

describe('AppliedDosesService', () => {
  let service: AppliedDosesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppliedDosesService],
    }).compile();

    service = module.get<AppliedDosesService>(AppliedDosesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
