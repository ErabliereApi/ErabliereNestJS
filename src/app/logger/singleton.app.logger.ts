import { Injectable, LogLevel, LoggerService } from "@nestjs/common";
import { getWinstonLogger } from "./config.functions";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class SingletonAppLogger implements LoggerService {

    private readonly logger: LoggerService

    /**
     *
     */
    constructor(private readonly config: ConfigService) {
        this.logger = getWinstonLogger(config)
    }

    log(message: any, ...optionalParams: any[]) {
        this.logger.log(message, optionalParams)
    }
    error(message: any, ...optionalParams: any[]) {
        this.logger.error(message, optionalParams)
    }
    warn(message: any, ...optionalParams: any[]) {
        this.logger.warn(message, optionalParams)
    }
    debug?(message: any, ...optionalParams: any[]) {
        this.logger.debug(message, optionalParams)
    }
    verbose?(message: any, ...optionalParams: any[]) {
        this.logger.verbose(message, optionalParams)
    }
    setLogLevels?(levels: LogLevel[]) {
        this.logger.setLogLevels(levels)
    }
    
}