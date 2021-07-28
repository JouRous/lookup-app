import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SharedFileDto } from 'src/google/dto/share-file.dto';
import { CreatePatientDto } from './dto/create-patient.dto';
import { PatientFilterDto } from './dto/patient-filter.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { PatientRepository } from './patient.repository';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(PatientRepository)
    private readonly patientRepository: PatientRepository,
  ) {}

  async getAll(filterDto: PatientFilterDto) {
    const { testResult } = filterDto;
    const query = this.patientRepository.createQueryBuilder('patient');

    if (testResult) {
      query.andWhere('patient.testResult = :testResult', { testResult });
    }

    return query.getMany();
  }

  async getById(id: string) {
    const patient = await this.patientRepository.findOne(id);
    if (!patient) {
      throw new NotFoundException();
    }
    return patient;
  }

  async getFileResult(id: string) {
    const patient = await this.patientRepository.findOne(id, {
      select: ['resultFileUrl'],
    });
    if (!patient) {
      throw new NotFoundException();
    }

    return patient.resultFileUrl;
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

  async updateFileResult(id: string, sharedFileDto: SharedFileDto) {
    const result = await this.patientRepository.update(id, {
      resultFileId: sharedFileDto.id,
      resultFileUrl: sharedFileDto.webViewLink,
    });

    if (result.affected === 0) {
      throw new BadRequestException();
    }
  }

  async delete(id: string) {
    const patient = await this.getById(id);
    return this.patientRepository.delete(patient);
  }
}
