import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import * as jwt from 'jsonwebtoken';
import { LoginDto, LoginResponseDto } from './dto/login.dto';

/**
 * Contrôleur d'authentification
 * En DEV: /auth/login accepte email/password
 * En PROD: utiliser Supabase Auth
 */
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  private readonly isDev: boolean;
  private readonly adminEmail: string;
  private readonly adminPassword: string;
  private readonly jwtSecret: string;

  constructor(private configService: ConfigService) {
    this.isDev = this.configService.get('NODE_ENV') !== 'production';
    this.adminEmail = this.configService.get('ADMIN_EMAIL', 'admin@wlw.ma');
    this.adminPassword = this.configService.get('ADMIN_PASSWORD', 'change_me');
    this.jwtSecret = this.configService.get('JWT_SECRET', 'dev_secret');
  }

  /**
   * Connexion admin (DEV uniquement)
   * En PROD, utiliser Supabase Auth
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Connexion admin (DEV uniquement)',
    description:
      'Endpoint de connexion pour l\'administrateur en développement. En production, utiliser Supabase Auth.',
  })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Connexion réussie',
    type: LoginResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Identifiants invalides',
  })
  async login(@Body() dto: LoginDto): Promise<LoginResponseDto> {
    if (!this.isDev) {
      throw new BadRequestException(
        'Endpoint non disponible en production. Utiliser Supabase Auth.',
      );
    }

    // Vérifier les identifiants
    if (dto.email !== this.adminEmail || dto.password !== this.adminPassword) {
      this.logger.warn(`Tentative de connexion échouée: ${dto.email}`);
      throw new BadRequestException('Email ou mot de passe incorrect');
    }

    // Générer un JWT
    const token = jwt.sign(
      {
        email: this.adminEmail,
        role: 'ADMIN',
        userId: 'admin_dev',
      },
      this.jwtSecret,
      { expiresIn: '24h' },
    );

    this.logger.log(`Admin connecté: ${this.adminEmail}`);

    return {
      accessToken: token,
      userId: 'admin_dev',
      role: 'ADMIN',
      email: this.adminEmail,
    };
  }

  /**
   * Vérifier le token (optionnel)
   */
  @Post('verify')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Vérifier un token JWT',
  })
  @ApiResponse({
    status: 200,
    description: 'Token valide',
  })
  @ApiResponse({
    status: 401,
    description: 'Token invalide',
  })
  async verify(@Body('token') token: string) {
    try {
      const decoded = jwt.verify(token, this.jwtSecret);
      return { valid: true, decoded };
    } catch (error) {
      throw new BadRequestException('Token invalide ou expiré');
    }
  }
}

