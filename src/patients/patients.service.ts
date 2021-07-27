import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePatientDto } from './dto/CreatePatient.dto';
import { UpdatePatientDto } from './dto/UpdatePatient.dto';
import { PatientRepository } from './patient.repository';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(PatientRepository)
    private readonly patientRepository: PatientRepository,
  ) {}

  async getById(id: string) {
    const patient = await this.patientRepository.findOne(id);

    if (!patient) {
      throw new NotFoundException();
    }

    return patient;
  }

  async create(createPatientDto: CreatePatientDto) {
    const patient = this.patientRepository.create({ ...createPatientDto });
    await this.patientRepository.save(patient);
    return this.getById(patient.id);
  }

  async update(id: string, updatePatientDto: UpdatePatientDto) {
    const patient = await this.getById(id);
    await this.patientRepository.update(patient, { ...updatePatientDto });

    return this.getById(patient.id);
  }

  async delete(id: string) {
    const patient = await this.getById(id);
    return this.patientRepository.delete(patient);
  }
}
