import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateManufacturerDto {
  @IsString()
  @IsOptional()
  manufacturerName?: string;

  @IsUUID()
  @IsNotEmpty({ message: 'countryId is required' })
  countryId: string;
}
