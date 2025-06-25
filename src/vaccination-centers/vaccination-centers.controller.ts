import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { VaccinationCentersService } from './vaccination-centers.service';
import { CreateVaccinationCenterDto } from './dto/create-vaccination-center.dto';
import { UpdateVaccinationCenterDto } from './dto/update-vaccination-center.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
@ApiBearerAuth()
@ApiTags('Vaccination Centers')
@Controller('vaccination-centers')
export class VaccinationCentersController {
  constructor(
    private readonly vaccinationCentersService: VaccinationCentersService,
  ) {}

  @Post()
  create(@Body() createVaccinationCenterDto: CreateVaccinationCenterDto) {
    return this.vaccinationCentersService.create(createVaccinationCenterDto);
  }

  @Get()
  findAll() {
    return this.vaccinationCentersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vaccinationCentersService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateVaccinationCenterDto: UpdateVaccinationCenterDto,
  ) {
    return this.vaccinationCentersService.update(
      id,
      updateVaccinationCenterDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vaccinationCentersService.remove(id);
  }
}
