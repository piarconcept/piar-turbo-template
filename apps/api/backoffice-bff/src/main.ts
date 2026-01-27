import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for backoffice client
  app.enableCors({
    origin: process.env.BACKOFFICE_CLIENT_URL || 'http://localhost:3001',
    credentials: true,
  });

  // Setup Swagger only in development mode
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Backoffice BFF API')
      .setDescription('Backend for Frontend API for the backoffice application')
      .setVersion('0.1.0')
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
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-docs', app, document);

    console.warn(
      `📚 Swagger documentation available at: http://localhost:${process.env.PORT || 5050}/api-docs`,
    );
  }

  const port = process.env.PORT || 5050;
  await app.listen(port);

  console.warn(`🚀 Backoffice BFF is running on: http://localhost:${port}`);
}

bootstrap();
