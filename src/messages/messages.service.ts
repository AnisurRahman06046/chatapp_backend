// import { Injectable } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import { Conversation } from 'src/schemas/conversations.schema';
// import { Message } from 'src/schemas/messages.schema';

// @Injectable()
// export class MessagesService {
//   constructor(
//     @InjectModel(Message.name) private messageSchema: Model<Message>,
//     @InjectModel(Conversation.name)
//     private conversationSchema: Model<Conversation>,
//   ) {}

//   //   send message
//   async sendMessage(senderId: any, receiverId: any, message: any) {
//     let conversation = await this.conversationSchema.findOne({
//       participants: { $all: [senderId, receiverId] },
//     });
//     if (!conversation) {
//       conversation = await this.conversationSchema.create({
//         participants: [senderId, receiverId],
//       });
//     }
//     const newMessage = await this.messageSchema.create({
//       senderId,
//       receiverId,
//       message,
//     });

//     if (newMessage) {
//       conversation.messages.push(newMessage._id as any);
//       await conversation.save();
//     }
//     return newMessage;
//   }

//   // async sendMessage(
//   //   senderId: mongoose.Schema.Types.ObjectId,
//   //   receiverId: mongoose.Schema.Types.ObjectId,
//   //   message: string,
//   // ) {
//   //   const session = await this.conversationSchema.startSession();
//   //   session.startTransaction();

//   //   try {
//   //     let conversation = await this.conversationSchema
//   //       .findOne({
//   //         participants: { $all: [senderId, receiverId] },
//   //       })
//   //       .session(session);

//   //     if (!conversation) {
//   //       conversation = new this.conversationSchema({
//   //         participants: [senderId, receiverId],
//   //       });
//   //       await conversation.save({ session });
//   //     }

//   //     const newMessage = new this.messageSchema({
//   //       senderId,
//   //       receiverId,
//   //       message,
//   //     });
//   //     await newMessage.save({ session });

//   //     conversation.messages.push(newMessage._id as any);
//   //     await conversation.save({ session });

//   //     await session.commitTransaction();
//   //     session.endSession();

//   //     return newMessage;
//   //   } catch (error) {
//   //     await session.abortTransaction();
//   //     session.endSession();
//   //     throw error;
//   //   }
//   // }

//   // get messages
//   async getMessages(senderId: any, receiverId: any) {
//     const conversation = await this.conversationSchema
//       .findOne({
//         participants: { $all: [senderId, receiverId] },
//       })
//       .populate('messages');
//     if (!conversation) return [];
//     return conversation;
//   }
// }

// import { Injectable } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import { MessagesGateway } from 'src/gateway/gateway';
// import { Conversation } from 'src/schemas/conversations.schema';
// import { Message } from 'src/schemas/messages.schema';

// @Injectable()
// export class MessagesService {
//   constructor(
//     @InjectModel(Message.name) private messageSchema: Model<Message>,
//     @InjectModel(Conversation.name)
//     private conversationSchema: Model<Conversation>,
//     private messagesGateway: MessagesGateway,
//   ) {}

//   async sendMessage(senderId: any, receiverId: any, message: any) {
//     let conversation = await this.conversationSchema.findOne({
//       participants: { $all: [senderId, receiverId] },
//     });
//     if (!conversation) {
//       conversation = await this.conversationSchema.create({
//         participants: [senderId, receiverId],
//       });
//     }
//     const newMessage = await this.messageSchema.create({
//       senderId,
//       receiverId,
//       message,
//     });

//     if (newMessage) {
//       conversation.messages.push(newMessage._id as any);
//       await conversation.save();
//     }

//     const receiverSocketId = this.messagesGateway.getReceiverSocketId(receiverId);
//     if (receiverSocketId) {
//       this.messagesGateway.server.to(receiverSocketId).emit('message', newMessage);
//     }

//     return newMessage;
//   }

//   async getMessages(senderId: any, receiverId: any) {
//     const conversation = await this.conversationSchema
//       .findOne({
//         participants: { $all: [senderId, receiverId] },
//       })
//       .populate('messages');
//     if (!conversation) return [];
//     return conversation;
//   }
// }

// src/messages/messages.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MessagesGateway } from 'src/gateway/gateway';

import { Conversation } from 'src/schemas/conversations.schema';
import { Message } from 'src/schemas/messages.schema';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Message.name) private messageSchema: Model<Message>,
    @InjectModel(Conversation.name)
    private conversationSchema: Model<Conversation>,
    private messagesGateway: MessagesGateway,
  ) {}

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

    const receiverSocketId =
      this.messagesGateway.getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      this.messagesGateway.server
        .to(receiverSocketId)
        .emit('newMessage', newMessage);
    }

    return newMessage;
  }

  async getMessages(senderId: any, receiverId: any) {
    const conversation = await this.conversationSchema
      .findOne({
        participants: { $all: [senderId, receiverId] },
      })
      .populate('messages');
    if (!conversation) return [];
    return conversation;
  }
}
