import { Patient } from 'src/patients/entities/patient.entity';
import { Vaccine } from 'src/vaccines/entities/vaccine.entity';

export class ReportIncompleteVaccinationResponseDto {
  patient: Patient;
  vaccine: Vaccine;
  dosesApplied: number;
  requiredDoses: number;
}
