import "reflect-metadata";
import { NestFactory } from '@nestjs/core';
import { ApplicationModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ExceptionHandlerFilter } from './common';

async function bootstrap() {
  const app = await NestFactory.create(ApplicationModule, {cors: true});
  const port = process.env.PORT || 3001;
  const options = new DocumentBuilder()
    .setTitle('Books store')
    .setDescription('Selling books and magazines')
    .setVersion('1.0')
    .addTag('books, magazines')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('swagger', app, document);
  app.useGlobalFilters(new ExceptionHandlerFilter())
  app.use
  await app.listen(port);
}
bootstrap();
