import { IsOptional, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class ReportExpiringBatchesDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  days?: number; // días hasta el vencimiento (default: 14)
}
