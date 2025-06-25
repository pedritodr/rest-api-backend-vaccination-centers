import { Country } from 'src/countries/entities/country.entity';
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
export class Manufacturer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  manufacturerName: string;

  // Relación con Country
  @ManyToOne(() => Country, { eager: true, nullable: false })
  @JoinColumn({ name: 'countryId' })
  country: Country;

  @Column()
  countryId: string; // Este será el campo que guarda el id de Country

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
