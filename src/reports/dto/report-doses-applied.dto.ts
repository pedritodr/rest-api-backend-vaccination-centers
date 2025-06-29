import {
  IsOptional,
  IsDateString,
  IsUUID,
  IsBooleanString,
} from 'class-validator';

export class ReportDosesAppliedDto {
  @IsOptional()
  @IsDateString()
  from?: string;

  @IsOptional()
  @IsDateString()
  to?: string;

  @IsOptional()
  @IsUUID()
  centerId?: string;

  @IsOptional()
  @IsUUID()
  userId?: string;

  @IsOptional()
  @IsBooleanString()
  isActive?: string; // "true" or "false" as string

  @IsOptional()
  page?: string; // for pagination

  @IsOptional()
  limit?: string; // for pagination
}
