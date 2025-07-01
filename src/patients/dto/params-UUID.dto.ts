import { IsUUID } from 'class-validator';

export class UUIDPatients {
  @IsUUID()
  id: string;
}
