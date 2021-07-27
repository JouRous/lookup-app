import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { TestMethod } from 'src/common/enums/TestingMethod.enum';
import { CreatePatientDto } from './dto/createPatient.dto';
import { UpdatePatientDto } from './dto/UpdatePatient.dto';
import { PatientsService } from './patients.service';

@Controller('patients')
export class PatientsController {
  constructor(private readonly patientService: PatientsService) {}

  @Get('/:id')
  getById(id: string) {
    return this.patientService.getById(id);
  }

  @Post()
  create(@Body() createPatientDto: CreatePatientDto) {
    if (
      createPatientDto.testMethod == TestMethod.RT_PCR &&
      !createPatientDto.PCRValue
    ) {
      throw new BadRequestException('PCR Value is required for RP-PCR method');
    }
    return this.patientService.create(createPatientDto);
  }

  @Put('/:id')
  update(@Param('id') id: string, @Body() updatePatientDto: UpdatePatientDto) {
    return this.patientService.update(id, updatePatientDto);
  }

  @Delete('/:id')
  delete(@Param('id') id: string) {
    return this.patientService.delete(id);
  }
}
