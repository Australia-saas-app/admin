import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  console.log('Starting Affiliate Service bootstrap...');
  console.log('MongoDB URI:', process.env.MONGODB_URI || 'mongodb://localhost:27017/affiliate_db');
  console.log('Redis Host:', process.env.REDIS_HOST || 'localhost');
  console.log('Port:', process.env.PORT || 3012);

  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  console.log('AppModule created successfully');

  app.setGlobalPrefix('affiliate-service');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

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

  const config = new DocumentBuilder()
    .setTitle('Affiliate Service API')
    .setDescription('Affiliate service for referral tracking, commission management, and affiliate program')
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
    .addTag('affiliate', 'Affiliate operations')
    .addTag('referrals', 'Referral operations')
    .addTag('commissions', 'Commission operations')
    .addTag('earnings', 'Earnings operations')
    .addTag('analytics', 'Analytics operations')
    .addTag('notifications', 'Notification operations')
    .addTag('admin', 'Admin affiliate management')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('affiliate-service/docs', app, document);

  const port = process.env.PORT || 3012;
  await app.listen(port as number, '0.0.0.0');

  console.log(`🚀 Affiliate Service running on http://0.0.0.0:${port}`);
  console.log(`📍 Health check: http://localhost:${port}/affiliate-service/health`);
  console.log(`📍 API Documentation: http://localhost:${port}/affiliate-service/docs`);
}

bootstrap().catch((error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});