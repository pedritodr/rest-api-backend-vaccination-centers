import { IsUUID } from 'class-validator';

export class ParamsUUID {
  @IsUUID()
  id: string;
}

export class ParamsCenterUUID {
  @IsUUID()
  centerId: string;
}
