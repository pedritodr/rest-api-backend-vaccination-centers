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
    const { isChild, identityDocument, representativeId } = createPatientDto;

    // Validación de cédulas
    if (isChild) {
      if (!representativeId) {
        throw new BadRequestException(
          'El representante es requerido para menores',
        );
      }
      if (!identityDocument) {
        throw new BadRequestException(
          'La cédula del representante es requerida para menores',
        );
      }
    } else {
      if (!identityDocument) {
        throw new BadRequestException('La cédula del paciente es requerida');
      }
    }

    let representative: Patient = null;
    if (representativeId) {
      representative = await this.patientRepository.findOne({
        where: { id: representativeId },
      });
      if (!representative) {
        throw new BadRequestException('El representante no existe');
      }
    }

    const patient = this.patientRepository.create({
      ...createPatientDto,
      representative, // Se asigna el objeto, TypeORM gestiona el id
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

  async findByIdentityDocument(id: string) {
    const patient = await this.patientRepository.findOne({
      where: { identityDocument: id },
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
        if (updatePatientDto.representativeId === id) {
          throw new BadRequestException(
            'A patient cannot be their own representative',
          );
        }
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

    // Prepara los datos a actualizar
    const updateData = {
      ...updatePatientDto,
      representative, // Esto actualiza la relación
    };

    // Evita incluir representativeId directamente para no sobrescribir la FK manualmente
    delete updateData.representativeId;

    Object.assign(patient, updateData);

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
