import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppliedDose } from './entities/applied-dose.entity';
import { Patient } from 'src/patients/entities/patient.entity';
import { VaccineBatch } from 'src/vaccine-batches/entities/vaccine-batch.entity';
import { VaccinationCenter } from 'src/vaccination-centers/entities/vaccination-center.entity';
import { User } from 'src/users/entities/user.entity';
import { CreateAppliedDoseDto } from './dto/create-applied-dose.dto';
import { UpdateAppliedDoseDto } from './dto/update-applied-dose.dto';

@Injectable()
export class AppliedDosesService {
  constructor(
    @InjectRepository(AppliedDose)
    private readonly appliedDoseRepository: Repository<AppliedDose>,
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,
    @InjectRepository(VaccineBatch)
    private readonly vaccineBatchRepository: Repository<VaccineBatch>,
    @InjectRepository(VaccinationCenter)
    private readonly vaccinationCenterRepository: Repository<VaccinationCenter>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createAppliedDoseDto: CreateAppliedDoseDto) {
    const patient = await this.patientRepository.findOne({
      where: { id: createAppliedDoseDto.patientId },
    });
    if (!patient) throw new BadRequestException('Patient not found');

    const vaccineBatch = await this.vaccineBatchRepository.findOne({
      where: { id: createAppliedDoseDto.vaccineBatchId },
    });
    if (!vaccineBatch) throw new BadRequestException('Vaccine batch not found');

    const vaccinationCenter = await this.vaccinationCenterRepository.findOne({
      where: { id: createAppliedDoseDto.vaccinationCenterId },
    });
    if (!vaccinationCenter)
      throw new BadRequestException('Vaccination center not found');

    const applyingUser = await this.userRepository.findOne({
      where: { id: createAppliedDoseDto.applyingUserId },
    });
    if (!applyingUser) throw new BadRequestException('User not found');

    const appliedDose = this.appliedDoseRepository.create({
      ...createAppliedDoseDto,
      patient,
      vaccineBatch,
      vaccinationCenter,
      applyingUser,
    });

    return await this.appliedDoseRepository.save(appliedDose);
  }

  findAll() {
    return this.appliedDoseRepository.find({
      relations: [
        'patient',
        'patient.representative',
        'vaccineBatch',
        'vaccineBatch.vaccine',
        'vaccineBatch.vaccine.manufacturer',
        'vaccineBatch.vaccine.manufacturer.country',
        'vaccinationCenter',
        'applyingUser',
      ],
    });
  }

  async findOne(id: string) {
    const appliedDose = await this.appliedDoseRepository.findOne({
      where: { id },
      relations: [
        'patient',
        'patient.representative',
        'vaccineBatch',
        'vaccineBatch.vaccine',
        'vaccineBatch.vaccine.manufacturer',
        'vaccineBatch.vaccine.manufacturer.country',
        'vaccinationCenter',
        'applyingUser',
      ],
    });
    if (!appliedDose) throw new NotFoundException('Applied dose not found');
    return appliedDose;
  }

  async update(id: string, updateAppliedDoseDto: UpdateAppliedDoseDto) {
    const appliedDose = await this.appliedDoseRepository.findOne({
      where: { id },
    });
    if (!appliedDose) throw new NotFoundException('Applied dose not found');

    // Actualizar relaciones si cambian
    let patient = appliedDose.patient;
    if (updateAppliedDoseDto.patientId) {
      patient = await this.patientRepository.findOne({
        where: { id: updateAppliedDoseDto.patientId },
      });
      if (!patient) throw new BadRequestException('Patient not found');
    }

    let vaccineBatch = appliedDose.vaccineBatch;
    if (updateAppliedDoseDto.vaccineBatchId) {
      vaccineBatch = await this.vaccineBatchRepository.findOne({
        where: { id: updateAppliedDoseDto.vaccineBatchId },
      });
      if (!vaccineBatch)
        throw new BadRequestException('Vaccine batch not found');
    }

    let vaccinationCenter = appliedDose.vaccinationCenter;
    if (updateAppliedDoseDto.vaccinationCenterId) {
      vaccinationCenter = await this.vaccinationCenterRepository.findOne({
        where: { id: updateAppliedDoseDto.vaccinationCenterId },
      });
      if (!vaccinationCenter)
        throw new BadRequestException('Vaccination center not found');
    }

    let applyingUser = appliedDose.applyingUser;
    if (updateAppliedDoseDto.applyingUserId) {
      applyingUser = await this.userRepository.findOne({
        where: { id: updateAppliedDoseDto.applyingUserId },
      });
      if (!applyingUser) throw new BadRequestException('User not found');
    }

    Object.assign(appliedDose, updateAppliedDoseDto, {
      patient,
      vaccineBatch,
      vaccinationCenter,
      applyingUser,
    });

    return await this.appliedDoseRepository.save(appliedDose);
  }

  async remove(id: string) {
    const appliedDose = await this.appliedDoseRepository.findOne({
      where: { id },
    });
    if (!appliedDose) throw new NotFoundException('Applied dose not found');
    await this.appliedDoseRepository.softDelete(id);
    return { message: 'Applied dose deleted' };
  }

  async findPatientWithDoses(id: string) {
    const patient = await this.patientRepository.findOne({
      where: { identityDocument: id },
    });

    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    const doses = await this.appliedDoseRepository.find({
      where: { patient: { id: patient.id } },
      order: { applicationDateTime: 'ASC' },
      relations: [
        'vaccineBatch',
        'vaccineBatch.vaccine',
        'vaccinationCenter',
        'applyingUser',
      ],
    });

    return {
      ...patient,
      appliedDoses: doses,
    };
  }
}
