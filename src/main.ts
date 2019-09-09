import "reflect-metadata";
import { NestFactory } from '@nestjs/core';
import { ApplicationModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ExceptionHandlerFilter } from './common';

async function bootstrap() {
  const fs = require('fs');
  const serverless = require('serverless-http');
  const app = await NestFactory.create(ApplicationModule, 
    {
      cors: true,
      // httpsOptions: {
      //   cert: fs.readFileSync('ca.crt'),
      //   key: fs.readFileSync('ca.key'),
      //   requestCert: false,
      //   rejectUnauthorized: false
      // }
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
  if(port == "8888"){
    module.exports.handler = serverless(app);
    return;
  }
  await app.listen(port);
}
bootstrap();