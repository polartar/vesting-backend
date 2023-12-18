import { Module } from '@nestjs/common';
import { ListenerService } from './listener.service';
import { NotificationGateway } from 'src/notification/notification.gateway';

@Module({
  providers: [ListenerService, NotificationGateway],
})
export class ListenerModule {}
