import { IsEnum, IsUUID } from 'class-validator';
import { BatchStatus } from '../../common/enums/batchStatus.enum';
import { Type } from 'class-transformer';

export class UUIDVaccineBatches {
  @IsUUID()
  id: string;
}

export class VaccineBatchesStatus {
  @IsUUID()
  id: string;

  @Type(() => Number)
  @IsEnum(BatchStatus)
  status: BatchStatus;
}
