import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  app.use(helmet());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.setGlobalPrefix('visa-travel');

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3017;
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`Visa & Travel Service running on port ${port}`);
}

bootstrap();

