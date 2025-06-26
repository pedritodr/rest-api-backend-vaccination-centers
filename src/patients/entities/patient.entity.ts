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

  @Column({ unique: true, nullable: true })
  identityDocument: string;

  @Column({ nullable: false })
  firstName: string;

  @Column({ nullable: false })
  lastname: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  mobilePhone: string;

  @Column({ nullable: false })
  dateOfBirth: Date;

  // Asociación a otro paciente (representante)
  @ManyToOne(() => Patient, (patient) => patient.dependents, {
    nullable: true,
    eager: false,
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
