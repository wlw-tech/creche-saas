// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Toutes les routes commencent par /api (ex: /api/health)
  app.setGlobalPrefix('api');

  // Validation globale des DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // enlève les champs non attendus
      forbidNonWhitelisted: true, // erreur si champs inconnus
      transform: true, // convertit types (query params, etc.)
    }),
  );

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Crèche SaaS API')
    .setDescription('Documentation de l’API MVP')
    .setVersion('0.1.0')
    .addBearerAuth() // on prépare le terrain pour l’auth plus tard
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document); // http://localhost:3000/docs

  await app.listen(process.env.PORT ?? 3000);
  // Petit log sympa
  const url = await app.getUrl();
  console.log(`✅ API running on ${url}`);
  console.log(`📚 Swagger on ${url.replace(/\/$/, '')}/docs`);
}
bootstrap();
