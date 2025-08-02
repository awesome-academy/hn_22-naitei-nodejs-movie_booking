import { Injectable, NotFoundException, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { EmailService } from '../../shared/services/email.service';
import { ChangePasswordBodyDTO, ForgotPasswordBodyDTO, SendOtpBodyDTO, UpdateMeBodyDTO } from './user.dto';
import envConfig from '../../shared/config';
import { addMilliseconds } from 'date-fns'
import ms from 'ms'
import { generateOTP } from '../../shared/helpers';
import { VerificationCode, VerificationCodeType } from '../../shared/constants/auth.constant';
import { UserRepository } from './user.repo';
import { HashingService } from '../../shared/services/hashing.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(
    private readonly emailService: EmailService,
    private readonly userRepository: UserRepository,
    private readonly hashingService: HashingService
  ) { }

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

  //hàm kiểm tra xem mã OTP đã hết hạn chưa
  async validateVerificationCode({
    email,
    code,
    type,
  }: {
    email: string
    code: string
    type: VerificationCodeType
  }) {
    const vevificationCode = await this.userRepository.findUniqueVerificationCode({
      email_code_type: {
        email,
        code,
        type,
      }
    })
    if (!vevificationCode) {
      throw new UnprocessableEntityException([
        {
          message: 'Mã OTP không hợp lệ',
          path: 'code',
        },
      ])
    }
    if (vevificationCode.expiresAt < new Date()) {
      throw new UnprocessableEntityException([
        {
          message: 'Mã OTP đã hết hạn',
          path: 'code',
        },
      ])
    }
    return vevificationCode
  }

  async forgotPassword(body: ForgotPasswordBodyDTO) {
    const { email, code, newPassword } = body
    // 1. Kiểm tra email đã tồn tại trong database chưa
    const user = await this.userRepository.findUnique({
      email,
    })
    if (!user) {
      throw new UnprocessableEntityException([
        {
          message: 'Email không tồn tại',
          path: 'email',
        },
      ])
    }

    //2. Kiểm tra mã OTP có hợp lệ không
    await this.validateVerificationCode({
      email,
      code,
      type: VerificationCode.FORGOT_PASSWORD
    })
    //3. Cập nhật lại mật khẩu mới và xóa đi OTP
    const hashedPassword = await this.hashingService.hash(newPassword)
    await Promise.all([
      this.userRepository.updateUser(
        { id: user.id },
        {
          password: hashedPassword,
        },
      ),
      this.userRepository.deleteVerificationCode({
        email_code_type: {
          email: body.email,
          code: body.code,
          type: VerificationCode.FORGOT_PASSWORD,
        }
      }),
    ])
    return {
      message: 'Đổi mật khẩu thành công',
    }
  }

  // hàm update thông tin
  async updateProfile({ userId, body }: { userId: number; body: UpdateMeBodyDTO }) {
    try {
      return await this.userRepository.updateUser(
        {
          id: userId,
          deletedAt: null
        },
        {
          ...body,
          updatedById: userId,
        },
      )
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new NotFoundException(`Không tìm thấy user cần update có id là :${userId}`)
      }
      throw error
    }
  }

  // hàm đổi password
  async changePassword({ userId, body }: { userId: number; body: Omit<ChangePasswordBodyDTO, 'confirmNewPassword'> }) {
    try {
      const { password, newPassword } = body
      const user = await this.userRepository.findUnique({
        id: userId,
        deletedAt: null,
      })
      if (!user) {
        throw new NotFoundException("Không tìm thấy user!")
      }
      //so sánh password cũ và password hiện tại điền
      const isPasswordMatch = await this.hashingService.compare(password, user.password)
      if (!isPasswordMatch) {
        throw new UnauthorizedException('Mật khẩu hiện tại không đúng');
      }
      //hashing password mới
      const hashedPassword = await this.hashingService.hash(newPassword)

      await this.userRepository.updateUser(
        {
          id: userId,
          deletedAt: null
        },
        {
          password: hashedPassword,
          updatedById: userId,
        },
      )
      return {
        message: 'Thay đổi mật khẩu thành công !',
      }
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new NotFoundException(`Không tìm thấy user cần update có id là :${userId}`)
      }
      throw error
    }
  }
}
