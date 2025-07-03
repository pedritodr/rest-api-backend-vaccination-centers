import { BatchStatus } from '../../common/enums/batchStatus.enum';
import { Vaccine } from '../../vaccines/entities/vaccine.entity';
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
export class VaccineBatch {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  batchNumber: string;

  @Column({ nullable: false })
  manufactureDate: Date;

  @Column({ nullable: false })
  expirationDate: Date;

  @Column({ nullable: false })
  initialQuantity: number;
  @Column({ nullable: false })
  availableQuantity: number;

  @DeleteDateColumn({ select: false })
  deletedAt: Date;

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

  // Relación con Vaccine
  @ManyToOne(() => Vaccine, { eager: true, nullable: false })
  @JoinColumn({ name: 'vaccineId' })
  vaccine: Vaccine;

  @Column()
  vaccineId: string;

  @Column({ type: 'enum', enum: BatchStatus, default: BatchStatus.CREATED })
  status: BatchStatus;

  @Column({ type: 'timestamp', nullable: true })
  dateLoteOpen?: Date;

  @Column({ type: 'timestamp', nullable: true })
  dateLoteClose?: Date;
}
