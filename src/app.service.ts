import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    let message = process.env.HelloMessage
    if (message == undefined) {
      message = "Hello World!"
    }
    return message;
  }
}
