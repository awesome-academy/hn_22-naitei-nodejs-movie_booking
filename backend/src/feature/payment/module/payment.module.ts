import { Module } from '@nestjs/common'
import { PaymentService } from '../service/payment.service'
import { PaymentController } from '../controller/payment.controller'
import { PaymentRepository } from '../repo/payment.repo'
import { SharedModule } from '../../../shared/shared.module'

@Module({
  imports: [SharedModule],
  controllers: [PaymentController],
  providers: [PaymentService, PaymentRepository],
  exports: [PaymentService, PaymentRepository],
})
export class PaymentModule {}
