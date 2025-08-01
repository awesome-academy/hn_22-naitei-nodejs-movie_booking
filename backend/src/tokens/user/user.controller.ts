import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { SendOtpBodyDTO } from './user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post('send-otp')
  sendOTP(@Body() body: SendOtpBodyDTO) {
    return this.userService.sendOTP(body)
  }
}
