import { IsNotEmpty, IsString, MinLength, Matches, IsOptional, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: '+919876543210' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ example: 'Rohit Sharma' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'rohit@example.com', required: false })
  @IsEmail()
  @IsOptional()
  email?: string;

  /**
   * Password Policy:
   * - Minimum 8 characters
   * - At least one uppercase letter
   * - At least one lowercase letter
   * - At least one number
   * - At least one special character
   */
  @ApiProperty({ example: 'MyP@ssw0rd!' })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
    message:
      'Password must be at least 8 characters and contain uppercase, lowercase, number, and special character',
  })
  password: string;

  @ApiProperty({ example: 'manager', description: 'Role name' })
  @IsString()
  @IsNotEmpty()
  roleName: string;

  @ApiProperty({ example: 'uuid-of-tenant', required: false })
  @IsString()
  @IsOptional()
  tenantId?: string;

  @ApiProperty({ example: 'uuid-of-branch', required: false })
  @IsString()
  @IsOptional()
  branchId?: string;
}
