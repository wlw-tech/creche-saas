// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { PrismaModule } from './prisma/prisma.module';
import { ClassesModule } from './modules/classes/classes.module';
import { FamillesModule } from './modules/familles/familles.module';

@Module({
  imports: [
    // Lit .env et expose ConfigService partout
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    PrismaModule,
    ClassesModule,
    FamillesModule,
  ],
})
export class AppModule {}
