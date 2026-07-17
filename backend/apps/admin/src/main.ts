import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  // Global prefix
  app.setGlobalPrefix('admin-service');

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Global exception filter
  app.useGlobalFilters(new GlobalExceptionFilter());

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
    .setTitle('Admin Service API')
    .setDescription('API documentation for Admin Service - Admin operations, analytics, and system management')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter Admin JWT token from SSO service',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('analytics', 'Analytics and Dashboard')
    .addTag('users', 'User Management')
    .addTag('admins', 'Admin Management')
    .addTag('logs', 'Activity Logs and Audit Trails')
    .addTag('chat', 'Chat Management')
    .addTag('notifications', 'Notifications')
    .addTag('reports', 'Reports')
    .addTag('settings', 'System Settings')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('admin-service/docs', app, document);

  const port = process.env.PORT || 3007;
  await app.listen(port, '0.0.0.0');

  console.log(`🚀 Admin Service running on http://0.0.0.0:${port}`);
  console.log(`📍 Health check: http://localhost:${port}/admin-service/health`);
  console.log(`📍 API Documentation: http://localhost:${port}/admin-service/docs`);
}

bootstrap();




