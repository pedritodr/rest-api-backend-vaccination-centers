import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vaccine } from './entities/vaccine.entity';
import { Manufacturer } from 'src/manufacturers/entities/manufacturer.entity';
import { CreateVaccineDto } from './dto/create-vaccine.dto';
import { UpdateVaccineDto } from './dto/update-vaccine.dto';

@Injectable()
export class VaccinesService {
  constructor(
    @InjectRepository(Vaccine)
    private readonly vaccineRepository: Repository<Vaccine>,
    @InjectRepository(Manufacturer)
    private readonly manufacturerRepository: Repository<Manufacturer>,
  ) {}

  async create(createVaccineDto: CreateVaccineDto) {
    const manufacturer = await this.manufacturerRepository.findOne({
      where: { id: createVaccineDto.manufacturerId },
    });
    if (!manufacturer) {
      throw new BadRequestException('Manufacturer not found');
    }

    const vaccine = this.vaccineRepository.create({
      ...createVaccineDto,
      manufacturer,
    });
    return await this.vaccineRepository.save(vaccine);
  }

  findAll() {
    return this.vaccineRepository.find({
      where: { isActive: true },
      relations: ['manufacturer'],
    });
  }

  async findOne(id: string) {
    const vaccine = await this.vaccineRepository.findOne({
      where: { id, isActive: true },
      relations: ['manufacturer'],
    });
    if (!vaccine) {
      throw new NotFoundException('Vaccine not found');
    }
    return vaccine;
  }

  async update(id: string, updateVaccineDto: UpdateVaccineDto) {
    const vaccine = await this.vaccineRepository.findOne({ where: { id } });
    if (!vaccine) {
      throw new NotFoundException('Vaccine not found');
    }

    let manufacturer: Manufacturer = vaccine.manufacturer;
    if (updateVaccineDto.manufacturerId) {
      manufacturer = await this.manufacturerRepository.findOne({
        where: { id: updateVaccineDto.manufacturerId },
      });
      if (!manufacturer) {
        throw new BadRequestException('Manufacturer not found');
      }
    }

    Object.assign(vaccine, updateVaccineDto, { manufacturer });
    return await this.vaccineRepository.save(vaccine);
  }

  async remove(id: string) {
    const vaccine = await this.vaccineRepository.findOne({ where: { id } });
    if (!vaccine) {
      throw new NotFoundException('Vaccine not found');
    }
    return await this.vaccineRepository.update(id, {
      isActive: false,
    });
  }
}
