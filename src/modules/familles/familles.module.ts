import { Module } from '@nestjs/common';
import { FamillesService } from './familles.service';
import { FamillesController } from './familles.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [FamillesController],
  providers: [FamillesService],
  exports: [FamillesService],
})
export class FamillesModule {}

