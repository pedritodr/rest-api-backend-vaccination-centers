import { Module } from '@nestjs/common';
import { VaccinesService } from './vaccines.service';
import { VaccinesController } from './vaccines.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vaccine } from './entities/vaccine.entity';
import { Manufacturer } from '../manufacturers/entities/manufacturer.entity';
import { VaccineBatch } from '../vaccine-batches/entities/vaccine-batch.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Vaccine, Manufacturer, VaccineBatch])],
  controllers: [VaccinesController],
  providers: [VaccinesService],
})
export class VaccinesModule {}
