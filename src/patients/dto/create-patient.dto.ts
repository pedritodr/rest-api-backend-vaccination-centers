import { Transform } from 'class-transformer';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class CreatePatientDto {
  @Transform(({ value }) => value.trim())
  @IsString()
  @MinLength(1)
  firstName?: string;

  @Transform(({ value }) => value.trim())
  @IsString()
  @MinLength(1)
  lastname?: string;

  @IsEmail()
  email: string;

  @Transform(({ value }) => value.trim())
  @IsString()
  @MinLength(10)
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

  @IsOptional()
  @Transform(({ value }) => value.trim())
  @IsString()
  dateOfBirth: Date;
}
