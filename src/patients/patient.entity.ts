import { Gender } from 'src/common/enums/Gender.enum';
import { SpecimenType } from 'src/common/enums/specimenType.enum';
import { TestMethod } from 'src/common/enums/TestingMethod.enum';
import { TestReason } from 'src/common/enums/TestReason.enum';
import { TestResult } from 'src/common/enums/TestResult.enum';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Patient {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  fullName: string;

  @Column()
  gender: Gender;

  @Column()
  testResult: TestResult;

  @Column()
  testMethod: TestMethod;

  @Column()
  specimenType: SpecimenType;

  @Column()
  testReason: TestReason;

  @Column()
  testDate: Date;

  @Column()
  resultDate: Date;

  @Column({ default: null })
  testCode: string;

  @Column()
  medicalFacilityCode: string;

  @Column()
  PCRValue: string;
}
