import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

@Entity()
export class Patient {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, nullable: true }) // Ahora puede ser null para niños
  identityDocument: string;

  @Column({ nullable: false })
  firstName: string;

  @Column({ nullable: false })
  lastName: string; // Corregido: 'LastName' → 'lastName' (por convención)

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ nullable: false })
  address: string;

  @Column({ nullable: false })
  mobilePhone: string;

  @Column({ nullable: false })
  dateOfBirth: Date;

  // Asociación a otro paciente (representante)
  @ManyToOne(() => Patient, (patient) => patient.dependents, {
    nullable: true,
    eager: true,
  })
  @JoinColumn({ name: 'representativeId' })
  representative?: Patient;

  @Column({ nullable: true })
  representativeId?: string;

  // Relación inversa: un representante puede tener varios niños a cargo
  @OneToMany(() => Patient, (patient) => patient.representative)
  dependents: Patient[];

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
}
