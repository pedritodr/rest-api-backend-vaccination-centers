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
    // Convierte a booleano si viene en string 'true'/'false'
    let active: boolean | undefined = undefined;
    if (isActive === 'true') active = true;
    else if (isActive === 'false') active = false;

    return this.appliedDosesService.findAll(active);
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

  @Patch('cancel/:id')
  async cancelDose(@Param('id') id: string) {
    return this.appliedDosesService.cancelDose(id);
  }
}
