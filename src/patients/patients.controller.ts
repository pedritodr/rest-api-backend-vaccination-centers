import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PatientsService } from './patients.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UUIDPatients } from './dto/params-UUID.dto';
@ApiBearerAuth()
@ApiTags('Patients')
@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Post()
  create(@Body() createPatientDto: CreatePatientDto) {
    return this.patientsService.create(createPatientDto);
  }

  @Get()
  findAll() {
    return this.patientsService.findAll();
  }

  @Get(':id')
  findOne(@Param() { id }: UUIDPatients) {
    return this.patientsService.findOne(id);
  }

  @Get(':id/identityDocument')
  findByIdentityDocument(@Param() { id }: UUIDPatients) {
    return this.patientsService.findByIdentityDocument(id);
  }

  @Patch(':id')
  update(
    @Param() { id }: UUIDPatients,
    @Body() updatePatientDto: UpdatePatientDto,
  ) {
    return this.patientsService.update(id, updatePatientDto);
  }

  @Delete(':id')
  remove(@Param() { id }: UUIDPatients) {
    return this.patientsService.remove(id);
  }
}
