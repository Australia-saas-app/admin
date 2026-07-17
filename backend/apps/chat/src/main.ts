import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

// Polyfill for crypto.randomUUID() if not available (Node.js < 19)
if (!globalThis.crypto) {
  globalThis.crypto = {
    randomUUID: () => {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    },
  } as any;
}

async function bootstrap() {
  console.log('Starting Chat Service bootstrap...');
  console.log('Redis URL:', process.env.REDIS_URL || 'redis://localhost:6379');
  console.log('Port:', process.env.PORT || 3006);
  
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  console.log('AppModule created successfully');

  app.setGlobalPrefix('api/chat');

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
    .setTitle('Chat Service API')
    .setDescription('Real-time messaging service with Socket.io for Live Chat, Order Chat, and Agency Chat')
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
    .addTag('live-chat', 'Live chat operations')
    .addTag('order-chat', 'Order chat operations')
    .addTag('agency-chat', 'Agency chat operations')
    .addTag('messages', 'Message operations')
    .addTag('admin', 'Admin chat management')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/chat/docs', app, document);

  const port = process.env.PORT || 3006;
  await app.listen(port as number, '0.0.0.0');

  console.log(`🚀 Chat Service running on http://0.0.0.0:${port}`);
  console.log(`📍 Health check: http://localhost:${port}/api/chat/health`);
  console.log(`📍 API Documentation: http://localhost:${port}/api/chat/docs`);
  console.log(`📍 WebSocket: ws://localhost:${port}`);
}

bootstrap().catch((error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});

