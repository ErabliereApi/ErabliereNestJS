import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';
import { ConfigService } from '@nestjs/config';
import { INestApplication, Logger } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import winston = require("winston");
import { LoggingInterceptor } from './app/interceptor/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  setupLogger(app, config);
  app.useGlobalInterceptors(new LoggingInterceptor(app.get(Logger)))
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
    .setTitle('Product API')
    .setDescription('An API for products and learn NestJS')
    .setVersion('1.0')
    .addTag('products')
    .addTag('documents')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, documentBuilder);
  SwaggerModule.setup('api', app, document);
}

function setupLogger(app: INestApplication, config: ConfigService<unknown, boolean>) {

  function getTransports(config: ConfigService<unknown, boolean>): winston.transport | winston.transport[] {
    if (config.get('logger.enableFileLogging')) {
      Logger.debug('Using file logging')
      return [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' }),
      ]
    }
    Logger.debug('Using console logging')
    return [new winston.transports.Console()]
  }

  function getExceptionHandlers(config: ConfigService<unknown, boolean>): any {
    if (config.get('logger.enableFileLogging')) {
      return [
        new winston.transports.Console({
          format: winston.format.simple()
        }),
        new winston.transports.File({ filename: "exceptions.log" })
      ]
    }
    return [
      new winston.transports.Console({
        format: winston.format.simple()
      })
    ]
  }

  function getRejectionHandlers(config: ConfigService<unknown, boolean>): any {
    if (config.get('logger.enableFileLogging')) {
      return [
        new winston.transports.Console({
          format: winston.format.simple()
        }),
        new winston.transports.File({ filename: "rejections.log" })
      ]
    }
    return [
      new winston.transports.Console({
        format: winston.format.simple()
      })
    ]
  }

  if (config.get('logger.library') == 'winston') {
    Logger.debug('Using winston logger for app ' + config.get('logger.title') + ' at level ' + config.get('logger.level'));
    app.useLogger(WinstonModule.createLogger({
      level: config.get('logger.level'),
      defaultMeta: { 
        service: config.get('logger.title'), 
        environment: config.get('logger.environment')
      },
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
      transports: getTransports(config),
      exceptionHandlers: getExceptionHandlers(config),
      rejectionHandlers: getRejectionHandlers(config)
    }));
  }
  else {
    Logger.debug('Using default logger');
  }
}

