import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from "bcrypt";
import { Repository } from "typeorm";
import { User } from "../entities/user.entity";
import { UpdateUserDto } from "../dto/update-user.dto";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async findByEmail(email: string): Promise<User> {
    try {
      const user = await this.userRepository.findOne({ where: { email } });
      return user; // Si el usuario existe, devuelve el User; de lo contrario, devuelve null
    } catch (error) {
      throw new HttpException(
        "Error al buscar el usuario",
        HttpStatus.BAD_REQUEST
      );
    }
  }

  async createUser(
    fullName: string,
    age: number,
    email: string,
    password: string
  ): Promise<User> {
    try {
      // Encriptamos la password
      const hashedPassword = await bcrypt.hash(password, 10);
      // Se crea la instacia con los valores
      const user = this.userRepository.create({
        fullName,
        age,
        email,
        password: hashedPassword,
      });
      // se retorna la entidad User
      return await this.userRepository.save(user);
    } catch (error) {
      throw new Error("Error al crear usuario");
    }
  }

  async getUserById(userId: number): Promise<User> {
    try {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new NotFoundException("Usuario no encontrado");
      }
      return user;
    } catch (error) {
      throw new HttpException(
        "Error al buscar el usuario",
        HttpStatus.BAD_REQUEST
      );
    }
  }

  async updateInfo(
    userId: number,
    updateuserdto: UpdateUserDto
  ): Promise<User> {
    try {
      // Verificar si existe el user
      const userToUpdate = await this.getUserById(userId);
      // Si el usuario no fue encontrado
      if (!userToUpdate) {
        throw new Error("Usuario no encontrado");
      }

      // Saco la constante email
      const { email } = updateuserdto

      let usersexits = null;
      if(email != undefined){
        usersexits = await this.findByEmail(email);
      }
      if(usersexits){
        throw new Error("Ya existe un usuario con este email, no se puede actualizar");
      }
      //Pero si fue encontrado entonces actualiza
      this.userRepository.merge(userToUpdate, updateuserdto);
      await this.userRepository.save(userToUpdate);
      // Retorna el usuario actualizado
      return userToUpdate;
    } catch (error) {      
      throw new HttpException(
        error,
        HttpStatus.BAD_REQUEST
      );
    }
  }
}
