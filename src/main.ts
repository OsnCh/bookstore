import "reflect-metadata";
import { NestFactory } from '@nestjs/core';
import { ApplicationModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ExceptionHandlerFilter } from './common';

async function bootstrap() {
  const app = await NestFactory.create(ApplicationModule, 
    {
      cors: true
    });
  const port = process.env.PORT || 8080;
  const options = new DocumentBuilder()
    .setTitle('Books store')
    .setDescription('WebAPI for selling books and magazines')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('swagger', app, document);
  app.useGlobalFilters(new ExceptionHandlerFilter())
  await app.listen(port);
}
bootstrap();