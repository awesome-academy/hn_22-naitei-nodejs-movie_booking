import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from './user.repo';

@Module({
  controllers: [UserController],
  providers: [UserService,UserRepository]
})
export class UserModule {}
