import {
  IsString,
  IsOptional,
  IsNumber,
  IsUUID,
  IsNotEmpty,
} from 'class-validator';
export class CreateAppliedDoseDto {
  @IsOptional()
  @IsNumber()
  doseNumber?: number;

  @IsOptional()
  @IsString()
  observations?: string;

  @IsUUID()
  @IsNotEmpty({ message: 'patientId is required' })
  patientId: string;

  @IsUUID()
  @IsNotEmpty({ message: 'vaccineBatchId is required' })
  vaccineBatchId: string;

  @IsUUID()
  @IsNotEmpty({ message: 'vaccinationCenterId is required' })
  vaccinationCenterId: string;

  @IsUUID()
  @IsNotEmpty({ message: 'applyingUserId is required' })
  applyingUserId: string;
}
