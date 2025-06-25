import { PartialType } from '@nestjs/swagger';
import { CreateAppliedDoseDto } from './create-applied-dose.dto';

export class UpdateAppliedDoseDto extends PartialType(CreateAppliedDoseDto) {}
