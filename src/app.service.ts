import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World ! Welcome to vtvl';
  }

  getHelloName(name: string): string {
    return `Hello ${name}!`;
  }
}
