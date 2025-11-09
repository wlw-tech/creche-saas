import {
  Controller,
  Get,
  Patch,
  Post,
  Param,
  Body,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { InscriptionsService } from './inscriptions.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import {
  ListInscriptionsQueryDto,
  RejectInscriptionDto,
  UpdateInscriptionStatusDto,
} from './dto/create-inscription.dto';

/**
 * Contrôleur admin pour la gestion des inscriptions
 * Endpoints protégés par JWT et rôle ADMIN
 */
@ApiTags('Admin/Inscriptions')
@Controller('admin/inscriptions')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@ApiBearerAuth()
export class InscriptionsAdminController {
  constructor(private readonly inscriptionsService: InscriptionsService) {}

  /**
   * Lister les inscriptions avec filtres
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Lister les inscriptions',
    description: 'Récupère la liste des inscriptions avec filtres et pagination',
  })
  @ApiQuery({ name: 'statut', required: false, enum: ['CANDIDATURE', 'EN_COURS', 'ACTIF', 'REJETEE'] })
  @ApiQuery({ name: 'q', required: false, description: 'Recherche dans nom/prenom enfant ou email tuteurs' })
  @ApiQuery({ name: 'dateMin', required: false, description: 'Date minimum (ISO 8601)' })
  @ApiQuery({ name: 'dateMax', required: false, description: 'Date maximum (ISO 8601)' })
  @ApiQuery({ name: 'page', required: false, type: Number, default: 1 })
  @ApiQuery({ name: 'pageSize', required: false, type: Number, default: 25 })
  async list(@Query() query: ListInscriptionsQueryDto) {
    return this.inscriptionsService.listInscriptions(query);
  }

  /**
   * Récupérer une inscription par ID
   */
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Récupérer une inscription',
    description: 'Récupère les détails complets d\'une inscription',
  })
  @ApiResponse({
    status: 200,
    description: 'Inscription trouvée',
    schema: {
      example: {
        id: 'insc_123',
        statut: 'CANDIDATURE',
        payload: {
          enfant: { prenom: 'Mohammed Amine', nom: 'Bennani', dateNaissance: '2022-06-14' },
          mere: { prenom: 'Sara', nom: 'El Idrissi', email: 'sara@mail.com' },
          pere: { prenom: 'Youssef', nom: 'Bennani', email: 'youssef@mail.com' },
        },
        notes: null,
        createdAt: '2025-11-09T10:00:00Z',
        updatedAt: '2025-11-09T10:00:00Z',
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Inscription non trouvée' })
  async getOne(@Param('id') id: string) {
    return this.inscriptionsService.getInscriptionById(id);
  }

  /**
   * Mettre à jour le statut d'une inscription
   */
  @Patch(':id/status')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Mettre à jour le statut d\'une inscription',
    description: 'Change le statut d\'une inscription (EN_COURS, ACTIF, REJETEE)',
  })
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateInscriptionStatusDto,
  ) {
    return this.inscriptionsService.updateInscriptionStatus(id, dto);
  }

  /**
   * Rejeter une inscription
   */
  @Patch(':id/reject')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Rejeter une inscription',
    description: 'Rejette une inscription avec raison',
  })
  async reject(
    @Param('id') id: string,
    @Body() dto: RejectInscriptionDto,
  ) {
    return this.inscriptionsService.rejectInscription(id, dto.raison);
  }

  /**
   * Accepter et provisionner une inscription
   */
  @Post(':id/accept')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Accepter et provisionner une inscription',
    description: 'Accepte une inscription et crée les entités (Famille, Tuteurs, Enfant, Utilisateurs)',
  })
  async accept(
    @Param('id') id: string,
    @Req() req: any,
  ) {
    return this.inscriptionsService.acceptAndProvisionInscription(id, req.user);
  }
}

