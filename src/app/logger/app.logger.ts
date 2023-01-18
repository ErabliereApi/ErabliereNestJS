import { HttpAdapterHost, Injectable, LoggerService, Scope } from "@nestjs/common";

@Injectable({ scope: Scope.REQUEST })
export class AppLogger implements LoggerService {

  /**
   *
   */
  constructor(private logger: LoggerService) {
    
  }

  /**
   * Write a 'log' level log.
   */
  log(message: any, ...optionalParams: any[]) {
    const context = undefined
    if (context !== undefined) {
        const req = context.getRequest();
        const method = req.method;
        const url = req.url;
        const status = context.getResponse().statusCode;

        this.logger.log(message, [req, method, url, status, ...optionalParams]);
    }
    else {
        this.logger.log(message, optionalParams);
    }
  }

  /**
   * Write an 'error' level log.
   */
  error(message: any, ...optionalParams: any[]) {
    const context = undefined
    if (context !== undefined) {
        const req = context.getRequest();
        const method = req.method;
        const url = req.url;
        const status = context.getResponse().statusCode;

        this.logger.error(message, [req, method, url, status, ...optionalParams]);
    }
    else {
        this.logger.error(message, optionalParams);
    }
  }

  /**
   * Write a 'warn' level log.
   */
  warn(message: any, ...optionalParams: any[]) {
    const context = undefined
    if (context !== undefined) {
        const req = context.getRequest();
        const method = req.method;
        const url = req.url;
        const status = context.getResponse().statusCode;

        this.logger.warn(message, [req, method, url, status, ...optionalParams]);
    }
    else {
        this.logger.warn(message, optionalParams);
    }
  }

  /**
   * Write a 'debug' level log.
   */
  debug?(message: any, ...optionalParams: any[]) {
    const context = undefined
    if (context !== undefined) {
        const req = context.getRequest();
        const method = req.method;
        const url = req.url;
        const status = context.getResponse().statusCode;

        this.logger.debug(message, [req, method, url, status, ...optionalParams]);
    }
    else {
        this.logger.debug(message, optionalParams);
    }
  }

  /**
   * Write a 'verbose' level log.
   */
  verbose?(message: any, ...optionalParams: any[]) {
    const context = undefined
    if (context !== undefined) {
        const req = context.getRequest();
        const method = req.method;
        const url = req.url;
        const status = context.getResponse().statusCode;

        this.logger.verbose(message, [req, method, url, status, ...optionalParams]);
    }
    else {
        this.logger.verbose(message, optionalParams);
    }
  }
}