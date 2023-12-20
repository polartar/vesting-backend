import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  transports: ['websocket'],
})
export class NotificationGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log('Client connected' + client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected' + client.id);
  }

  afterInit() {
    Logger.log('init socket');
  }

  async notifyClient(event: string, data: any) {
    if (this.server) {
      this.server.emit(event, data);
    }
  }
}
