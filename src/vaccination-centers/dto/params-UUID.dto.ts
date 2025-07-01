import { IsUUID } from 'class-validator';

export class UUIDVaccinationCenter {
  @IsUUID()
  id: string;
}
