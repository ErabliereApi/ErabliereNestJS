import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';
import { ConfigService } from '@nestjs/config';
import { INestApplication, Logger } from '@nestjs/common';
import { setupLogger } from './app/logger/setup.logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  const config = app.get(ConfigService);
  app.setGlobalPrefix(config.get('apiSettings.prefix'));
  setupLogger(app, config);
  setupBodyParserLimit(app, config);
  app.enableCors();
  setupSwagger(app);
  await app.listen(3000)
}
bootstrap()

function setupBodyParserLimit(app: INestApplication, config: ConfigService) {
  const bodyParserLimit = { limit: config.get('apiSettings.bodySizeLimit') };
  Logger.debug(`Body parser limit: ${bodyParserLimit.limit}`);
  app.use(bodyParser.json(bodyParserLimit));
  return app;
}

function setupSwagger(app: INestApplication) {
  const documentBuilder = new DocumentBuilder()
    .setTitle('ErabliereAPI-NestJS')
    .setDescription('An API for products and learn NestJS')
    .setVersion('1.0')
    .addTag('products')
    .addTag('documents')
    .addTag('accesstoken')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, documentBuilder);
  SwaggerModule.setup('api', app, document);
}
