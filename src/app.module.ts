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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [EnvCofiguration],
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USERNAME,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE,
      autoLoadEntities: true,
      synchronize: true,
      ssl: process.env.POSTGRES_SSL === 'true',
      extra: {
        ssl:
          process.env.POSTGRES_SSL === 'true'
            ? {
                rejectUnauthorized: false,
              }
            : null,
      },
    }),
    UsersModule,
    AuthModule,
    FirebaseModule,
    CountriesModule,
    VaccinationCentersModule,
    PatientsModule,
    ManufacturersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
