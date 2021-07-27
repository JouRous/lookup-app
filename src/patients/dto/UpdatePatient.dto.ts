import { Gender } from 'src/common/enums/Gender.enum';
import { SpecimenType } from 'src/common/enums/specimenType.enum';
import { TestMethod } from 'src/common/enums/TestingMethod.enum';
import { TestReason } from 'src/common/enums/TestReason.enum';
import { TestResult } from 'src/common/enums/TestResult.enum';

export class UpdatePatientDto {
  fullName: string;
  gender: Gender;
  testResult: TestResult;
  testMethod: TestMethod;
  specimenType: SpecimenType;
  testReason: TestReason;
  testDate: string;
  resultDate: string;
  testCode: string;
  medicalFacilityCode: string;
  PCRValue: string;
}
