import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.service';

@Module({
  providers: [SocketGateway],
  exports:[SocketGateway]
})
export class SocketModule {}
