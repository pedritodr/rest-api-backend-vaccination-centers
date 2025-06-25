import { Module } from '@nestjs/common';
import { CountriesService } from './countries.service';
import { CountriesController } from './countries.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Country } from './entities/country.entity';
import { Manufacturer } from 'src/manufacturers/entities/manufacturer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Country, Manufacturer])],
  controllers: [CountriesController],
  providers: [CountriesService],
})
export class CountriesModule {}
