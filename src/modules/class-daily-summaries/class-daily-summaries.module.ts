import { Module } from '@nestjs/common';
import { ClassDailySummariesService } from './class-daily-summaries.service';
import { ClassDailySummariesController } from './class-daily-summaries.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [ClassDailySummariesService],
  controllers: [ClassDailySummariesController],
})
export class ClassDailySummariesModule {}

