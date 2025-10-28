import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { SupabaseAdminService } from '../../common/services/supabase-admin.service';

@Module({
  imports: [PrismaModule],
  controllers: [UsersController],
  providers: [UsersService, SupabaseAdminService],
  exports: [UsersService],
})
export class UsersModule {}

