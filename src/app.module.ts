import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { FirebaseModule } from './firebase/firebase.module';
import { EnvCofiguration } from './config/env.config';
import { CountriesModule } from './countries/countries.module';
import { VaccinationCentersModule } from './vaccination-centers/vaccination-centers.module';
import { PatientsModule } from './patients/patients.module';
import { ManufacturersModule } from './manufacturers/manufacturers.module';
import { VaccinesModule } from './vaccines/vaccines.module';
import { VaccineBatchesModule } from './vaccine-batches/vaccine-batches.module';
import { AppliedDosesModule } from './applied-doses/applied-doses.module';
import { ReportsModule } from './reports/reports.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [EnvCofiguration],
    }),
    TypeOrmModule.forRoot({
          type: 'postgres',
          url: process.env.DATABASE_URL,
          autoLoadEntities: true,
          synchronize: true,
          ssl: {
            rejectUnauthorized: false,
          },
    }),
    UsersModule,
    AuthModule,
    FirebaseModule,
    CountriesModule,
    VaccinationCentersModule,
    PatientsModule,
    ManufacturersModule,
    VaccinesModule,
    VaccineBatchesModule,
    AppliedDosesModule,
    ReportsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
