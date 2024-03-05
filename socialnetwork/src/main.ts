import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('BackendSocialNetwork')
    .setDescription('Documentación SocialNetwork')
    .setVersion('1.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }) // Especificar el tipo de esquema de autenticación
    .build();
  const document = SwaggerModule.createDocument(app, config);
  // Especificar la configuración de la autenticación
  document.security = [{ bearerAuth: [] }];
  SwaggerModule.setup('doc', app, document);

  await app.listen(3000);
}
bootstrap();
