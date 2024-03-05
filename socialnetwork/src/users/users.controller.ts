import { Body, Controller, Get, Param, Post, Put, Req, Request, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseInterface } from '../interfaces/response-interface';
import { LoginDto } from './auth/dto/login.dto';
import { RegisterDto } from './auth/dto/register.dto';
import { InvalidateTokenGuard } from './auth/guards/invalidate-token.guard';
import { User } from './entities/user.entity';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService
  ) { }


  @ApiOperation({ summary: 'Iniciar sesión' })
  @ApiResponse({ status: 200, description: 'Inicio de sesión exitoso' })
  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<ResponseInterface<string>> {
    const { email, password } = loginDto;
    const token: string = await this.authService.login(email, password);
    return {
      status: 200,
      data: token
    };
  }

  @ApiOperation({ summary: 'Registrar un usuario' })
  @ApiResponse({ status: 201, description: 'Usuario creado exitosamente' })
  @Post('register')
  async register(@Body() registerDto: RegisterDto): Promise<ResponseInterface<User>> {
    const user: User = await this.authService.register(registerDto); // LLamo al metodo register
    /* Retorno a razón de la interface ResponseInterface */
    return {
      status: 201,
      data: user
    };
  }


  @ApiOperation({ summary: 'Cerrar sesión' })
  @ApiResponse({ status: 200, description: 'Sesión cerrada exitosamente' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Post('logout')
  @UseGuards(InvalidateTokenGuard) // Usa los guards correspondientes
  async logout(@Req() request: Request): Promise<ResponseInterface<string>> {
    try {
      const accessToken: string = request.headers['authorization'].split(' ')[1];
      // const accessToken: string = request.headers
      const logoutmsg = await this.authService.logout(accessToken);
      // Devuelve un mensaje indicando que la sesión ha sido cerrada exitosamente
      return {
        status: 200,
        data: logoutmsg
      };
    } catch (error) {
      // Si ocurre un error, manejarlo aquí
      if (error instanceof UnauthorizedException) {
        // Si el error es de tipo UnauthorizedException, devolver un código de estado 401
        return {
          status: 401,
          data: error.message
        };
      } else {
        // Si es otro tipo de error, devolver un código de estado 500 u otro código de estado apropiado según corresponda
        return {
          status: 500,
          data: 'Se produjo un error al cerrar la sesión'
        };
      }
    }
  }

  /*

    Obtener información del usuario 
    @Param userId: id del usuario logueado
  */
  @ApiOperation({ summary: 'Obtener información del usuario logeado' })
  @ApiResponse({ status: 200, description: 'Proceso exitoso' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get('getInfo/:id')
  @UseGuards(InvalidateTokenGuard) // Usa los guards correspondientes
  async geInfoUser(@Param('id') userId: string): Promise<ResponseInterface<User | string>> {
    try {
      const user: User = await this.userService.getUserById(+userId)
      return {
        status: 200,
        data: user
      };
    } catch (error) {
      // Si ocurre un error, manejarlo aquí
      if (error instanceof UnauthorizedException) {
        // Si el error es de tipo UnauthorizedException, devolver un código de estado 401
        return {
          status: 401,
          data: error.message
        };
      } else {
        // Si es otro tipo de error, devolver un código de estado 500 u otro código de estado apropiado según corresponda
        return {
          status: 400,
          data: error.message
        };
      }
    }
  }


  /*

    Permitir editar información propia
    @Param userId: id del usuario logueado
  */
    @ApiOperation({ summary: 'Obtener información del usuario logeado' })
    @ApiResponse({ status: 200, description: 'Proceso exitoso' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @Put('editInfo/:id')
    @UseGuards(InvalidateTokenGuard) // Usa los guards correspondientes
    async editInfoUser(@Param('id') userId: string, @Body() updateuserdto: UpdateUserDto): Promise<ResponseInterface<User | string>> {
      try {
        const user: User = await this.userService.updateInfo(+userId, updateuserdto)
        return {
          status: 200,
          data: user
        };
      } catch (error) {
        // Si ocurre un error, manejarlo aquí
        if (error instanceof UnauthorizedException) {
          // Si el error es de tipo UnauthorizedException, devolver un código de estado 401
          return {
            status: 401,
            data: error.message
          };
        } else {
          // Si es otro tipo de error, devolver un código de estado 500 u otro código de estado apropiado según corresponda
          return {
            status: 400,
            data: error.message
          };
        }
      }
    }




}
