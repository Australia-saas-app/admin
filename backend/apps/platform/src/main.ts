import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import helmet from "helmet";
import { Logger, LoggerErrorInterceptor } from "nestjs-pino";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { GlobalExceptionFilter } from "./common/filters/global-exception.filter";

async function bootstrap() {
  console.log("Starting Platform Service bootstrap...");

  console.log("Redis Host:", process.env.REDIS_HOST || "localhost");
  console.log("Port:", process.env.PORT || 3013);

  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  console.log("AppModule created successfully");

  app.setGlobalPrefix("platform-service");

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new GlobalExceptionFilter());

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
      crossOriginResourcePolicy: { policy: "same-origin" },
      crossOriginEmbedderPolicy: false,
      referrerPolicy: { policy: "no-referrer" },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle("Platform Service API")
    .setDescription(
      "Platform service for content management including gallery, notices, blog, contact us, team, and branches",
    )
    .setVersion("1.0")
    .addBearerAuth(
      {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        name: "JWT",
        description: "Enter JWT token",
        in: "header",
      },
      "JWT-auth",
    )
    .addTag("gallery", "Gallery operations")
    .addTag("notices", "Notice operations")
    .addTag("blog", "Blog operations")
    .addTag("contact-us", "Contact operations")
    .addTag("team", "Team operations")
    .addTag("branches", "Branch operations")
    .addTag("admin", "Admin operations")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("platform-service/docs", app, document);

  const port = process.env.PORT || 3013;
  await app.listen(port as number, "0.0.0.0");

  console.log(`🚀 Platform Service running on http://0.0.0.0:${port}`);
  console.log(
    `📍 Health check: http://localhost:${port}/platform-service/health`,
  );
  console.log(
    `📍 API Documentation: http://localhost:${port}/platform-service/docs`,
  );
}

bootstrap().catch((error) => {
  console.error("Failed to start application:", error);
  process.exit(1);
});
