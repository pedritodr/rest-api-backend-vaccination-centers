import { Manufacturer } from 'src/manufacturers/entities/manufacturer.entity';
import {
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  DeleteDateColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
} from 'typeorm';

@Entity()
export class Vaccine {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  VaccineName: string;

  @Column({ nullable: false })
  requiredDoses: number;

  @Column({ nullable: false })
  doseIntervalDays: number;

  @Column({ nullable: false })
  storageTemperature: string;

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

  @ManyToOne(() => Manufacturer, { eager: true, nullable: false })
  @JoinColumn({ name: 'manufacturerId' })
  manufacturer: Manufacturer;

  @Column()
  manufacturerId: string;
}
