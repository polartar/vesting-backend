import { Logger } from '@nestjs/common';
import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Server, Socket } from 'socket.io';

@WebSocketGateway(5000, {
  transports: ['websocket'],
})
export class NotificationGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log('Client connected2' + client.id);
    client.emit('test', { text: 'test payload' });
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected' + client.id);
  }

  afterInit() {
    Logger.log('init socket');
  }

  async notifyClient(event: string, data: any) {
    this.server.emit(event, data);
  }
}
