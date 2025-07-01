import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CountriesService } from './countries.service';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UUIDCountry } from './dto/params-UUID.dto';
@ApiBearerAuth()
@ApiTags('Countries')
@Controller('countries')
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  @Post()
  create(@Body() createCountryDto: CreateCountryDto) {
    return this.countriesService.create(createCountryDto);
  }

  @Get()
  findAll() {
    return this.countriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') { id }: UUIDCountry) {
    return this.countriesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') { id }: UUIDCountry,
    @Body() updateCountryDto: UpdateCountryDto,
  ) {
    return this.countriesService.update(id, updateCountryDto);
  }

  @Delete(':id')
  remove(@Param('id') { id }: UUIDCountry) {
    return this.countriesService.remove(id);
  }
}
