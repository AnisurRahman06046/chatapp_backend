import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from './users.schema';
import { Message } from './messages.schema';

@Schema({ timestamps: true })
export class Conversation {
  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    required: true,
  })
  participants: User[];

  @Prop({
    type: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'Message', default: [] },
    ],
    required: true,
  })
  messages: Message[];
}

export const conversationSchema = SchemaFactory.createForClass(Conversation);
