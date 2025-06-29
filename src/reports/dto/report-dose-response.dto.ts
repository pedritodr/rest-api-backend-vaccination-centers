import { Patient } from 'src/patients/entities/patient.entity';
import { VaccineBatch } from 'src/vaccine-batches/entities/vaccine-batch.entity';
import { VaccinationCenter } from 'src/vaccination-centers/entities/vaccination-center.entity';
import { User } from 'src/users/entities/user.entity';

export class ReportDoseResponseDto {
  id: string;
  doseNumber: number;
  observations: string;
  applicationDateTime: Date;
  isActive: boolean;
  patient: Patient;
  vaccineBatch: VaccineBatch;
  vaccinationCenter: VaccinationCenter;
  applyingUser: User;
}
