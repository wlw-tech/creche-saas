import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { SupabaseAdminService } from '../../common/services/supabase-admin.service';
import { EmailService } from '../../common/services/email.service';

@Module({
  imports: [PrismaModule],
  controllers: [UsersController],
  providers: [UsersService, SupabaseAdminService, EmailService],
  exports: [UsersService],
})
export class UsersModule {}

