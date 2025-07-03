import { forwardRef, Module } from '@nestjs/common';
import { VaccineBatchesService } from './vaccine-batches.service';
import { VaccineBatchesController } from './vaccine-batches.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VaccineBatch } from './entities/vaccine-batch.entity';
import { Vaccine } from 'src/vaccines/entities/vaccine.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([VaccineBatch, Vaccine]),
    forwardRef(() => AuthModule),
  ],
  controllers: [VaccineBatchesController],
  providers: [VaccineBatchesService],
})
export class VaccineBatchesModule {}
