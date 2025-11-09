import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // Habilitamos el logger de NestJS para que muestre timestamps
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3000;
  const logger = new Logger('Bootstrap');

  // Habilitar CORS para permitir peticiones desde otros orígenes (ej. un frontend)
  app.enableCors({
    origin: true, // Puedes restringirlo a un dominio específico: 'http://localhost:4200'
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Habilitar pipes de validación globales para DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Ignora propiedades que no están en el DTO
      forbidNonWhitelisted: true, // Lanza un error si se envían propiedades no permitidas
      transform: true, // Transforma los payloads a instancias de DTO
    }),
  );

  // Habilitar hooks de apagado para un cierre ordenado (ej. cerrar pool de DB)
  app.enableShutdownHooks();

  await app.listen(port);

  logger.log(`🚀 Aplicación corriendo en: http://localhost:${port}`);
}

bootstrap();
