import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient } from './entities/patient.entity';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,
  ) {}

  async create(createPatientDto: CreatePatientDto) {
    let representative: Patient = null;
    if (createPatientDto.representativeId) {
      representative = await this.patientRepository.findOne({
        where: { id: createPatientDto.representativeId },
      });
      if (!representative) {
        throw new BadRequestException('Representative not found');
      }
    }

    const patient = this.patientRepository.create({
      ...createPatientDto,
      representative,
      representativeId: createPatientDto.representativeId,
    });

    return await this.patientRepository.save(patient);
  }

  findAll() {
    return this.patientRepository.find({
      relations: ['representative', 'dependents'],
    });
  }

  async findOne(id: string) {
    const patient = await this.patientRepository.findOne({
      where: { id },
      relations: ['representative', 'dependents'],
    });
    if (!patient) {
      throw new NotFoundException('Patient not found');
    }
    return patient;
  }

  async update(id: string, updatePatientDto: UpdatePatientDto) {
    const patient = await this.patientRepository.findOne({ where: { id } });
    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    let representative: Patient = patient.representative;
    if ('representativeId' in updatePatientDto) {
      if (updatePatientDto.representativeId) {
        representative = await this.patientRepository.findOne({
          where: { id: updatePatientDto.representativeId },
        });
        if (!representative) {
          throw new BadRequestException('Representative not found');
        }
      } else {
        representative = null;
      }
    }

    Object.assign(patient, updatePatientDto, { representative });
    return await this.patientRepository.save(patient);
  }

  async remove(id: string) {
    const patient = await this.patientRepository.findOne({ where: { id } });
    if (!patient) {
      throw new NotFoundException('Patient not found');
    }
    await this.patientRepository.softDelete(id);
    return { message: 'Patient deleted' };
  }
}
