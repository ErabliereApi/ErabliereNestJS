import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './app/interceptor/logging.interceptor';
import { ChoasEngineesingMiddleware } from './app/middlewares/choasEngineeringMiddleware';
import configuration from './config/configuration';
import { DocumentModule } from './document/document.module';
import { HelloController } from './hello/hello.controller';
import { HelloService } from './hello/hello.service';
import { ProductModule } from './product/product.module';
import { AppLoggerModule } from './app/logger/logger.module';
import { LogContextInitialiserMiddleware } from './app/middlewares/log.context.initialiser.Middleware';
import { AccessTokenModule } from './accesstoken/accesstoken.module';
import { RecordingModule } from './recording/recording.module';
import { SaleOrderModule } from './salesorder/saleorder.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration]
    }),
    AppLoggerModule,
    ProductModule,
    DocumentModule,
    AccessTokenModule,
    RecordingModule,
    SaleOrderModule
  ],
  controllers: [HelloController],
  providers: [
    HelloService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor
    }
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LogContextInitialiserMiddleware)
      .forRoutes("*")
      .apply(ChoasEngineesingMiddleware)
      .forRoutes('*');
  }
}
