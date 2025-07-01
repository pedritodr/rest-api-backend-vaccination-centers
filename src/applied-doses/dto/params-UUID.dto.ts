import { IsUUID } from 'class-validator';

export class UUIDAppliedDose {
  @IsUUID()
  id: string;
}
