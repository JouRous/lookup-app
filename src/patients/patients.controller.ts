import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { TestMethod } from 'src/common/enums/TestingMethod.enum';
import { GoogleService } from 'src/google/google.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { PatientFilterDto } from './dto/patient-filter.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { PatientsService } from './patients.service';

@Controller('patients')
export class PatientsController {
  constructor(
    private readonly patientService: PatientsService,
    private readonly googleService: GoogleService,
  ) {}

  @Get()
  getAll(@Query() filterDto: PatientFilterDto) {
    return this.patientService.getAll(filterDto);
  }

  @Get('/:id')
  getById(id: string) {
    return this.patientService.getById(id);
  }

  @Get('/:id/file-result')
  getFileResult(@Param('id') id: string) {
    return this.patientService.getFileResult(id);
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

  @Post('/:id/upload-result')
  @UseInterceptors(FileInterceptor('fileResult'))
  @HttpCode(200)
  async updateResultReport(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const sharedFileDto = await this.googleService.uploadFile(file);
    console.log(sharedFileDto);
    await this.patientService.updateFileResult(id, sharedFileDto);
  }
}
