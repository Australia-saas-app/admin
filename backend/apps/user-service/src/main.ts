import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { Logger as PinoLogger, LoggerErrorInterceptor } from 'nestjs-pino';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.useLogger(app.get(PinoLogger));
  app.useGlobalInterceptors(new LoggerErrorInterceptor());
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'same-origin' },
      crossOriginEmbedderPolicy: false,
      referrerPolicy: { policy: 'no-referrer' },
    }),
  );

  const configService = app.get(ConfigService);

  const port = configService.get<number>('PORT', 3003);
  const host = configService.get<string>('HOST', '0.0.0.0');

  app.enableShutdownHooks();

  await app.listen(port, host);

  const baseUrl = `http://${host === '0.0.0.0' ? 'localhost' : host}:${port}`;
  Logger.log(`🚀 User service running at ${baseUrl}/user`, 'Bootstrap');
}

bootstrap().catch((error) => {
  Logger.error('Failed to bootstrap User service', error);
  process.exit(1);
});