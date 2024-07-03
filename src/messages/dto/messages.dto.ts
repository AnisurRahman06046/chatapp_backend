import { IsNotEmpty, IsString } from 'class-validator';
import mongoose from 'mongoose';
import { PartialType } from '@nestjs/mapped-types';
export class CreateMessageDto {
  @IsNotEmpty()
  senderId: mongoose.Schema.Types.ObjectId[];

  @IsNotEmpty()
  receiverId: mongoose.Schema.Types.ObjectId[];

  @IsString()
  @IsNotEmpty()
  message: string;
}

export class UpdateMessageDto extends PartialType(CreateMessageDto) {}
