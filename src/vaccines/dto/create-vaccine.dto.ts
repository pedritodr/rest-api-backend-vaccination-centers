import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateVaccineDto {
  @IsString()
  @IsOptional()
  vaccineName?: string;

  @IsNumber()
  @IsNotEmpty()
  requiredDoses: number;

  @IsNumber()
  @IsNotEmpty()
  doseIntervalDays: number;

  @IsString()
  @IsNotEmpty()
  storageTemperature: string;

  @IsUUID()
  @IsNotEmpty({ message: 'manufacturerId is required' })
  manufacturerId: string;
}
