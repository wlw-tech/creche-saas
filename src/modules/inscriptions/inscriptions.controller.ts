import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiCreatedResponse, ApiBadRequestResponse } from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';
import { InscriptionsService } from './inscriptions.service';
import { CreateInscriptionDto } from './dto/create-inscription.dto';

/**
 * Contrôleur pour les inscriptions publiques
 * Endpoint public avec rate-limit et captcha placeholder
 */
@ApiTags('Public/Inscriptions')
@Controller('public/inscriptions')
export class InscriptionsController {
  constructor(private readonly inscriptionsService: InscriptionsService) {}

  /**
   * Créer une nouvelle inscription (candidature)
   * Endpoint public - protégé par rate-limit et captcha placeholder
   *
   * @param createInscriptionDto Données d'inscription
   * @returns { applicationId, statut }
   */
  @Post()
  @UseGuards(ThrottlerGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Créer une nouvelle inscription',
    description:
      'Endpoint public pour créer une inscription. Crée en une transaction : Famille (upsert), Tuteur(s), Enfant, Inscription (statut=Candidature). Protégé par rate-limit (20 req/min/IP) et captcha placeholder.',
  })
  @ApiCreatedResponse({
    description: 'Inscription créée avec succès',
    schema: {
      example: {
        applicationId: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
        statut: 'Candidature',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Données invalides ou classe non trouvée',
    schema: {
      example: {
        statusCode: 400,
        message: 'Classe avec l\'ID ... non trouvée',
        error: 'Bad Request',
      },
    },
  })
  async create(@Body() createInscriptionDto: CreateInscriptionDto) {
    return this.inscriptionsService.apply(createInscriptionDto);
  }
}

