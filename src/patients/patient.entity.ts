import { Gender } from 'src/common/enums/Gender.enum';
import { SpecimenType } from 'src/common/enums/specimenType.enum';
import { TestMethod } from 'src/common/enums/TestingMethod.enum';
import { TestReason } from 'src/common/enums/TestReason.enum';
import { TestResult } from 'src/common/enums/TestResult.enum';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as dayjs from 'dayjs';
import { Transform } from 'class-transformer';

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
  @Transform(({ value }) => dayjs(value).format('YYYYMMDDHHmm'), {
    toPlainOnly: true,
  })
  testDate: Date;

  @Column()
  @Transform(({ value }) => dayjs(value).format('YYYYMMDDHHmm'), {
    toPlainOnly: true,
  })
  resultDate: Date;

  @Column({ default: null })
  testCode: string;

  @Column()
  medicalFacilityCode: string;

  @Column()
  PCRValue: string;

  @BeforeInsert()
  parseDateInsert() {
    this.testDate = dayjs(this.testDate, 'YYYYMMDDHHmm').toDate();
    this.resultDate = dayjs(this.resultDate, 'YYYYMMDDHHmm').toDate();
  }

  @BeforeUpdate()
  parseDateUpdate() {
    this.testDate = dayjs(this.testDate, 'YYYYMMDDHHmm').toDate();
    this.resultDate = dayjs(this.resultDate, 'YYYYMMDDHHmm').toDate();
  }
}
