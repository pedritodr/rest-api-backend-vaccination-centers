import { Module } from '@nestjs/common';
import { VaccinationCentersService } from './vaccination-centers.service';
import { VaccinationCentersController } from './vaccination-centers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VaccinationCenter } from './entities/vaccination-center.entity';
import { Country } from 'src/countries/entities/country.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([VaccinationCenter, Country, User])],
  controllers: [VaccinationCentersController],
  providers: [VaccinationCentersService],
})
export class VaccinationCentersModule {}
