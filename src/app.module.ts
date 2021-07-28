import { Module } from '@nestjs/common';
import { PatientsModule } from './patients/patients.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [PatientsModule, DatabaseModule, ConfigModule.forRoot()],
  exports: [ConfigModule],
})
export class AppModule {}
