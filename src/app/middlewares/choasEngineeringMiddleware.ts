
import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ChoasEngineesingMiddleware implements NestMiddleware {
  constructor(private configService: ConfigService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const percentageError = this.configService.get<number>('chaos.percentageError')
    const percentageDelay = this.configService.get<number>('chaos.percentageDelay')
    function getDelay(config: ConfigService) {
      const randomNumber = Math.random()
      return randomNumber >= percentageDelay ? 
              0 : 
              Math.floor(
                Math.random() * config.get<number>('chaos.randomDelaiMax')) + config.get<number>('chaos.randomDelaiMin')
    }
    const randomNumber = Math.random()
    if (randomNumber >= percentageError) {
      setTimeout(() => {
        next()
      }, getDelay(this.configService))
    }
    else {
      setTimeout(() => {
        res.status(Math.floor(Math.random() * (500 - 400 + 1)) + 400).send()
      }, getDelay(this.configService))
    }
  }
}
