import { Controller, Get, Post, Query, UseGuards, Req, Logger, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery, ApiBody } from '@nestjs/swagger';
import { PresencesService } from './presences.service';
import { GetPresencesQueryDto, GetPresencesResponseDto, CreatePresenceDto, CreatePresenceResponseDto, RecordClassPresencesDto, RecordClassPresencesResponseDto } from './dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { RoleUtilisateur } from '@prisma/client';

@ApiTags('Presences')
@Controller('presences')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class PresencesController {
  private readonly logger = new Logger(PresencesController.name);

  constructor(private presencesService: PresencesService) {}

  @Get()
  @Roles(RoleUtilisateur.ADMIN, RoleUtilisateur.ENSEIGNANT, RoleUtilisateur.PARENT)
  @ApiOperation({
    summary: 'Consulter les présences',
    description: 'Récupère les présences avec filtres et pagination. RBAC: ADMIN (toutes), TEACHER (ses classes), PARENT (ses enfants)',
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des présences',
    type: GetPresencesResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Non authentifié',
  })
  @ApiResponse({
    status: 403,
    description: 'Accès refusé',
  })
  @ApiQuery({
    name: 'date',
    required: false,
    example: '2025-11-06',
    description: 'Date spécifique (YYYY-MM-DD)',
  })
  @ApiQuery({
    name: 'dateMin',
    required: false,
    example: '2025-11-01',
    description: 'Date minimum (YYYY-MM-DD)',
  })
  @ApiQuery({
    name: 'dateMax',
    required: false,
    example: '2025-11-30',
    description: 'Date maximum (YYYY-MM-DD)',
  })
  @ApiQuery({
    name: 'classeId',
    required: false,
    example: 'cls_123',
    description: 'ID de la classe',
  })
  @ApiQuery({
    name: 'enfantId',
    required: false,
    example: 'enf_456',
    description: 'ID de l\'enfant',
  })
  @ApiQuery({
    name: 'statut',
    required: false,
    enum: ['Present', 'Absent', 'Justifie'],
    description: 'Statut de présence',
  })
  @ApiQuery({
    name: 'q',
    required: false,
    example: 'Lina',
    description: 'Recherche sur nom/prénom',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    example: 1,
    description: 'Numéro de page',
  })
  @ApiQuery({
    name: 'pageSize',
    required: false,
    example: 25,
    description: 'Nombre d\'éléments par page (max 200)',
  })
  async getPresences(
    @Query() query: GetPresencesQueryDto,
    @Req() req: any,
  ): Promise<GetPresencesResponseDto> {
    const user = req.user;
    this.logger.log(
      `Récupération des présences - User: ${user.email} (${user.role}), Filters: ${JSON.stringify(query)}`,
    );

    return this.presencesService.findMany(query, user);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(RoleUtilisateur.ADMIN, RoleUtilisateur.ENSEIGNANT)
  @ApiOperation({
    summary: 'Enregistrer une présence',
    description: 'Enregistre ou met à jour la présence d\'un enfant. RBAC: ADMIN (tous), TEACHER (ses classes)',
  })
  @ApiBody({ type: CreatePresenceDto })
  @ApiResponse({
    status: 201,
    description: 'Présence enregistrée',
    type: CreatePresenceResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Données invalides',
  })
  @ApiResponse({
    status: 401,
    description: 'Non authentifié',
  })
  @ApiResponse({
    status: 403,
    description: 'Accès refusé',
  })
  async createPresence(
    @Body() dto: CreatePresenceDto,
    @Req() req: any,
  ): Promise<CreatePresenceResponseDto> {
    const user = req.user;
    this.logger.log(
      `Enregistrement de présence - User: ${user.email}, Enfant: ${dto.enfantId}, Date: ${dto.date}, Statut: ${dto.statut}`,
    );

    return this.presencesService.createOrUpdatePresence(
      dto.enfantId,
      dto.date,
      dto.statut,
      dto.arriveeA,
      dto.departA,
      user,
    );
  }

  @Post('class')
  @HttpCode(HttpStatus.CREATED)
  @Roles(RoleUtilisateur.ADMIN, RoleUtilisateur.ENSEIGNANT)
  @ApiOperation({
    summary: 'Enregistrer les présences d\'une classe',
    description: 'Enregistre les présences de tous les enfants d\'une classe pour une date donnée. RBAC: ADMIN (tous), TEACHER (ses classes)',
  })
  @ApiBody({ type: RecordClassPresencesDto })
  @ApiResponse({
    status: 201,
    description: 'Présences enregistrées',
    type: RecordClassPresencesResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Données invalides',
  })
  @ApiResponse({
    status: 401,
    description: 'Non authentifié',
  })
  @ApiResponse({
    status: 403,
    description: 'Accès refusé',
  })
  async recordClassPresences(
    @Body() dto: RecordClassPresencesDto,
    @Req() req: any,
  ): Promise<RecordClassPresencesResponseDto> {
    const user = req.user;
    this.logger.log(
      `Enregistrement des présences de classe - User: ${user.email}, Classe: ${dto.classeId}, Date: ${dto.date}, Nombre: ${dto.presences.length}`,
    );

    const results = await this.presencesService.recordClassPresences(
      dto.classeId,
      dto.date,
      dto.presences,
      user,
    );

    return {
      count: results.length,
      date: dto.date,
      classeId: dto.classeId,
      message: `${results.length} présences enregistrées avec succès`,
    };
  }
}

