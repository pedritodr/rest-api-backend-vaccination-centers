import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { VaccineBatchesService } from './vaccine-batches.service';
import { CreateVaccineBatchDto } from './dto/create-vaccine-batch.dto';
import { UpdateVaccineBatchDto } from './dto/update-vaccine-batch.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  UUIDVaccineBatches,
  VaccineBatchesStatus,
} from './dto/params-UUID.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { Role } from '../common/enums/rol.enum';
@ApiBearerAuth()
@ApiTags('Vaccine batches')
@Controller('vaccine-batches')
export class VaccineBatchesController {
  constructor(private readonly vaccineBatchesService: VaccineBatchesService) {}

  @Post()
  create(@Body() createVaccineBatchDto: CreateVaccineBatchDto) {
    return this.vaccineBatchesService.create(createVaccineBatchDto);
  }

  @Get()
  findAll() {
    return this.vaccineBatchesService.findAll();
  }

  @Get(':id')
  findOne(@Param() { id }: UUIDVaccineBatches) {
    return this.vaccineBatchesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param() { id }: UUIDVaccineBatches,
    @Body() updateVaccineBatchDto: UpdateVaccineBatchDto,
  ) {
    return this.vaccineBatchesService.update(id, updateVaccineBatchDto);
  }

  @Delete(':id')
  remove(@Param() { id }: UUIDVaccineBatches) {
    return this.vaccineBatchesService.remove(id);
  }
  @Auth(Role.ADMIN)
  @Patch(':id/status/:status')
  async updateStatus(@Param() { id, status }: VaccineBatchesStatus) {
    return this.vaccineBatchesService.updateStatus(id, status);
  }
}
