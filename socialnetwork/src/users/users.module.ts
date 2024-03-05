import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { JwtStrategy } from './auth/jwt.strategy';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';


@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule,
    JwtModule.register({
      secret: '1BBH3U0R6V',
      signOptions: { expiresIn: '3h' },
    }),
  ],
  controllers: [UsersController],
  providers: [JwtStrategy, AuthService, UserService],
  exports: [],
})
export class UsersModule {}
