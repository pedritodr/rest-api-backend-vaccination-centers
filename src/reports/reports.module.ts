import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppliedDose } from 'src/applied-doses/entities/applied-dose.entity';
import { VaccineBatch } from 'src/vaccine-batches/entities/vaccine-batch.entity';
import { Patient } from 'src/patients/entities/patient.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AppliedDose, VaccineBatch, Patient])],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
