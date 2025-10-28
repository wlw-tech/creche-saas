import { Module } from '@nestjs/common';
import { InscriptionsService } from './inscriptions.service';
import { InscriptionsController } from './inscriptions.controller';
import { InscriptionsAcceptService } from './inscriptions-accept.service';
import { InscriptionsAcceptController } from './inscriptions-accept.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { SupabaseAdminService } from '../../common/services/supabase-admin.service';

/**
 * Module pour les inscriptions (publiques et admin)
 */
@Module({
  imports: [PrismaModule],
  controllers: [InscriptionsController, InscriptionsAcceptController],
  providers: [InscriptionsService, InscriptionsAcceptService, SupabaseAdminService],
  exports: [InscriptionsService, InscriptionsAcceptService],
})
export class InscriptionsModule {}

