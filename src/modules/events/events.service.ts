import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateEventDto, UpdateEventDto, ListEventsQueryDto } from './dto';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Crée un nouvel événement
   */
  async createEvent(dto: CreateEventDto) {
    // Vérifier que la classe existe
    const classe = await this.prisma.classe.findUnique({
      where: { id: dto.classeId },
    });

    if (!classe) {
      throw new NotFoundException('Classe non trouvée');
    }

    // Vérifier que startAt < endAt
    const startAt = new Date(dto.startAt);
    const endAt = new Date(dto.endAt);

    if (startAt >= endAt) {
      throw new BadRequestException('startAt doit être avant endAt');
    }

    const event = await this.prisma.event.create({
      data: {
        titre: dto.titre,
        description: dto.description,
        startAt,
        endAt,
        classeId: dto.classeId,
        status: 'PUBLISHED',
      },
    });

    return {
      id: event.id,
      titre: event.titre,
      description: event.description,
      startAt: event.startAt,
      endAt: event.endAt,
      classeId: event.classeId,
      status: event.status,
      createdAt: event.createdAt,
    };
  }

  /**
   * Met à jour un événement
   */
  async updateEvent(id: string, dto: UpdateEventDto) {
    const event = await this.prisma.event.findUnique({
      where: { id },
    });

    if (!event) {
      throw new NotFoundException('Événement non trouvé');
    }

    // Vérifier les dates si elles sont fournies
    if (dto.startAt && dto.endAt) {
      const startAt = new Date(dto.startAt);
      const endAt = new Date(dto.endAt);

      if (startAt >= endAt) {
        throw new BadRequestException('startAt doit être avant endAt');
      }
    }

    const updatedEvent = await this.prisma.event.update({
      where: { id },
      data: {
        titre: dto.titre ?? event.titre,
        description: dto.description ?? event.description,
        startAt: dto.startAt ? new Date(dto.startAt) : event.startAt,
        endAt: dto.endAt ? new Date(dto.endAt) : event.endAt,
      },
    });

    return {
      id: updatedEvent.id,
      titre: updatedEvent.titre,
      description: updatedEvent.description,
      startAt: updatedEvent.startAt,
      endAt: updatedEvent.endAt,
      classeId: updatedEvent.classeId,
      status: updatedEvent.status,
      updatedAt: updatedEvent.updatedAt,
    };
  }

  /**
   * Supprime un événement
   */
  async deleteEvent(id: string) {
    const event = await this.prisma.event.findUnique({
      where: { id },
    });

    if (!event) {
      throw new NotFoundException('Événement non trouvé');
    }

    await this.prisma.event.delete({
      where: { id },
    });

    return { message: 'Événement supprimé avec succès' };
  }

  /**
   * Liste les événements avec filtres et pagination
   */
  async listEvents(query: ListEventsQueryDto) {
    const page = query.page || 1;
    const pageSize = query.pageSize || 20;
    const skip = (page - 1) * pageSize;

    const where: any = {};

    if (query.classeId) {
      where.classeId = query.classeId;
    }

    if (query.dateMin) {
      where.startAt = { gte: new Date(query.dateMin) };
    }

    if (query.dateMax) {
      where.endAt = { ...where.endAt, lte: new Date(query.dateMax) };
    }

    const [events, total] = await Promise.all([
      this.prisma.event.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { startAt: 'asc' },
      }),
      this.prisma.event.count({ where }),
    ]);

    return {
      data: events.map((e) => ({
        id: e.id,
        titre: e.titre,
        description: e.description,
        startAt: e.startAt,
        endAt: e.endAt,
        classeId: e.classeId,
        status: e.status,
        createdAt: e.createdAt,
      })),
      pagination: {
        page,
        pageSize,
        total,
        hasNext: page * pageSize < total,
      },
    };
  }

  /**
   * Récupère un événement par ID
   */
  async getEventById(id: string) {
    const event = await this.prisma.event.findUnique({
      where: { id },
    });

    if (!event) {
      throw new NotFoundException('Événement non trouvé');
    }

    return {
      id: event.id,
      titre: event.titre,
      description: event.description,
      startAt: event.startAt,
      endAt: event.endAt,
      classeId: event.classeId,
      status: event.status,
      createdAt: event.createdAt,
      updatedAt: event.updatedAt,
    };
  }
}

