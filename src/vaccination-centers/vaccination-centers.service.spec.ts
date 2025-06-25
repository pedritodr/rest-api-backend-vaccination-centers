import { Test, TestingModule } from '@nestjs/testing';
import { VaccinationCentersService } from './vaccination-centers.service';

describe('VaccinationCentersService', () => {
  let service: VaccinationCentersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VaccinationCentersService],
    }).compile();

    service = module.get<VaccinationCentersService>(VaccinationCentersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
