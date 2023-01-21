import { Logger, Module } from "@nestjs/common";
import { AppLogger } from "./app.logger";
import { ContextLogger } from "./context.logger";
import { ConfigModule } from "@nestjs/config";
import configuration from "src/config/configuration";
import { SingletonAppLogger } from "./singleton.app.logger";

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration]
    }),
  ],
  providers: [
    SingletonAppLogger,
    AppLogger,
    ContextLogger,
    {
      provide: Logger,
      useClass: SingletonAppLogger
    }
  ],
  exports: [
    AppLogger,
    ContextLogger
  ]
})
export class AppLoggerModule {}