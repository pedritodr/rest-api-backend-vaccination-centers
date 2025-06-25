import { Test, TestingModule } from '@nestjs/testing';
import { VaccineBatchesService } from './vaccine-batches.service';

describe('VaccineBatchesService', () => {
  let service: VaccineBatchesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VaccineBatchesService],
    }).compile();

    service = module.get<VaccineBatchesService>(VaccineBatchesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
