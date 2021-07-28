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
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { TestMethod } from 'src/common/enums/TestingMethod.enum';
import { GoogleService } from 'src/google/google.service';
import { CreatePatientDto } from './dto/createPatient.dto';
import { UpdatePatientDto } from './dto/UpdatePatient.dto';
import { PatientsService } from './patients.service';

@Controller('patients')
export class PatientsController {
  constructor(
    private readonly patientService: PatientsService,
    private readonly googleService: GoogleService,
  ) {}

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

  @Post('/:id/upload-result')
  @UseInterceptors(FileInterceptor('result'))
  @HttpCode(200)
  updateResultReport(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    file.filename = id;
    console.log(file);
    return this.googleService.uploadFile(file);
  }
}
