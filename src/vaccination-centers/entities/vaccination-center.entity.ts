import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
@Entity()
export class VaccinationCenter {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  centerName: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: false })
  address: string;

  @Column({ nullable: true })
  phone: string;
  @Column({ nullable: true })
  mobilePhone: string;

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

  @OneToMany(() => User, (user) => user.vaccinationCenter)
  users: User[];
}
