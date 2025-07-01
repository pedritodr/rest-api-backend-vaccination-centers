import { IsUUID } from 'class-validator';

export class UUIDCountry {
  @IsUUID()
  id: string;
}
