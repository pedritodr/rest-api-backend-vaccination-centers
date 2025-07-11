import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { VaccinesService } from './vaccines.service';
import { CreateVaccineDto } from './dto/create-vaccine.dto';
import { UpdateVaccineDto } from './dto/update-vaccine.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UUIDVaccine } from './dto/params-UUID.dto';
@ApiBearerAuth()
@ApiTags('Vaccines')
@Controller('vaccines')
export class VaccinesController {
  constructor(private readonly vaccinesService: VaccinesService) {}

  @Post()
  create(@Body() createVaccineDto: CreateVaccineDto) {
    return this.vaccinesService.create(createVaccineDto);
  }

  @Get()
  findAll() {
    return this.vaccinesService.findAll();
  }

  @Get(':id')
  findOne(@Param() { id }: UUIDVaccine) {
    return this.vaccinesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param() { id }: UUIDVaccine,
    @Body() updateVaccineDto: UpdateVaccineDto,
  ) {
    return this.vaccinesService.update(id, updateVaccineDto);
  }

  @Delete(':id')
  remove(@Param() { id }: UUIDVaccine) {
    return this.vaccinesService.remove(id);
  }
}
