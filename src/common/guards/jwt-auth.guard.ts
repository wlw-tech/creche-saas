import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

/**
 * Guard JWT pour authentifier les requêtes
 * En PROD: valide le JWT Supabase
 * En DEV: accepte les JWT locaux ou fallback admin
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly logger = new Logger(JwtAuthGuard.name);
  private readonly isDev: boolean;
  private readonly jwtSecret: string;

  constructor(private configService: ConfigService) {
    this.isDev = this.configService.get('NODE_ENV') !== 'production';
    this.jwtSecret = this.configService.get('JWT_SECRET', 'dev_secret');
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractToken(request);

    if (!token) {
      throw new UnauthorizedException('Token manquant');
    }

    try {
      const decoded = this.verifyToken(token);
      request.user = decoded;
      return true;
    } catch (error) {
      this.logger.error(`Erreur validation JWT: ${error.message}`);
      throw new UnauthorizedException('Token invalide ou expiré');
    }
  }

  private extractToken(request: any): string | null {
    const authHeader = request.headers.authorization;
    if (!authHeader) return null;

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return null;
    }

    return parts[1];
  }

  private verifyToken(token: string): any {
    if (this.isDev) {
      // En DEV, accepter les JWT locaux
      try {
        return jwt.verify(token, this.jwtSecret, { ignoreExpiration: true });
      } catch (error) {
        this.logger.debug('JWT local invalide, tentative Supabase...');
      }
    }

    // En PROD ou si JWT local échoue, valider Supabase
    // TODO: Implémenter la validation Supabase JWT
    // const jwksUrl = this.configService.get('SUPABASE_JWKS_URL');
    // const decoded = jwt.decode(token, { complete: true });
    // Valider la signature avec JWKS...

    // Pour l'instant, accepter en DEV
    if (this.isDev) {
      return jwt.decode(token);
    }

    throw new UnauthorizedException('Validation JWT Supabase non configurée');
  }
}

