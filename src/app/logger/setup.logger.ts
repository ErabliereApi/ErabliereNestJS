import { INestApplication, Logger } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { SingletonAppLogger } from "./singleton.app.logger";

export function setupLogger(app: INestApplication, config: ConfigService<unknown, boolean>) {
    if (config.get('logger.library') == 'winston') {
      Logger.debug('Using winston logger for app ' + config.get('logger.title') + ' at level ' + config.get('logger.level'), "setupLogger");
      app.useLogger(new SingletonAppLogger(config));
    }
    else {
      Logger.debug('Using default logger', "setupLogger");
    }
  }
  