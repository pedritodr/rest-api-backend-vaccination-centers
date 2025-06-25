import { PartialType } from '@nestjs/swagger';
import { CreateVaccinationCenterDto } from './create-vaccination-center.dto';

export class UpdateVaccinationCenterDto extends PartialType(CreateVaccinationCenterDto) {}
