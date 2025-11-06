import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  BadRequestException,
  Logger,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import * as jwt from 'jsonwebtoken';
import { LoginDto, LoginResponseDto, ChangePasswordDto, ChangePasswordResponseDto } from './dto';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

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

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
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
   * Connexion utilisateur (enseignant/parent)
   * Accepte email et mot de passe temporaire
   */
  @Post('login-user')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Connexion utilisateur (enseignant/parent)',
    description: 'Connexion pour les utilisateurs créés par l\'admin',
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
  async loginUser(@Body() dto: LoginDto): Promise<LoginResponseDto> {
    if (!this.isDev) {
      throw new BadRequestException(
        'Endpoint non disponible en production. Utiliser Supabase Auth.',
      );
    }

    // Chercher l'utilisateur dans la base de données
    const utilisateur = await this.prisma.utilisateur.findUnique({
      where: { email: dto.email },
    });

    if (!utilisateur) {
      this.logger.warn(`Tentative de connexion échouée: ${dto.email} (utilisateur non trouvé)`);
      throw new BadRequestException('Email ou mot de passe incorrect');
    }

    // DEBUG: Afficher les informations
    this.logger.log(`🔍 DEBUG - Email: ${dto.email}`);
    this.logger.log(`🔍 DEBUG - Utilisateur trouvé: ${utilisateur.email}`);
    this.logger.log(`🔍 DEBUG - tempPassword stocké: ${utilisateur.tempPassword ? '✅ OUI' : '❌ NULL'}`);
    this.logger.log(`🔍 DEBUG - Mot de passe fourni: ${dto.password}`);
    if (utilisateur.tempPassword) {
      this.logger.log(`🔍 DEBUG - tempPassword EXACT: "${utilisateur.tempPassword}"`);
      this.logger.log(`🔍 DEBUG - password EXACT: "${dto.password}"`);
      this.logger.log(`🔍 DEBUG - Longueur tempPassword: ${utilisateur.tempPassword.length}`);
      this.logger.log(`🔍 DEBUG - Longueur mot de passe fourni: ${dto.password.length}`);
      this.logger.log(`🔍 DEBUG - Correspondance: ${utilisateur.tempPassword === dto.password ? '✅ OUI' : '❌ NON'}`);

      // Afficher les codes ASCII pour chaque caractère
      this.logger.log(`🔍 DEBUG - tempPassword codes: ${Array.from(utilisateur.tempPassword).map(c => c.charCodeAt(0)).join(',')}`);
      this.logger.log(`🔍 DEBUG - password codes: ${Array.from(dto.password).map(c => c.charCodeAt(0)).join(',')}`);
    }

    // Vérifier le mot de passe temporaire (avec trim pour éviter les espaces)
    const storedPassword = utilisateur.tempPassword?.trim() || '';
    const providedPassword = dto.password?.trim() || '';

    if (storedPassword !== providedPassword) {
      this.logger.warn(`Tentative de connexion échouée: ${dto.email} (mot de passe incorrect)`);
      throw new BadRequestException('Email ou mot de passe incorrect');
    }

    this.logger.log(`Utilisateur connecté: ${dto.email} (${utilisateur.role})`);

    // Générer un JWT
    const token = jwt.sign(
      {
        email: utilisateur.email,
        role: utilisateur.role,
        userId: utilisateur.id,
      },
      this.jwtSecret,
      { expiresIn: '24h' },
    );

    return {
      accessToken: token,
      userId: utilisateur.id,
      role: utilisateur.role,
      email: utilisateur.email,
    };
  }

  /**
   * Changer le mot de passe
   */
  @Post('change-password')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Changer le mot de passe',
    description: 'Permet à un utilisateur authentifié de changer son mot de passe',
  })
  @ApiBody({ type: ChangePasswordDto })
  @ApiResponse({
    status: 200,
    description: 'Mot de passe changé avec succès',
    type: ChangePasswordResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Ancien mot de passe incorrect ou validation échouée',
  })
  @ApiResponse({
    status: 401,
    description: 'Non authentifié',
  })
  async changePassword(
    @Body() dto: ChangePasswordDto,
    @Req() req: any,
  ): Promise<ChangePasswordResponseDto> {
    const user = req.user;

    // Vérifier que les mots de passe correspondent
    if (dto.newPassword !== dto.confirmPassword) {
      throw new BadRequestException('Les mots de passe ne correspondent pas');
    }

    // Récupérer l'utilisateur
    const utilisateur = await this.prisma.utilisateur.findUnique({
      where: { id: user.userId },
    });

    if (!utilisateur) {
      throw new BadRequestException('Utilisateur non trouvé');
    }

    // Vérifier l'ancien mot de passe
    // TODO: Implémenter le hachage des mots de passe avec bcrypt
    // Pour maintenant, on compare directement (à ne pas faire en production!)
    if (utilisateur.tempPassword !== dto.oldPassword) {
      this.logger.warn(`Tentative de changement de mot de passe échouée: ${user.email} (ancien mot de passe incorrect)`);
      throw new BadRequestException('Ancien mot de passe incorrect');
    }

    // Mettre à jour le mot de passe
    await this.prisma.utilisateur.update({
      where: { id: user.userId },
      data: {
        tempPassword: dto.newPassword,
        activeLe: new Date(),
      },
    });

    this.logger.log(`Mot de passe changé: ${user.email}`);

    return {
      success: true,
      message: 'Mot de passe changé avec succès',
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

