import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AppliedDosesService } from './applied-doses.service';
import { CreateAppliedDoseDto } from './dto/create-applied-dose.dto';
import { UpdateAppliedDoseDto } from './dto/update-applied-dose.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
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
  findAll() {
    return this.appliedDosesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.appliedDosesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAppliedDoseDto: UpdateAppliedDoseDto,
  ) {
    return this.appliedDosesService.update(id, updateAppliedDoseDto);
  }

  @Get(':id/with-doses')
  getPatientWithDoses(@Param('id') id: string) {
    return this.appliedDosesService.findPatientWithDoses(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.appliedDosesService.remove(id);
  }
}
