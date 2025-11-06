import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { DailyResumesService } from './daily-resumes.service';
import { DailyResumesController } from './daily-resumes.controller';

@Module({
  imports: [PrismaModule],
  controllers: [DailyResumesController],
  providers: [DailyResumesService],
  exports: [DailyResumesService],
})
export class DailyResumesModule {}

