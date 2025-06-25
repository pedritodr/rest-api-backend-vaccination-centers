import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { Patient } from './entities/patient.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,
  ) {}
  create(createPatientDto: CreatePatientDto) {
    return this.patientRepository.save(createPatientDto);
  }

  findAll() {
    return this.patientRepository.find({ where: { isActive: true } });
  }

  findOne(id: string) {
    return this.patientRepository.findOne({
      where: { id, isActive: true },
    });
  }

  async update(id: string, updatePatientDto: UpdatePatientDto) {
    const patient = await this.findOne(id);
    if (!patient) {
      throw new UnauthorizedException('id is wrong');
    }
    return await this.patientRepository.update(id, { ...updatePatientDto });
  }

  async remove(id: string) {
    const patient = await this.findOne(id);
    if (!patient) {
      throw new UnauthorizedException('id is wrong');
    }
    return await this.patientRepository.update(id, { isActive: false });
  }
}
