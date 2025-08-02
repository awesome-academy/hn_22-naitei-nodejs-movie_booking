import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { EmailService } from '../../shared/services/email.service';
import { SendOtpBodyDTO } from './user.dto';
import envConfig from '../../shared/config';
import { addMilliseconds } from 'date-fns'
import ms from 'ms'
import { generateOTP } from '../../shared/helpers';
import { VerificationCode } from '../../shared/constants/auth.constant';
import { UserRepository } from './user.repo';

@Injectable()
export class UserService {
  constructor(
    private readonly emailService: EmailService,
    private readonly userRepository:UserRepository
  ){}

  async sendOTP(body: SendOtpBodyDTO) {
    // 1. Kiểm tra email đã tồn tại trong database chưa
    const user = await this.userRepository.findUnique({
      email: body.email,
    })

    //nếu chọn quên mật khẩu và chưa có user,đưa ra thông báo lỗi
    if (body.type === VerificationCode.FORGOT_PASSWORD && !user) {
      throw new UnprocessableEntityException([
        {
          message: 'Email không tồn tại',
          path: 'email',
        },
      ])
    }

    // 2. Tạo mã OTP
    const code = generateOTP()
    const verificationCode = this.userRepository.createVerificationCode({
      email: body.email,
      code,
      type: body.type,
      expiresAt: addMilliseconds(new Date(), ms(envConfig.OTP_EXPIRES_IN)),
    })

    // 3. Gửi mã OTP
    const { error } = await this.emailService.sendOTP({
      email: body.email,
      code,
    })
    if (error) {
      throw new UnprocessableEntityException([
        {
          message: 'Gửi mã OTP thất bại',
          path: 'code',
        },
      ])
    }
    return verificationCode
  }
}
