import { MiddlewareConsumer, Module, NestModule, OnModuleInit } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ChoasEngineesingMiddleware } from './app/middlewares/choasEngineeringMiddleware';
import configuration from './config/configuration';
import { DocumentModule } from './document/document.module';
import { HelloController } from './hello/hello.controller';
import { HelloService } from './hello/hello.service';
import { ProductModule } from './product/product.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration]
    }),
    ProductModule,
    DocumentModule,
  ],
  controllers: [HelloController],
  providers: [HelloService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ChoasEngineesingMiddleware)
      .forRoutes('*');
  }
}
