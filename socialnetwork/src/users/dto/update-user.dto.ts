import { PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsInt } from 'class-validator';
import { RegisterDto } from '../auth/dto/register.dto';

export class UpdateUserDto extends PartialType(RegisterDto) {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsOptional()
  @IsInt()
  age: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  email: string;
}