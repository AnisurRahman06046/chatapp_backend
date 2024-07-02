import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Gender, UserRoles } from 'src/user/constants/users.constant';

@Schema({ timestamps: true })
export class User {
  @Prop({ required: [true, 'First Name is required'] })
  firstName: string;
  @Prop({ required: [true, 'Last Name is required'] })
  lastName: string;
  @Prop({ required: [true, 'User Name is required'] })
  userName: string;
  @Prop({ required: [true, 'Email is required'], unique: true })
  email: string;

  @Prop({ required: [true, 'Gender is required'], enum: Gender })
  gender: string;

  @Prop({ required: [true, 'Email is required'] })
  hashedPassword: string;
  @Prop({ type: String, enum: UserRoles, default: UserRoles.USER })
  role: UserRoles;

  @Prop({ default: '' })
  profilePic: string;
  @Prop({ default: false })
  isDeleted: boolean;
}

export const userSchema = SchemaFactory.createForClass(User);
