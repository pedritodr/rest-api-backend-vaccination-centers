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
import { BatchStatus } from 'src/common/enums/batchStatus.enum';

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
      where: { isActive: true },
      order: { expirationDate: 'ASC' }, // Ordena por fecha de vencimiento ASC
      relations: [
        'vaccine',
        'vaccine.manufacturer',
        'vaccine.manufacturer.country',
      ],
    });
  }

  async findOne(id: string) {
    const batch = await this.vaccineBatchRepository.findOne({
      where: { id, isActive: true },
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
    return await this.vaccineBatchRepository.update(id, {
      isActive: false,
    });
  }

  async updateStatus(id: string, status: BatchStatus) {
    const batch = await this.vaccineBatchRepository.findOne({
      where: { id, isActive: true },
    });
    if (!batch) throw new NotFoundException('batch not found');

    const now = new Date();
    let update: any = { status };

    if (status === 1) {
      update.dateLoteOpen = now;
    }
    if (status === 2) {
      update.dateLoteClose = now;
    }

    await this.vaccineBatchRepository.update(id, update);

    return { message: 'status updated Successfully' };
  }
}
