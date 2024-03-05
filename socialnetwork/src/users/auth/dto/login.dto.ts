import { IsString, IsEmail } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class LoginDto {
  @ApiProperty()
  @IsEmail({}, { message: "El correo electrónico proporcionado no es válido" })
  readonly email: string;

  @ApiProperty()
  @IsString({ message: "La contraseña debe ser una cadena de texto" })
  readonly password: string;
}
