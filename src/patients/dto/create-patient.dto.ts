import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';

export class CreatePatientDto {
  @Transform(({ value }) => value.trim())
  @IsString()
  @MinLength(1)
  firstName?: string;

  @Transform(({ value }) => value.trim())
  @IsString()
  @MinLength(1)
  lastname?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @Transform(({ value }) => value.trim())
  @IsString()
  @MinLength(6)
  identityDocument: string;

  @IsOptional()
  @Transform(({ value }) => value.trim())
  @IsString()
  @MinLength(1)
  address: string;
  @IsOptional()
  @Transform(({ value }) => value.trim())
  @IsString()
  mobilePhone: string;

  @Transform(({ value }) => value.trim())
  @IsDateString()
  dateOfBirth: Date;

  @IsOptional()
  @IsUUID()
  representativeId?: string;

  @IsBoolean()
  isChild: boolean;
}
