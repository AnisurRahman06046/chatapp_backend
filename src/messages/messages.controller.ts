import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Request,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { Roles } from 'src/auth/roles.decorator';
import { UserRoles } from 'src/user/constants/users.constant';

@Controller('messages')
export class MessagesController {
  constructor(private messageServices: MessagesService) {}

  @Roles(UserRoles.USER)
  @Post('sendMessage/:id')
  async sendMessage(
    @Body() data: any,
    @Param('id') id: any,
    @Request() req: any,
  ) {
    // const message = data;
    console.log(data);
    const senderId = req.user._id;
    const receiverId = id;
    // console.log(senderId,receiverId)
    const result = await this.messageServices.sendMessage(
      senderId,
      receiverId,
      data.message,
    );
    return {
      success: 'true',
      statusCode: HttpStatus.OK,
      data: result,
    };
  }

  // get messages
  @Roles(UserRoles.USER)
  @Get('messages/:id')
  async getMessages(@Param('id') id: string, @Request() req: any) {
    const receiverId = id;
    const senderId = req.user._id;
    const result = await this.messageServices.getMessages(senderId, receiverId);
    return {
      success: 'true',
      statusCode: HttpStatus.OK,
      data: result,
    };
  }
}
