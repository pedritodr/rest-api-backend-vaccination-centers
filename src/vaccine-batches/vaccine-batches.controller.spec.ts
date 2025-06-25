import { Test, TestingModule } from '@nestjs/testing';
import { VaccineBatchesController } from './vaccine-batches.controller';
import { VaccineBatchesService } from './vaccine-batches.service';

describe('VaccineBatchesController', () => {
  let controller: VaccineBatchesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VaccineBatchesController],
      providers: [VaccineBatchesService],
    }).compile();

    controller = module.get<VaccineBatchesController>(VaccineBatchesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
