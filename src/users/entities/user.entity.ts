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
import { Role } from '../../common/enums/rol.enum';
import { VaccinationCenter } from 'src/vaccination-centers/entities/vaccination-center.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  lastname: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ nullable: false, select: false })
  password: string;

  @Column({ type: 'enum', default: Role.USER, enum: Role })
  role: Role;

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

  @Column({ nullable: true })
  urlAvatar: string;

  @Column({ default: true })
  isActive: boolean;

  // Relación opcional con VaccinationCenter
  @ManyToOne(() => VaccinationCenter, { nullable: true, eager: true })
  @JoinColumn({ name: 'vaccinationCenterId' })
  vaccinationCenter?: VaccinationCenter;

  @Column({ nullable: true })
  vaccinationCenterId?: string; // Almacena el id del centro (puede ser null)
}
