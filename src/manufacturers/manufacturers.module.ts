import { Module } from '@nestjs/common';
import { ManufacturersService } from './manufacturers.service';
import { ManufacturersController } from './manufacturers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Manufacturer } from './entities/manufacturer.entity';
import { Country } from '../countries/entities/country.entity';
import { Vaccine } from '../vaccines/entities/vaccine.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Manufacturer, Country, Vaccine])],
  controllers: [ManufacturersController],
  providers: [ManufacturersService],
})
export class ManufacturersModule {}
