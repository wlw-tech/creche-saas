// src/health/health.controller.ts
import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('health')
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async health() {
    // si la DB est OK, cette requête passe
    await this.prisma.$queryRaw`SELECT 1`;
    return { status: 'ok' };
  }
}
