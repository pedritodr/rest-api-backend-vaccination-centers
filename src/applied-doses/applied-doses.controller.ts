import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { AppliedDosesService } from './applied-doses.service';
import { CreateAppliedDoseDto } from './dto/create-applied-dose.dto';
import { UpdateAppliedDoseDto } from './dto/update-applied-dose.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UUIDAppliedDose } from './dto/params-UUID.dto';
@ApiBearerAuth()
@ApiTags('Applied doses')
@Controller('applied-doses')
export class AppliedDosesController {
  constructor(private readonly appliedDosesService: AppliedDosesService) {}

  @Post()
  create(@Body() createAppliedDoseDto: CreateAppliedDoseDto) {
    return this.appliedDosesService.create(createAppliedDoseDto);
  }

  @Get()
  findAll(@Query('isActive') isActive?: string) {
    let active: boolean | undefined = undefined;
    if (isActive === 'true') active = true;
    else if (isActive === 'false') active = false;

    return this.appliedDosesService.findAll(active);
  }

  @Get(':id')
  findOne(@Param('id') { id }: UUIDAppliedDose) {
    return this.appliedDosesService.findOne(id);
  }

  @Get(':id/with-doses')
  getPatientWithDoses(@Param('id') { id }: UUIDAppliedDose) {
    return this.appliedDosesService.findPatientWithDoses(id);
  }

  @Patch('cancel/:id')
  async cancelDose(@Param('id') { id }: UUIDAppliedDose) {
    return this.appliedDosesService.cancelDose(id);
  }
}
