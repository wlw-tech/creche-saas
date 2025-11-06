// src/app.module.ts
import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { PrismaModule } from './prisma/prisma.module';
import { ClassesModule } from './modules/classes/classes.module';
import { FamillesModule } from './modules/familles/familles.module';
import { InscriptionsModule } from './modules/inscriptions/inscriptions.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { PresencesModule } from './modules/presences/presences.module';
import { MenusModule } from './modules/menus/menus.module';
import { DailyResumesModule } from './modules/daily-resumes/daily-resumes.module';
import { ClassDailySummariesModule } from './modules/class-daily-summaries/class-daily-summaries.module';
import { RateLimitModule } from './common/rate-limit/rate-limit.module';
import { CaptchaPlaceholderMiddleware } from './common/middlewares/captcha-placeholder.middleware';

@Module({
  imports: [
    // Lit .env et expose ConfigService partout
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    PrismaModule,
    RateLimitModule,
    ClassesModule,
    FamillesModule,
    InscriptionsModule,
    AuthModule,
    UsersModule,
    PresencesModule,
    MenusModule,
    DailyResumesModule,
    ClassDailySummariesModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Appliquer le middleware captcha placeholder sur /api/public/inscriptions
    consumer
      .apply(CaptchaPlaceholderMiddleware)
      .forRoutes('api/public/inscriptions');
  }
}
