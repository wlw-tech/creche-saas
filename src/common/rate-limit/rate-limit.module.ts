import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';

/**
 * Module de rate-limiting
 * Utilise @nestjs/throttler pour limiter les requêtes par IP
 * Configuration: 20 requêtes par 60 secondes par IP
 */
@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 60 secondes en millisecondes
        limit: 20, // 20 requêtes max
      },
    ]),
  ],
  exports: [ThrottlerModule],
})
export class RateLimitModule {}

