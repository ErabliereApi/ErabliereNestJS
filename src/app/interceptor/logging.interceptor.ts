import { CallHandler, ExecutionContext, Logger, NestInterceptor } from "@nestjs/common";
import { Observable, tap } from "rxjs";

export class LoggingInterceptor implements NestInterceptor {

  constructor(private readonly logger: Logger) {
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