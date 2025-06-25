import { Test, TestingModule } from '@nestjs/testing';
import { VaccinationCentersController } from './vaccination-centers.controller';
import { VaccinationCentersService } from './vaccination-centers.service';

describe('VaccinationCentersController', () => {
  let controller: VaccinationCentersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VaccinationCentersController],
      providers: [VaccinationCentersService],
    }).compile();

    controller = module.get<VaccinationCentersController>(VaccinationCentersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
