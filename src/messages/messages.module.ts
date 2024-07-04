import { Module } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, messageScehma } from 'src/schemas/messages.schema';
import { ConversationsModule } from 'src/conversations/conversations.module';
import { MessagesGateway } from 'src/gateway/gateway';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Message.name, schema: messageScehma }]),
    ConversationsModule,
  ],
  controllers: [MessagesController],
  providers: [MessagesService, MessagesGateway],
})
export class MessagesModule {}
