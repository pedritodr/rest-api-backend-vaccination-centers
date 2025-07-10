import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { AppliedDose } from 'src/applied-doses/entities/applied-dose.entity';
import { VaccineBatch } from 'src/vaccine-batches/entities/vaccine-batch.entity';
import { Patient } from 'src/patients/entities/patient.entity';
import { ReportDosesAppliedDto } from './dto/report-doses-applied.dto';
import { ReportExpiringBatchesDto } from './dto/report-expiring-batches.dto';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(AppliedDose)
    private readonly appliedDoseRepository: Repository<AppliedDose>,
    @InjectRepository(VaccineBatch)
    private readonly vaccineBatchRepository: Repository<VaccineBatch>,
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,
  ) {}

  // 1. Dosis aplicadas/anuladas con filtros y paginación
  async getDosesReport(dto: ReportDosesAppliedDto, active?: boolean) {
    const where: any = {};
    if (dto.from && dto.to) {
      where.applicationDateTime = Between(new Date(dto.from), new Date(dto.to));
    }
    if (dto.centerId) where.vaccinationCenter = { id: dto.centerId };
    if (dto.userId) where.applyingUser = { id: dto.userId };
    if (dto.isActive !== undefined) where.isActive = dto.isActive === 'true';
    if (active !== undefined) where.isActive = active;

    // Pagination
    const page = dto.page ? parseInt(dto.page) : 1;
    const limit = dto.limit ? parseInt(dto.limit) : 25;
    const [items, total] = await this.appliedDoseRepository.findAndCount({
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
      order: { applicationDateTime: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { total, page, limit, items };
  }

  // 2. Disponibilidad de lotes de vacunas
  async getVaccineBatchAvailability() {
    return this.vaccineBatchRepository.find({
      where: { isActive: true },
      relations: [
        'vaccine',
        'vaccine.manufacturer',
        'vaccine.manufacturer.country',
      ],
      order: { expirationDate: 'ASC' },
    });
  }

  // 3. Pacientes con vacunación incompleta
  async getPatientsWithIncompleteVaccination() {
    const patients = await this.patientRepository.find();
    const results = [];
    for (const patient of patients) {
      const appliedDoses = await this.appliedDoseRepository.find({
        where: { patient: { id: patient.id }, isActive: true },
        relations: ['vaccineBatch', 'vaccineBatch.vaccine'],
      });
      const dosesByVaccine: { [vaccineId: string]: any[] } = {};
      appliedDoses.forEach((dose) => {
        const vid = dose.vaccineBatch.vaccine.id;
        if (!dosesByVaccine[vid]) dosesByVaccine[vid] = [];
        dosesByVaccine[vid].push(dose);
      });
      for (const [vaccineId, doses] of Object.entries(dosesByVaccine)) {
        const requiredDoses = doses[0].vaccineBatch.vaccine.requiredDoses;
        if (doses.length < requiredDoses) {
          results.push({
            patient,
            vaccine: doses[0].vaccineBatch.vaccine,
            dosesApplied: doses.length,
            requiredDoses,
          });
        }
      }
    }
    return results;
  }

  // 4. Vacunas próximas a vencer
  async getExpiringBatches(dto: ReportExpiringBatchesDto) {
    const now = new Date();
    const end = new Date();
    end.setDate(now.getDate() + (dto.days || 14));

    return this.vaccineBatchRepository.find({
      where: {
        expirationDate: Between(now, end),
      },
      relations: [
        'vaccine',
        'vaccine.manufacturer',
        'vaccine.manufacturer.country',
      ],
      order: { expirationDate: 'ASC' },
    });
  }

  // 5. Pacientes por representante
  async getPatientsByRepresentative(representativeId: string) {
    const representative = await this.patientRepository.findOne({
      where: { id: representativeId },
      relations: ['dependents'],
    });
    if (!representative)
      throw new NotFoundException('Representative not found');
    return representative;
  }
}
