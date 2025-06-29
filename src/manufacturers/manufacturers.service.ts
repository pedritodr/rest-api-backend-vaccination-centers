import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Manufacturer } from './entities/manufacturer.entity';
import { Country } from 'src/countries/entities/country.entity';
import { CreateManufacturerDto } from './dto/create-manufacturer.dto';
import { UpdateManufacturerDto } from './dto/update-manufacturer.dto';

@Injectable()
export class ManufacturersService {
  constructor(
    @InjectRepository(Manufacturer)
    private readonly manufacturerRepository: Repository<Manufacturer>,
    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,
  ) {}

  async create(createManufacturerDto: CreateManufacturerDto) {
    const country = await this.countryRepository.findOne({
      where: { id: createManufacturerDto.countryId },
    });
    if (!country) {
      throw new BadRequestException('Country not found');
    }

    const manufacturer = this.manufacturerRepository.create({
      ...createManufacturerDto,
      country,
    });
    return await this.manufacturerRepository.save(manufacturer);
  }

  findAll() {
    return this.manufacturerRepository.find({
      where: { isActive: true },
      relations: ['country'],
    });
  }

  async findOne(id: string) {
    const manufacturer = await this.manufacturerRepository.findOne({
      where: { id, isActive: true },
      relations: ['country'],
    });
    if (!manufacturer) {
      throw new NotFoundException('Manufacturer not found');
    }
    return manufacturer;
  }

  async update(id: string, updateManufacturerDto: UpdateManufacturerDto) {
    const manufacturer = await this.manufacturerRepository.findOne({
      where: { id },
    });
    if (!manufacturer) {
      throw new NotFoundException('Manufacturer not found');
    }

    // Si hay countryId en el update, busca el country
    let country: Country = manufacturer.country;
    if (updateManufacturerDto.countryId) {
      country = await this.countryRepository.findOne({
        where: { id: updateManufacturerDto.countryId },
      });
      if (!country) {
        throw new BadRequestException('Country not found');
      }
    }

    Object.assign(manufacturer, updateManufacturerDto, { country });
    return await this.manufacturerRepository.save(manufacturer);
  }

  async remove(id: string) {
    const manufacturer = await this.manufacturerRepository.findOne({
      where: { id },
    });
    if (!manufacturer) {
      throw new NotFoundException('Manufacturer not found');
    }

    return await this.manufacturerRepository.update(id, { isActive: false });
  }
}
