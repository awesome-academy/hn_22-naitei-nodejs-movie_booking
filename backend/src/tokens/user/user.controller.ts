import { Body, Controller, Post, Put, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { ChangePasswordBodyDTO, ChangePasswordResDTO, ForgotPasswordBodyDTO, ForgotPasswordResDTO, SendOtpBodyDTO, UpdateMeBodyDTO, UpdateMeResDTO } from './user.dto';
import { ActiveUser } from '../../shared/decorators/active-user.decorator';
import { AccessTokenGuard } from '../../shared/guards/access-token.guard';

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

  @UseGuards(AccessTokenGuard)
  @Put('update-profile')
  async updateProfile(@Body() body: UpdateMeBodyDTO, @ActiveUser('userId') userId: number) {
    return new UpdateMeResDTO(await this.userService.updateProfile({
      userId,
      body
    }))
  }
  
  @UseGuards(AccessTokenGuard)
  @Put('change-password')
  async changePassword(@Body() body: ChangePasswordBodyDTO, @ActiveUser('userId') userId: number) {
    return new ChangePasswordResDTO(await this.userService.changePassword({
      userId,
      body,
    })
    )
  }
}
