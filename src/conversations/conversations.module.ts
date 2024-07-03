import { Module } from '@nestjs/common';
import { ConversationsController } from './conversations.controller';
import { ConversationsService } from './conversations.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Conversation,
  conversationSchema,
} from 'src/schemas/conversations.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Conversation.name, schema: conversationSchema },
    ]),
  ],
  controllers: [ConversationsController],
  providers: [ConversationsService],
  exports: [MongooseModule],
})
export class ConversationsModule {}
