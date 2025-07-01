import { IsUUID } from 'class-validator';

export class UUIDVaccineBatches {
  @IsUUID()
  id: string;
}
