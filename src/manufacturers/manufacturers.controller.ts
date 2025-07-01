import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ManufacturersService } from './manufacturers.service';
import { CreateManufacturerDto } from './dto/create-manufacturer.dto';
import { UpdateManufacturerDto } from './dto/update-manufacturer.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UUIDManufacturer } from './dto/params-UUID.dto';
@ApiBearerAuth()
@ApiTags('Manufacturers')
@Controller('manufacturers')
export class ManufacturersController {
  constructor(private readonly manufacturersService: ManufacturersService) {}

  @Post()
  create(@Body() createManufacturerDto: CreateManufacturerDto) {
    return this.manufacturersService.create(createManufacturerDto);
  }

  @Get()
  findAll() {
    return this.manufacturersService.findAll();
  }

  @Get(':id')
  findOne(@Param() { id }: UUIDManufacturer) {
    return this.manufacturersService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param() { id }: UUIDManufacturer,
    @Body() updateManufacturerDto: UpdateManufacturerDto,
  ) {
    return this.manufacturersService.update(id, updateManufacturerDto);
  }

  @Delete(':id')
  remove(@Param() { id }: UUIDManufacturer) {
    return this.manufacturersService.remove(id);
  }
}
