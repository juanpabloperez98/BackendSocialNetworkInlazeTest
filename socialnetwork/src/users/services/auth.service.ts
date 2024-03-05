import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { RegisterDto } from "../auth/dto/register.dto";
import { User } from "../entities/user.entity";
import { UserService } from "./user.service";
import { JwtPayload } from "../auth/interface/jwt-payload.interface";

@Injectable()
export class AuthService {
  // Lista para almacenar los tokens invalidados
  private readonly invalidTokens: Set<string> = new Set();

  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    // Aquí deberías implementar la lógica para validar las credenciales del usuario
    // Por ejemplo, buscar en la base de datos si el usuario existe y comparar las contraseñas
    if (username === "user" && password === "password") {
      return { username: "user" };
    }
    return null;
  }

  async login(email: string, password: string): Promise<string> {
    try {
      const userExists: User = await this.userService.findByEmail(email);
      // Si el usuario no existe
      if (!userExists) {
        throw new HttpException(
          "El usuario no existente",
          HttpStatus.BAD_REQUEST
        );
      }
      // Se valida que las contraseñas coincidan
      const validatePass = await bcrypt.compare(password, userExists.password);
      if (!validatePass) {
        throw new HttpException("Contraseña no valida", HttpStatus.BAD_REQUEST);
      }
      const payload = { email }; // Payload del token
      return this.jwtService.sign(payload);
    } catch (error) {
      throw error;
    }
  }

  async register(registerDto: RegisterDto): Promise<User> {
    try {
      const { fullName, age, email, password } = registerDto; // Descomponemos variables
      // Comprueba si el usuario ya existe en la base de datos
      const userExists: User = await this.userService.findByEmail(email);
      // Si el usuario ya existe
      if (userExists) {
        throw new HttpException(
          "El usuario con ese email ya existe",
          HttpStatus.BAD_REQUEST
        );
      }
      // Se retorna la respuesta del metodo del createUser
      return await this.userService.createUser(fullName, age, email, password);
    } catch (error) {
      throw error;
    }
  }

  private async invalidateToken(token: string): Promise<void> {
    // Añadir a la lista de tokens invalidos
    this.invalidTokens.add(token);
  }

  async isTokenInvalid(accessToken: string): Promise<boolean> {
    try {
      return this.invalidTokens.has(accessToken);
    } catch (error) {
      throw error;
    }
  }

  async logout(accessToken: string): Promise<string> {
    try {
      if (!accessToken) {
        throw new UnauthorizedException("Token de acceso no proporcionado");
      }
      // Se hace el llamado a la función que invalida el token
      await this.invalidateToken(accessToken);
      // Devuelve un mensaje indicando que la sesión ha sido cerrada exitosamente
      return "Sesión cerrada exitosamente";
    } catch (error) {
      throw error;
    }
  }

  async getUserFromToken(token: string): Promise<any> {
    try {
      // Decodificar el token JWT para obtener el payload
      const payload: JwtPayload = this.jwtService.verify(token);      
      // Se busca el usuario en BD
      const user = await this.userService.findByEmail(payload.email);
      if (!user) {
        throw new UnauthorizedException('Usuario no encontrado');
      }
      return { username: payload.email };
    } catch (error) {
      // Si hay algún error al decodificar el token o verificar la firma, lanzar una excepción
      throw new UnauthorizedException('Token de acceso invalido');
    }
  }
}
