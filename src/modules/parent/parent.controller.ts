import {
  Controller,
  Get,
  Patch,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ParentService } from './parent.service';
import { UpdateParentMeDto, GetPresencesQueryDto, GetEventsQueryDto } from './dto';

@ApiTags('Parent')
@Controller('parent')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('PARENT')
@ApiBearerAuth()
export class ParentController {
  constructor(private readonly parentService: ParentService) {}

  @Get('me')
  @ApiOperation({ summary: 'Récupérer mon profil' })
  @ApiResponse({
    status: 200,
    description: 'Profil du tuteur avec ses enfants',
    schema: {
      example: {
        id: 'user_123',
        email: 'parent@example.com',
        prenom: 'Jean',
        nom: 'Dupont',
        telephone: '06 12 34 56 78',
        adresse: 'Rue Atlas, Marrakech',
        langue: 'fr',
        tuteurId: 'tuteur_123',
        familleId: 'fam_123',
        enfants: [
          {
            id: 'enf_1',
            prenom: 'Alice',
            nom: 'Dupont',
            dateNaissance: '2020-05-15',
            classeId: 'cls_1',
          },
        ],
      },
    },
  })
  async getMe(@Req() req: any) {
    return this.parentService.getMyProfile(req.user.userId);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Modifier mon profil' })
  @ApiResponse({
    status: 200,
    description: 'Profil mis à jour',
    schema: {
      example: {
        id: 'tuteur_123',
        prenom: 'Jean',
        nom: 'Dupont',
        telephone: '06 12 34 56 78',
        adresse: 'Rue Atlas, Marrakech',
      },
    },
  })
  async updateMe(@Req() req: any, @Body() dto: UpdateParentMeDto) {
    return this.parentService.updateMyProfile(req.user.userId, dto);
  }

  @Post('me/change-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Changer mon mot de passe' })
  @ApiResponse({
    status: 200,
    description: 'Mot de passe changé avec succès',
    schema: {
      example: {
        message: 'Mot de passe changé avec succès',
      },
    },
  })
  async changePassword(@Req() req: any, @Body() dto: any) {
    // TODO: Implémenter l'intégration Supabase
    return { message: 'Mot de passe changé avec succès' };
  }

  @Get('enfants/:enfantId/presences')
  @ApiOperation({ summary: 'Récupérer les présences de mon enfant' })
  @ApiResponse({
    status: 200,
    description: 'Liste des présences paginée',
    schema: {
      example: {
        data: [
          {
            id: 'pres_1',
            date: '2025-11-09',
            statut: 'Present',
            arriveeA: '08:30',
            departA: '17:00',
          },
        ],
        pagination: {
          page: 1,
          pageSize: 30,
          total: 100,
          hasNext: true,
        },
      },
    },
  })
  async getChildPresences(
    @Req() req: any,
    @Param('enfantId') enfantId: string,
    @Query() query: GetPresencesQueryDto,
  ) {
    return this.parentService.getChildPresences(req.user.userId, enfantId, query);
  }

  @Get('classes/:classeId/journal/latest')
  @ApiOperation({ summary: 'Récupérer le dernier résumé publié de la classe' })
  @ApiResponse({
    status: 200,
    description: 'Dernier résumé publié',
    schema: {
      example: {
        id: 'journal_1',
        date: '2025-11-09',
        activites: 'Jeux libres, peinture',
        apprentissages: 'Couleurs, formes',
        humeurGroupe: 'Excellente',
        observations: 'Groupe très actif',
        publieLe: '2025-11-09T17:00:00Z',
      },
    },
  })
  async getLatestClassJournal(
    @Req() req: any,
    @Param('classeId') classeId: string,
  ) {
    return this.parentService.getLatestClassJournal(req.user.userId, classeId);
  }

  @Get('events')
  @ApiOperation({ summary: 'Récupérer mes événements' })
  @ApiResponse({
    status: 200,
    description: 'Liste des événements paginée',
    schema: {
      example: {
        data: [
          {
            id: 'evt_1',
            titre: 'Réunion parents-enseignants',
            description: 'Salle bleue',
            startAt: '2025-11-30T14:00:00Z',
            endAt: '2025-11-30T16:00:00Z',
            classeId: 'cls_1',
          },
        ],
        pagination: {
          page: 1,
          pageSize: 20,
          total: 50,
          hasNext: true,
        },
      },
    },
  })
  async getMyEvents(@Req() req: any, @Query() query: GetEventsQueryDto) {
    return this.parentService.getMyEvents(req.user.userId, query);
  }
}

