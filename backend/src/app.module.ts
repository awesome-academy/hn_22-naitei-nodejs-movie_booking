import { ClassSerializerInterceptor, Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { SharedModule } from './shared/shared.module'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { AuthModule } from './tokens/auth/auth.module'
import { UserModule } from './tokens/user/user.module'

@Module({
  imports: [SharedModule,AuthModule,UserModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class AppModule {}
