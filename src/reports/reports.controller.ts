import { Controller, Get, Query, Param } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportDosesAppliedDto } from './dto/report-doses-applied.dto';
import { ReportExpiringBatchesDto } from './dto/report-expiring-batches.dto';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  // 1. Dosis aplicadas (activas)
  @Get('doses-applied')
  async dosesAppliedReport(@Query() query: ReportDosesAppliedDto) {
    return this.reportsService.getDosesReport(query, true);
  }

  // 2. Dosis anuladas (inactivas)
  @Get('doses-cancelled')
  async dosesCancelledReport(@Query() query: ReportDosesAppliedDto) {
    return this.reportsService.getDosesReport(query, false);
  }

  // 3. Disponibilidad de lotes de vacunas
  @Get('vaccine-batch-availability')
  async vaccineBatchAvailability() {
    return this.reportsService.getVaccineBatchAvailability();
  }

  // 4. Pacientes con vacunación incompleta
  @Get('patients-incomplete')
  async patientsWithIncomplete() {
    return this.reportsService.getPatientsWithIncompleteVaccination();
  }

  // 5. Vacunas próximas a vencer
  @Get('expiring-batches')
  async expiringBatches(@Query() query: ReportExpiringBatchesDto) {
    return this.reportsService.getExpiringBatches(query);
  }

  // 6. Pacientes por representante
  @Get('representative/:representativeId')
  async patientsByRepresentative(
    @Param('representativeId') representativeId: string,
  ) {
    return this.reportsService.getPatientsByRepresentative(representativeId);
  }
}
