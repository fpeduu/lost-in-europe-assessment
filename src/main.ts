import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable validation pipes
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Setup Swagger documentation
  const config = new DocumentBuilder()
    .setTitle("Kevin's Travel Itinerary API")
    .setDescription('API to sort travel tickets into correct itinerary order')
    .setVersion('1.0')
    .addTag('itinerary')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
  console.log("Kevin's Travel API is running on http://localhost:3000");
  console.log('Swagger documentation available at http://localhost:3000/api');
}
void bootstrap();
