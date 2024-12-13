import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ExceptionsFilter } from './config/exceptions.filter';
import { initializeDatabase } from './database/setup-database';

async function bootstrap() {

  // Initialize the database
  await initializeDatabase();

  const app = await NestFactory.create(AppModule);
  // Set global prefix
  app.setGlobalPrefix('library');

  const { httpAdapter } = app.get(HttpAdapterHost);
  // Set the exception handler
  app.useGlobalFilters(new ExceptionsFilter(httpAdapter));

  app.enableCors({ origin: '*' });

  // Configure the validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Handle unhandled promise rejections and uncaught exceptions
  process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  });
  process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
