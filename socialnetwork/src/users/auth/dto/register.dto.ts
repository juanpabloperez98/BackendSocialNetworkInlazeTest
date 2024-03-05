import {
  IsString,
  MinLength,
  MaxLength,
  IsNumber,
  IsEmail,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class RegisterDto {
  @ApiProperty()
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  readonly fullName: string;

  @ApiProperty()
  @IsNumber()
  readonly age: number;

  @ApiProperty()
  @IsEmail({}, { message: "El correo electrónico proporcionado no es válido" })
  readonly email: string;

  @ApiProperty()
  @IsString({ message: "La contraseña debe ser una cadena de texto" })
  @MinLength(6, { message: "La contraseña debe tener al menos 6 caracteres" })
  @MaxLength(20, {
    message: "La contraseña no puede tener más de 20 caracteres",
  })
  readonly password: string;
}
