import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  // Global prefix
  app.setGlobalPrefix('api/commercial-industrial');

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Enable CORS
  app.enableCors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Authorization'],
  });

  app.useLogger(app.get(Logger));
  app.useGlobalInterceptors(new LoggerErrorInterceptor());
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'same-origin' },
      crossOriginEmbedderPolicy: false,
      referrerPolicy: { policy: 'no-referrer' },
    }),
  );

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Commercial & Industrial Service API')
    .setDescription(
      'API documentation for Commercial & Industrial Service - Managing offerings and categories',
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('commercial-industrial-services', 'Commercial & Industrial Services')
    .addTag('categories', 'Commercial & Industrial Categories')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/commercial-industrial/docs', app, document);

  const port = process.env.PORT || 3021;
  await app.listen(port, '0.0.0.0');

  console.log(
    `🚀 Commercial & Industrial Service running on http://0.0.0.0:${port}`,
  );
  console.log(
    `📍 Health check: http://localhost:${port}/api/commercial-industrial/health`,
  );
  console.log(
    `📍 API Documentation: http://localhost:${port}/api/commercial-industrial/docs`,
  );
}

bootstrap();


