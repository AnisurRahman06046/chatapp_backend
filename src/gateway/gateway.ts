// // messages.gateway.ts
// import {
//   SubscribeMessage,
//   WebSocketGateway,
//   WebSocketServer,
//   OnGatewayInit,
//   OnGatewayConnection,
//   OnGatewayDisconnect,
// } from '@nestjs/websockets';
// import { Server, Socket } from 'socket.io';

// @WebSocketGateway({
//   cors: {
//     origin: 'http://localhost:3000',
//     methods: ['GET', 'POST'],
//   },
// })
// export class MessagesGateway
//   implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
// {
//   @WebSocketServer() server: Server;

//   private userSocketMap: { [userId: string]: string } = {};

//   afterInit(server: Server) {
//     console.log('WebSocket initialized');
//   }

//   handleConnection(socket: Socket) {
//     console.log('User connected', socket.id);
//     const userId = socket.handshake.query.userId as string;
//     if (userId !== 'undefined') {
//       this.userSocketMap[userId] = socket.id;
//     }

//     this.server.emit('getOnlineUsers', Object.keys(this.userSocketMap));
//   }

//   handleDisconnect(socket: Socket) {
//     console.log('User disconnected', socket.id);
//     const userId = Object.keys(this.userSocketMap).find(
//       (key) => this.userSocketMap[key] === socket.id,
//     );
//     if (userId) {
//       delete this.userSocketMap[userId];
//     }

//     this.server.emit('getOnlineUsers', Object.keys(this.userSocketMap));
//   }

//   @SubscribeMessage('message')
//   handleMessage(client: Socket, payload: any): void {
//     console.log('Message received:', payload);
//     // Broadcast the message to the recipient
//     const receiverSocketId = this.userSocketMap[payload.receiverId];
//     if (receiverSocketId) {
//       this.server.to(receiverSocketId).emit('message', payload);
//     }
//   }

//   getReceiverSocketId(receiverId: string): string | undefined {
//     return this.userSocketMap[receiverId];
//   }
// }

// src/gateway/messages.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*', // or specify your client URL
  },
})
export class MessagesGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private userSocketMap: { [userId: string]: string } = {};

  handleConnection(socket: Socket) {
    const userId = socket.handshake.query.userId as string;
    if (userId) {
      this.userSocketMap[userId] = socket.id;
      this.server.emit('getOnlineUsers', Object.keys(this.userSocketMap));
    }
  }

  handleDisconnect(socket: Socket) {
    const userId = Object.keys(this.userSocketMap).find(
      (key) => this.userSocketMap[key] === socket.id,
    );
    if (userId) {
      delete this.userSocketMap[userId];
      this.server.emit('getOnlineUsers', Object.keys(this.userSocketMap));
    }
  }

  getReceiverSocketId(receiverId: string): string {
    return this.userSocketMap[receiverId];
  }

  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: any): void {
    const receiverSocketId = this.getReceiverSocketId(payload.receiverId);
    if (receiverSocketId) {
      this.server.to(receiverSocketId).emit('message', payload);
    }
  }
}
