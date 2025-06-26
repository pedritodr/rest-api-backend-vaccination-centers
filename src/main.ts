import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:4200',
      'http://localhost:5173',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:4200',
      'http://127.0.0.1:5173',
      'http://convit.vercel.app',
      'https://convit.vercel.app',
    ],
    credentials: true,
  });
  //  app.enableCors({ origin: true, credentials: true });

  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('vaccination center')
    .setDescription('vaccination center API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document);

  await app.listen(parseInt(process.env.PORT) || 3001);
}
bootstrap();
