import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { EventsService } from './events.service';
import { CreateEventDto, UpdateEventDto, ListEventsQueryDto } from './dto';

@ApiTags('Admin/Events')
@Controller('admin/events')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@ApiBearerAuth()
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @ApiOperation({ summary: 'Créer un événement' })
  @ApiResponse({
    status: 201,
    description: 'Événement créé',
    schema: {
      example: {
        id: 'evt_1',
        titre: 'Réunion parents-enseignants',
        description: 'Salle bleue',
        startAt: '2025-11-30T14:00:00Z',
        endAt: '2025-11-30T16:00:00Z',
        classeId: 'cls_1',
        status: 'PUBLISHED',
        createdAt: '2025-11-09T10:00:00Z',
      },
    },
  })
  async create(@Body() dto: CreateEventDto) {
    return this.eventsService.createEvent(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Lister les événements' })
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
            status: 'PUBLISHED',
            createdAt: '2025-11-09T10:00:00Z',
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
  async list(@Query() query: ListEventsQueryDto) {
    return this.eventsService.listEvents(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un événement' })
  @ApiResponse({
    status: 200,
    description: 'Événement trouvé',
    schema: {
      example: {
        id: 'evt_1',
        titre: 'Réunion parents-enseignants',
        description: 'Salle bleue',
        startAt: '2025-11-30T14:00:00Z',
        endAt: '2025-11-30T16:00:00Z',
        classeId: 'cls_1',
        status: 'PUBLISHED',
        createdAt: '2025-11-09T10:00:00Z',
        updatedAt: '2025-11-09T10:00:00Z',
      },
    },
  })
  async getOne(@Param('id') id: string) {
    return this.eventsService.getEventById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Modifier un événement' })
  @ApiResponse({
    status: 200,
    description: 'Événement modifié',
    schema: {
      example: {
        id: 'evt_1',
        titre: 'Réunion parents-enseignants (mise à jour)',
        description: 'Salle bleue',
        startAt: '2025-11-30T14:00:00Z',
        endAt: '2025-11-30T16:00:00Z',
        classeId: 'cls_1',
        status: 'PUBLISHED',
        updatedAt: '2025-11-09T11:00:00Z',
      },
    },
  })
  async update(@Param('id') id: string, @Body() dto: UpdateEventDto) {
    return this.eventsService.updateEvent(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Supprimer un événement' })
  @ApiResponse({
    status: 200,
    description: 'Événement supprimé',
    schema: {
      example: {
        message: 'Événement supprimé avec succès',
      },
    },
  })
  async delete(@Param('id') id: string) {
    return this.eventsService.deleteEvent(id);
  }
}

