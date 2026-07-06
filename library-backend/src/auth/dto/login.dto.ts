import { IsNotEmpty, IsString, MinLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: '+919876543210', description: 'User phone number' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ example: 'MyP@ssw0rd!', description: 'User password (min 8 chars)' })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
