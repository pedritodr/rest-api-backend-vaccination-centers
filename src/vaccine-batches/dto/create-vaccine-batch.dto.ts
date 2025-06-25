import {
  IsOptional,
  IsString,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsUUID,
} from 'class-validator';

export class CreateVaccineBatchDto {
  @IsOptional()
  @IsString()
  batchNumber?: string;

  @IsDateString()
  @IsNotEmpty()
  manufactureDate: Date;

  @IsDateString()
  @IsNotEmpty()
  expirationDate: Date;

  @IsNumber()
  @IsNotEmpty()
  initialQuantity: number;

  @IsNumber()
  @IsNotEmpty()
  availableQuantity: number;

  @IsUUID()
  @IsNotEmpty({ message: 'vaccineId is required' })
  vaccineId: string;
}
