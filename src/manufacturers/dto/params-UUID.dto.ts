import { IsUUID } from 'class-validator';

export class UUIDManufacturer {
  @IsUUID()
  id: string;
}
