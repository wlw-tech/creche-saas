import {
  Controller,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { InscriptionsAcceptService } from './inscriptions-accept.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import {
  AcceptInscriptionDto,
  RejectInscriptionDto,
  AcceptInscriptionResponseDto,
} from './dto/accept-inscription.dto';

/**
 * Contrôleur pour la gestion des inscriptions
 * Endpoints admin pour accepter/rejeter les inscriptions
 */
@ApiTags('Admin/Inscriptions')
@Controller('inscriptions')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class InscriptionsAcceptController {
  constructor(private inscriptionsService: InscriptionsAcceptService) {}

  /**
   * Accepter une inscription
   * Provisionne la famille, les tuteurs et crée les comptes parents
   */
  @Post(':id/accept')
  @Roles('ADMIN')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Accepter une inscription',
    description:
      'Accepte une inscription, provisionne la famille et crée les comptes parents',
  })
  @ApiResponse({
    status: 200,
    description: 'Inscription acceptée',
    type: AcceptInscriptionResponseDto,
    schema: {
      example: {
        inscriptionId: 'insc_123',
        statut: 'Actif',
        familleId: 'fam_123',
        enfantId: 'enf_123',
        tuteurs: [
          {
            tuteurId: 't1',
            email: 'p1@mail.com',
            invite: 'sent',
            utilisateurId: 'u1',
          },
          {
            tuteurId: 't2',
            email: 'p2@mail.com',
            invite: 'missing_email',
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Inscription non trouvée',
  })
  @ApiResponse({
    status: 400,
    description: 'Inscription ne peut pas être acceptée',
  })
  async accept(
    @Param('id') id: string,
    @Body() dto: AcceptInscriptionDto,
  ) {
    return this.inscriptionsService.acceptAndProvision(id, dto.notes);
  }

  /**
   * Rejeter une inscription
   */
  @Patch(':id/reject')
  @Roles('ADMIN')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Rejeter une inscription',
    description: 'Rejette une inscription avec raison optionnelle',
  })
  @ApiResponse({
    status: 200,
    description: 'Inscription rejetée',
    schema: {
      example: {
        inscriptionId: 'insc_123',
        statut: 'Inactif',
        raison: 'Capacité atteinte',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Inscription non trouvée',
  })
  @ApiResponse({
    status: 400,
    description: 'Inscription ne peut pas être rejetée',
  })
  async reject(
    @Param('id') id: string,
    @Body() dto: RejectInscriptionDto,
  ) {
    return this.inscriptionsService.reject(id, dto.raison);
  }
}

