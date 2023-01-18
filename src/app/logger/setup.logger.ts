import { INestApplication, Logger } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { format, transport, transports } from "winston"
import { AppLogger } from "./app.logger"
import { WinstonModule } from "nest-winston"

export function setupLogger(app: INestApplication, config: ConfigService<unknown, boolean>) {

    function getTransports(config: ConfigService<unknown, boolean>): transport | transport[] {
      if (config.get('logger.enableFileLogging')) {
        Logger.debug('Using file logging')
        return [
          new transports.Console(),
          new transports.File({ filename: 'error.log', level: 'error' }),
          new transports.File({ filename: 'combined.log' }),
        ]
      }
      Logger.debug('Using console logging')
      return [new transports.Console()]
    }
  
    function getExceptionHandlers(config: ConfigService<unknown, boolean>): any {
      if (config.get('logger.enableFileLogging')) {
        return [
          new transports.Console({
            format: format.simple()
          }),
          new transports.File({ filename: "exceptions.log" })
        ]
      }
      return [
        new transports.Console({
          format: format.simple()
        })
      ]
    }
  
    function getRejectionHandlers(config: ConfigService<unknown, boolean>): any {
      if (config.get('logger.enableFileLogging')) {
        return [
          new transports.Console({
            format: format.simple()
          }),
          new transports.File({ filename: "rejections.log" })
        ]
      }
      return [
        new transports.Console({
          format: format.simple()
        })
      ]
    }
  
    if (config.get('logger.library') == 'winston') {
      Logger.debug('Using winston logger for app ' + config.get('logger.title') + ' at level ' + config.get('logger.level'));
      app.useLogger(new AppLogger(WinstonModule.createLogger({
        level: config.get('logger.level'),
        defaultMeta: { 
          service: config.get('logger.title'), 
          environment: config.get('logger.environment')
        },
        format: format.combine(
          format.timestamp(),
          format.json()
        ),
        transports: getTransports(config),
        exceptionHandlers: getExceptionHandlers(config),
        rejectionHandlers: getRejectionHandlers(config)
      })));
    }
    else {
      Logger.debug('Using default logger');
    }
  }
  
  