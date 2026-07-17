import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsNumber,
  Min,
  Length,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateEnrollmentDto {
  @ApiProperty({ description: "Course ID", example: "EDU-ABC123" })
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  courseId: string;

  @ApiPropertyOptional({ description: "Student ID", example: "user123" })
  @IsString()
  @IsOptional()
  studentId?: string;

  @ApiPropertyOptional({ description: "Student name", example: "John Doe" })
  @IsString()
  @IsOptional()
  studentName?: string;

  @ApiPropertyOptional({ description: "Paid amount", example: 99.99 })
  @IsNumber()
  @IsOptional()
  @Min(0)
  paidAmount?: number;

  @ApiPropertyOptional({ description: "Currency", example: "USD" })
  @IsString()
  @IsOptional()
  @Length(3, 3)
  currency?: string;

  @ApiPropertyOptional({ description: "Payment method", example: "stripe" })
  @IsString()
  @IsOptional()
  paymentMethod?: string;

  @ApiPropertyOptional({
    description: "Transaction ID",
    example: "txn_123456789",
  })
  @IsString()
  @IsOptional()
  transactionId?: string;

  @ApiPropertyOptional({
    description: "Mark as completed",
    example: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  isCompleted?: boolean;
}
