import { Module } from '@nestjs/common';
import { InscriptionsService } from './inscriptions.service';
import { InscriptionsController } from './inscriptions.controller';
import { InscriptionsAdminController } from './inscriptions-admin.controller';
import { InscriptionsAcceptService } from './inscriptions-accept.service';
import { InscriptionsAcceptController } from './inscriptions-accept.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { EmailService } from '../../common/services/email.service';

/**
 * Module pour les inscriptions (publiques et admin)
 */
@Module({
  imports: [PrismaModule],
  controllers: [InscriptionsController, InscriptionsAdminController, InscriptionsAcceptController],
  providers: [InscriptionsService, InscriptionsAcceptService, EmailService],
  exports: [InscriptionsService, InscriptionsAcceptService],
})
export class InscriptionsModule {}

