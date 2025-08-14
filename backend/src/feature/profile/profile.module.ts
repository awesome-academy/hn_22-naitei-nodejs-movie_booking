import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { UserService } from './profile.service';
import { ProfileRepository } from './profile.repo';

@Module({
  controllers: [ProfileController],
  providers: [UserService,ProfileRepository]
})
export class ProfileModule {}
