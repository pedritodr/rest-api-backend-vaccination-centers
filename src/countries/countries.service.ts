import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';
import { Country } from './entities/country.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CountriesService {
  constructor(
    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,
  ) {}

  create(createCountryDto: CreateCountryDto) {
    return this.countryRepository.save(createCountryDto);
  }

  findAll() {
    return this.countryRepository.find({ where: { isActive: true } });
  }

  async findOne(id: string) {
    const country = await this.countryRepository.findOne({
      where: { id, isActive: true },
    });
    if (!country) {
      throw new UnauthorizedException('id is wrong');
    }
    return country;
  }

  async update(id: string, updateCountryDto: UpdateCountryDto) {
    const country = await this.findOne(id);
    if (!country) {
      throw new UnauthorizedException('id is wrong');
    }
    return await this.countryRepository.update(id, { ...updateCountryDto });
  }

  async remove(id: string) {
    const country = await this.findOne(id);
    if (!country) {
      throw new UnauthorizedException('id is wrong');
    }

    return await this.countryRepository.update(id, { isActive: false });
  }
}
