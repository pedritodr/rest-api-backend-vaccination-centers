import { Transform } from 'class-transformer';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateVaccinationCenterDto {
  @Transform(({ value }) => value.trim())
  @IsString()
  @MinLength(1)
  centerName?: string;

  @Transform(({ value }) => value.trim())
  @IsString()
  @MinLength(1)
  address?: string;

  @IsEmail()
  email: string;
  @IsOptional()
  @Transform(({ value }) => value.trim())
  @IsString()
  @MinLength(11)
  phone: string;
  @IsOptional()
  @Transform(({ value }) => value.trim())
  @IsString()
  @MinLength(11)
  mobilePhone: string;
}
