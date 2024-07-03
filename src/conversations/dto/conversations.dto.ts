import { IsArray, IsNotEmpty } from 'class-validator';

import { PartialType } from '@nestjs/mapped-types';
import mongoose from 'mongoose';

export class CreateConversationDto {
  @IsArray()
  @IsNotEmpty()
  participants: mongoose.Schema.Types.ObjectId[];

  @IsArray()
  @IsNotEmpty()
  messages: mongoose.Schema.Types.ObjectId[];
}

export class UpdateConversationDto extends PartialType(CreateConversationDto) {}
