import { IsUUID } from 'class-validator';

export class ReportPatientsByRepresentativeDto {
  @IsUUID()
  representativeId: string;
}
