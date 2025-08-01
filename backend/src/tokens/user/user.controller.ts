import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { ForgotPasswordBodyDTO, ForgotPasswordResDTO, SendOtpBodyDTO } from './user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post('send-otp')
  sendOTP(@Body() body: SendOtpBodyDTO) {
    return this.userService.sendOTP(body)
  }

  @Post('forgot-password')
  async forgotPassword(@Body() body: ForgotPasswordBodyDTO) {
    return new ForgotPasswordResDTO(await this.userService.forgotPassword(body))
  }
}
