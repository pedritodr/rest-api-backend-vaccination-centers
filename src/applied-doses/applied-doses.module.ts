import { Module } from '@nestjs/common';
import { AppliedDosesService } from './applied-doses.service';
import { AppliedDosesController } from './applied-doses.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppliedDose } from './entities/applied-dose.entity';
import { Patient } from '../patients/entities/patient.entity';
import { VaccineBatch } from '../vaccine-batches/entities/vaccine-batch.entity';
import { VaccinationCenter } from '../vaccination-centers/entities/vaccination-center.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AppliedDose,
      Patient,
      VaccineBatch,
      VaccinationCenter,
      User,
    ]),
  ],
  controllers: [AppliedDosesController],
  providers: [AppliedDosesService],
})
export class AppliedDosesModule {}
