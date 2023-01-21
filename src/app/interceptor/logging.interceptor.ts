import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor, Scope } from "@nestjs/common";
import { Observable, tap } from "rxjs";
import { AppLogger } from "../logger/app.logger";

@Injectable({ scope: Scope.REQUEST })
export class LoggingInterceptor implements NestInterceptor {

  constructor(private readonly logger: AppLogger) {
    if (logger === undefined) {
      throw new Error('Logger is undefined');
    }
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const begin = Date.now();
    return next
      .handle()
      .pipe(
        tap(() => {
            const req = context.switchToHttp().getRequest();
            const method = req.method;
            const url = req.url;
            const status = context.switchToHttp().getResponse().statusCode;
            const elapsed = Date.now() - begin;
            this.logger.log(`${method} ${url} ${status} ${elapsed}ms`, context.getClass().name);
        })
    );
  }
}