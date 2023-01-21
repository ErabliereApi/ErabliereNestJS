import { Logger, LoggerService } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { WinstonModule } from "nest-winston"
import { format, transport, transports } from "winston"

export function getWinstonLogger(config): LoggerService {
    return WinstonModule.createLogger({
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
    })
  }
  
  export function getTransports(config: ConfigService<unknown, boolean>): transport | transport[] {
    if (config.get('logger.enableFileLogging')) {
      Logger.debug('Using file logging', "getTransports")
      return [
        new transports.Console(),
        new transports.File({ filename: 'error.log', level: 'error' }),
        new transports.File({ filename: 'combined.log' }),
      ]
    }
    Logger.debug('Using console logging', "getTransports")
    return [new transports.Console()]
  }
  
  export function getExceptionHandlers(config: ConfigService<unknown, boolean>): any {
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
  
  export function getRejectionHandlers(config: ConfigService<unknown, boolean>): any {
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