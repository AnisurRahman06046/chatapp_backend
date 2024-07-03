import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Conversation } from 'src/schemas/conversations.schema';
import { Message } from 'src/schemas/messages.schema';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Message.name) private messageSchema: Model<Message>,
    @InjectModel(Conversation.name)
    private conversationSchema: Model<Conversation>,
  ) {}

  //   send message
  async sendMessage(senderId: any, receiverId: any, message: any) {
    let conversation = await this.conversationSchema.findOne({
      participants: { $all: [senderId, receiverId] },
    });
    if (!conversation) {
      conversation = await this.conversationSchema.create({
        participants: [senderId, receiverId],
      });
    }
    const newMessage = await this.messageSchema.create({
      senderId,
      receiverId,
      message,
    });

    if (newMessage) {
      conversation.messages.push(newMessage._id as any);
      await conversation.save();
    }
    return newMessage;
  }
}
