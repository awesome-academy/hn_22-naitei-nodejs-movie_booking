import { Controller, Post, Get, Body, Param, UseGuards, ValidationPipe, ParseIntPipe, Request } from '@nestjs/common'
import { PaymentService } from '../service/payment.service'
import { CreatePaymentDTO } from '../dto'
import { AccessTokenGuard } from 'src/shared/guards/access-token.guard'
import { ActiveUser } from 'src/shared/decorators/active-user.decorator'

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  @UseGuards(AccessTokenGuard)
  async processPayment(@Body(ValidationPipe) createPaymentDto: CreatePaymentDTO, @ActiveUser('userId') userId: number) {
    return this.paymentService.processPayment(userId, createPaymentDto)
  }

  @Get('user/:userId')
  @UseGuards(AccessTokenGuard)
  async getUserPaymentHistory(
    @Param('userId', ParseIntPipe) userId: number,
    @ActiveUser('userId') requestingUserId: number,
  ) {
    // Allow users to only view their own payment history (for security)
    // Admin users could bypass this check if role-based guards are implemented
    if (requestingUserId !== userId) {
      return this.paymentService.getUserPaymentHistory(requestingUserId)
    }

    return this.paymentService.getUserPaymentHistory(userId)
  }

  @Get(':id')
  @UseGuards(AccessTokenGuard)
  async getPaymentById(@Param('id', ParseIntPipe) id: number, @ActiveUser('userId') userId: number) {
    return this.paymentService.getPaymentById(id, userId)
  }
}
