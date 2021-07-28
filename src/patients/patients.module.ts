import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GoogleModule } from 'src/google/google.module';
import { PatientRepository } from './patient.repository';
import { PatientsController } from './patients.controller';
import { PatientsService } from './patients.service';

@Module({
  imports: [TypeOrmModule.forFeature([PatientRepository]), GoogleModule],
  controllers: [PatientsController],
  providers: [PatientsService],
})
export class PatientsModule {}
