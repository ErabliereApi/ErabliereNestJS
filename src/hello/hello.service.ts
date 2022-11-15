import { Injectable } from '@nestjs/common';

@Injectable()
export class HelloService {
  getHello(): string {
    let message = process.env.HelloMessage
    if (message == undefined) {
      message = "Hello World!"
    }
    return message;
  }
}
