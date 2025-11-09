import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3000;
  const logger = new Logger('Bootstrap');
  // Habilitar CORS para permitir peticiones desde otros orígenes 
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  // Habilitar pipes de validación globales para DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, 
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.enableShutdownHooks();
  app.setGlobalPrefix('api/v1');
  // Configuración de Swagger (OpenAPI)
  const swaggerConfig = new DocumentBuilder()
    .setTitle('HubSpot ETL API')
    .setDescription(
      'API para orquestar un proceso ETL desde HubSpot y para consultar métricas de analítica.',
    )
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  // La documentación estará disponible en /docs
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(port);

  logger.log(`🚀 Aplicación corriendo en: http://localhost:${port}`);
}

bootstrap();
