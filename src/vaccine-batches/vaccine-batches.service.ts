import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VaccineBatch } from './entities/vaccine-batch.entity';
import { Vaccine } from 'src/vaccines/entities/vaccine.entity';
import { CreateVaccineBatchDto } from './dto/create-vaccine-batch.dto';
import { UpdateVaccineBatchDto } from './dto/update-vaccine-batch.dto';

@Injectable()
export class VaccineBatchesService {
  constructor(
    @InjectRepository(VaccineBatch)
    private readonly vaccineBatchRepository: Repository<VaccineBatch>,
    @InjectRepository(Vaccine)
    private readonly vaccineRepository: Repository<Vaccine>,
  ) {}

  async create(createVaccineBatchDto: CreateVaccineBatchDto) {
    const vaccine = await this.vaccineRepository.findOne({
      where: { id: createVaccineBatchDto.vaccineId },
    });
    if (!vaccine) {
      throw new BadRequestException('Vaccine not found');
    }

    const vaccineBatch = this.vaccineBatchRepository.create({
      ...createVaccineBatchDto,
      vaccine,
    });

    return await this.vaccineBatchRepository.save(vaccineBatch);
  }

  findAll() {
    return this.vaccineBatchRepository.find({
      relations: ['vaccine'],
    });
  }

  async findOne(id: string) {
    const batch = await this.vaccineBatchRepository.findOne({
      where: { id },
      relations: ['vaccine'],
    });
    if (!batch) {
      throw new NotFoundException('Vaccine batch not found');
    }
    return batch;
  }

  async update(id: string, updateVaccineBatchDto: UpdateVaccineBatchDto) {
    const batch = await this.vaccineBatchRepository.findOne({ where: { id } });
    if (!batch) {
      throw new NotFoundException('Vaccine batch not found');
    }

    let vaccine: Vaccine = batch.vaccine;
    if (updateVaccineBatchDto.vaccineId) {
      vaccine = await this.vaccineRepository.findOne({
        where: { id: updateVaccineBatchDto.vaccineId },
      });
      if (!vaccine) {
        throw new BadRequestException('Vaccine not found');
      }
    }

    Object.assign(batch, updateVaccineBatchDto, { vaccine });
    return await this.vaccineBatchRepository.save(batch);
  }

  async remove(id: string) {
    const batch = await this.vaccineBatchRepository.findOne({ where: { id } });
    if (!batch) {
      throw new NotFoundException('Vaccine batch not found');
    }
    await this.vaccineBatchRepository.softDelete(id);
    return { message: 'Vaccine batch deleted' };
  }
}
