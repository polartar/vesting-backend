import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World !!';
  }

  getHelloName(name: string): string {
    return `Hello There ${name}!`;
  }

  getHealth(): string {
    return 'LIVE';
  }
}
