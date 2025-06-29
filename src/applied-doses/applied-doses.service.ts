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
    // 1. Buscar entidades relacionadas y validar existencia
    const patient = await this.patientRepository.findOne({
      where: { id: createAppliedDoseDto.patientId },
    });
    if (!patient) throw new BadRequestException('Patient not found');

    const vaccineBatch = await this.vaccineBatchRepository.findOne({
      where: { id: createAppliedDoseDto.vaccineBatchId },
      relations: ['vaccine'],
    });
    if (!vaccineBatch) throw new BadRequestException('Vaccine batch not found');

    const vaccine = vaccineBatch.vaccine;
    if (!vaccine) throw new BadRequestException('Vaccine not found in batch');

    const vaccinationCenter = await this.vaccinationCenterRepository.findOne({
      where: { id: createAppliedDoseDto.vaccinationCenterId },
    });
    if (!vaccinationCenter)
      throw new BadRequestException('Vaccination center not found');

    const applyingUser = await this.userRepository.findOne({
      where: { id: createAppliedDoseDto.applyingUserId },
    });
    if (!applyingUser) throw new BadRequestException('User not found');

    // 2. Validar cantidad de dosis máxima (requiredDoses)
    const appliedDosesCount = await this.appliedDoseRepository.count({
      where: {
        patient: { id: patient.id },
        vaccineBatch: { vaccine: { id: vaccine.id } },
        isActive: true,
      },
      relations: ['vaccineBatch', 'vaccineBatch.vaccine'],
    });
    if (appliedDosesCount >= vaccine.requiredDoses) {
      throw new BadRequestException(
        `El paciente ya ha recibido todas las dosis requeridas para esta vacuna (${vaccine.requiredDoses}).`,
      );
    }

    // 3. Validar intervalo entre dosis (doseIntervalDays), solo si ya hay al menos una dosis previa
    if (appliedDosesCount > 0) {
      // Obtener la última dosis aplicada de esa vacuna para el paciente
      const lastDose = await this.appliedDoseRepository.findOne({
        where: {
          patient: { id: patient.id },
          vaccineBatch: { vaccine: { id: vaccine.id } },
          isActive: true,
        },
        relations: ['vaccineBatch', 'vaccineBatch.vaccine'],
        order: { applicationDateTime: 'DESC' },
      });
      if (lastDose) {
        const lastDate = new Date(lastDose.applicationDateTime);
        const now = new Date();
        const daysDiff = Math.floor(
          (now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24),
        );
        if (daysDiff < vaccine.doseIntervalDays) {
          throw new BadRequestException(
            `Deben pasar al menos ${
              vaccine.doseIntervalDays
            } días entre dosis. Faltan ${
              vaccine.doseIntervalDays - daysDiff
            } días.`,
          );
        }
      }
    }

    // 4. Validar que la vacuna no esté vencida (expirationDate)
    const today = new Date();
    if (vaccineBatch.expirationDate < today) {
      throw new BadRequestException('El lote de vacuna está vencido');
    }

    // 5. Validar disponibilidad de dosis en el lote
    if (vaccineBatch.availableQuantity <= 0) {
      throw new BadRequestException('No hay dosis disponibles en este lote');
    }

    // 6. Crear y guardar la nueva dosis aplicada
    const appliedDose = this.appliedDoseRepository.create({
      ...createAppliedDoseDto,
      patient,
      vaccineBatch,
      vaccinationCenter,
      applyingUser,
      applicationDateTime: today,
    });

    // 7. Guardar y actualizar el lote de vacunas (disminuir cantidad disponible)
    const savedAppliedDose = await this.appliedDoseRepository.save(appliedDose);
    await this.vaccineBatchRepository.update(vaccineBatch.id, {
      availableQuantity: vaccineBatch.availableQuantity - 1,
    });

    return savedAppliedDose;
  }
  async cancelDose(appliedDoseId: string) {
    // 1. Buscar la dosis aplicada
    const appliedDose = await this.appliedDoseRepository.findOne({
      where: { id: appliedDoseId },
      relations: ['vaccineBatch'],
    });

    if (!appliedDose) {
      throw new NotFoundException('Applied dose not found');
    }

    // 2. Validar que la dosis no esté ya anulada
    if (appliedDose.isActive === false) {
      throw new BadRequestException('Esta dosis ya está anulada');
    }

    // 3. Sumar nuevamente la dosis a availableQuantity
    const vaccineBatch = appliedDose.vaccineBatch;
    if (!vaccineBatch) {
      throw new NotFoundException('Vaccine batch not found for this dose');
    }

    await this.vaccineBatchRepository.update(vaccineBatch.id, {
      availableQuantity: vaccineBatch.availableQuantity + 1,
    });

    // 4. Anular la dosis aplicada (cambiar isActive a false)
    await this.appliedDoseRepository.update(appliedDoseId, { isActive: false });

    return { message: 'Dosis aplicada anulada correctamente' };
  }

  findAll(isActive?: boolean) {
    const where: any = {};
    if (typeof isActive === 'boolean') {
      where.isActive = isActive;
    }

    return this.appliedDoseRepository.find({
      where,
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
