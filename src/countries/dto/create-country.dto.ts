import { Transform } from 'class-transformer';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class CreateCountryDto {
  @Transform(({ value }) => value.trim())
  @IsString()
  @MinLength(1)
  nameCountry?: string;
}
