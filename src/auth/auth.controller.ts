import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/user.dto';
import { Public } from './public.route';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  //   register
  @Public()
  @Post('sign-up')
  async register(@Body() payload: CreateUserDto) {
    // console.log(payload);
    const result = await this.authService.registerUser(payload);
    return {
      message: 'User is registered successfully',
      success: 'true',
      statusCode: HttpStatus.CREATED,
      data: result,
    };
  }
  //   login
  @Public()
  @Post('sign-in')
  async login(
    @Body() payload: { email: string; hashedPassword: string },
    @Res() res: Response,
  ) {
    const result = await this.authService.login(payload, res);
    return res.status(HttpStatus.CREATED).json({
      message: 'User is logged in successfully',
      success: true,
      statusCode: HttpStatus.CREATED,
      data: result,
    });
  }
}
