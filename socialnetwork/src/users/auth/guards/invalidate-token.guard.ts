import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthService } from 'src/users/services/auth.service';

@Injectable()
export class InvalidateTokenGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authorizationHeader = request.headers.authorization;

    
    
    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Unauthorized');
    }

    const accessToken = authorizationHeader.split(' ')[1]; // Obtener el token de acceso del encabezado    

    // Verificar si el token está en la lista de tokens inválidos
    const isInvalid = await this.authService.isTokenInvalid(accessToken);
    if (isInvalid) {
      // Si el token es inválido, lanzar una excepción no autorizada
      throw new UnauthorizedException('Token de acceso invalido');
    }
    // Obtener la información del usuario del token y agregarla al objeto de solicitud
    const user = await this.authService.getUserFromToken(accessToken);
    request.user = user;
    // Si el token es válido, permitir el acceso
    return true;
  }
}
