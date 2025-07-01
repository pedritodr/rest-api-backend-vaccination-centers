import { IsUUID } from 'class-validator';

export class UUIDVaccine {
  @IsUUID()
  id: string;
}
