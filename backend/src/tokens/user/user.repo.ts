import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../shared/services/prisma.service';
import { UserDto } from '../../shared/models/user.model';
import { VerifyOtpCodeDTO } from './user.dto';

@Injectable()

export class UserRepository {
  constructor(private readonly prismaService: PrismaService) { }

  // hàm tìm theo email or id 
  async findUnique(uniqueObject: { email: string } | { id: number }): Promise<UserDto | null> {
    return this.prismaService.user.findUnique({
      where: uniqueObject,
    })
  }

  async createVerificationCode(
    payload: Pick<VerifyOtpCodeDTO, 'email' | 'type' | 'code' | 'expiresAt'>,
  ): Promise<VerifyOtpCodeDTO> {
    return this.prismaService.verifyOtpCode.upsert({
      where: {
        email_code_type: {
          email: payload.email,
          code: payload.code,
          type: payload.type,
        },
      },
      create: payload,
      update: {
        code: payload.code,
        expiresAt: payload.expiresAt,
      },
    })
  }
}
