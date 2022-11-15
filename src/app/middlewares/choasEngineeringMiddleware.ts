
import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ChoasEngineesingMiddleware implements NestMiddleware {
  constructor(private configService: ConfigService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const percentageError = this.configService.get<number>('chaos.percentageError')
    const randomNumber = Math.random()
    if (randomNumber >= percentageError) {
      next()
    }
    else {
      res.status(Math.floor(Math.random() * (500 - 400 + 1)) + 400).send()
    }
  }
}
