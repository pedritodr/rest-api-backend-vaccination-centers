import { Patient } from 'src/patients/entities/patient.entity';
import { User } from 'src/users/entities/user.entity';
import { VaccinationCenter } from 'src/vaccination-centers/entities/vaccination-center.entity';
import { VaccineBatch } from 'src/vaccine-batches/entities/vaccine-batch.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class AppliedDose {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  doseNumber: number;

  @Column({ nullable: true })
  observations: string;

  @DeleteDateColumn({ select: false })
  deletedAt: Date;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  applicationDateTime: Date;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updatedAt: Date;

  @Column({ default: true })
  isActive: boolean;

  // Relación con Patient
  @ManyToOne(() => Patient, { nullable: false }) // <-- ¡Sin eager!
  @JoinColumn({ name: 'patientId' })
  patient: Patient;

  @Column()
  patientId: string;

  // Relación con VaccineBatch
  @ManyToOne(() => VaccineBatch, { nullable: false })
  @JoinColumn({ name: 'vaccineBatchId' })
  vaccineBatch: VaccineBatch;

  @Column()
  vaccineBatchId: string;

  // Relación con VaccinationCenter
  @ManyToOne(() => VaccinationCenter, { nullable: false })
  @JoinColumn({ name: 'vaccinationCenterId' })
  vaccinationCenter: VaccinationCenter;

  @Column()
  vaccinationCenterId: string;

  // Relación con User (quién aplicó la dosis)
  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'applyingUserId' })
  applyingUser: User;

  @Column()
  applyingUserId: string;
}
