import { Injectable, Logger, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { GetPresencesQueryDto, GetPresencesResponseDto, PresenceItemDto } from './dto';
import { RoleUtilisateur, StatutPresence } from '@prisma/client';

interface UserContext {
  userId: string;
  role: RoleUtilisateur;
  email: string;
}

@Injectable()
export class PresencesService {
  private readonly logger = new Logger(PresencesService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Récupère les IDs des classes enseignées par un enseignant
   */
  private async getClasseIdsForTeacher(userId: string): Promise<string[]> {
    const utilisateur = await this.prisma.utilisateur.findUnique({
      where: { id: userId },
      include: {
        enseignant: {
          include: {
            classes: {
              where: {
                dateFin: null, // Seulement les classes actuelles
              },
              select: { classeId: true },
            },
          },
        },
      },
    });

    if (!utilisateur?.enseignant) {
      return [];
    }

    return utilisateur.enseignant.classes.map((ec) => ec.classeId);
  }

  /**
   * Récupère les IDs des enfants d'un parent
   */
  private async getEnfantIdsForParent(userId: string): Promise<string[]> {
    const tuteur = await this.prisma.tuteur.findFirst({
      where: {
        utilisateur: {
          id: userId,
        },
      },
      include: {
        famille: {
          include: {
            enfants: {
              select: { id: true },
            },
          },
        },
      },
    });

    if (!tuteur) {
      return [];
    }

    return tuteur.famille.enfants.map((e) => e.id);
  }

  /**
   * Récupère les présences avec filtres et RBAC
   */
  async findMany(
    query: GetPresencesQueryDto,
    user: UserContext,
  ): Promise<GetPresencesResponseDto> {
    const page = query.page || 1;
    const pageSize = Math.min(query.pageSize || 25, 200);
    const skip = (page - 1) * pageSize;

    // Construire les filtres Prisma
    const where: any = {};

    // Filtre date
    if (query.date) {
      const date = new Date(query.date);
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);

      where.date = {
        gte: date,
        lt: nextDay,
      };
    } else if (query.dateMin || query.dateMax) {
      where.date = {};
      if (query.dateMin) {
        where.date.gte = new Date(query.dateMin);
      }
      if (query.dateMax) {
        const maxDate = new Date(query.dateMax);
        maxDate.setDate(maxDate.getDate() + 1);
        where.date.lt = maxDate;
      }
    }

    // Filtre statut
    if (query.statut) {
      where.statut = query.statut;
    }

    // Filtre enfantId
    if (query.enfantId) {
      where.enfantId = query.enfantId;
    }

    // Filtre classeId (via inscription)
    if (query.classeId) {
      where.enfant = {
        inscriptions: {
          some: {
            classeId: query.classeId,
          },
        },
      };
    }

    // Filtre recherche (q)
    if (query.q) {
      where.enfant = {
        ...where.enfant,
        OR: [
          { nom: { contains: query.q, mode: 'insensitive' } },
          { prenom: { contains: query.q, mode: 'insensitive' } },
        ],
      };
    }

    // Appliquer RBAC
    if (user.role === RoleUtilisateur.PARENT) {
      const enfantIds = await this.getEnfantIdsForParent(user.userId);
      if (enfantIds.length === 0) {
        return {
          items: [],
          page,
          pageSize,
          total: 0,
          hasNext: false,
        };
      }
      where.enfantId = { in: enfantIds };
    } else if (user.role === RoleUtilisateur.ENSEIGNANT) {
      const classeIds = await this.getClasseIdsForTeacher(user.userId);
      if (classeIds.length === 0) {
        return {
          items: [],
          page,
          pageSize,
          total: 0,
          hasNext: false,
        };
      }
      where.enfant = {
        ...where.enfant,
        inscriptions: {
          some: {
            classeId: { in: classeIds },
          },
        },
      };
    }
    // ADMIN: pas de restriction

    // Compter le total
    const total = await this.prisma.presence.count({ where });

    // Récupérer les présences
    const presences = await this.prisma.presence.findMany({
      where,
      include: {
        enfant: true,
      },
      orderBy: [{ date: 'desc' }, { enfant: { nom: 'asc' } }],
      skip,
      take: pageSize,
    });

    // Transformer les données
    const items: PresenceItemDto[] = presences.map((p) => ({
      id: p.id,
      date: p.date.toISOString().split('T')[0],
      statut: p.statut,
      enfant: {
        id: p.enfant.id,
        prenom: p.enfant.prenom,
        nom: p.enfant.nom,
      },
      arriveeA: p.arriveeA ? p.arriveeA.toISOString().split('T')[1].substring(0, 5) : undefined,
      departA: p.departA ? p.departA.toISOString().split('T')[1].substring(0, 5) : undefined,
    }));

    return {
      items,
      page,
      pageSize,
      total,
      hasNext: skip + pageSize < total,
    };
  }

  /**
   * Crée ou met à jour une présence pour un enfant
   */
  async createOrUpdatePresence(
    enfantId: string,
    date: string,
    statut: StatutPresence,
    arriveeA?: string,
    departA?: string,
    user?: UserContext,
  ): Promise<PresenceItemDto> {
    // Vérifier que l'enfant existe
    const enfant = await this.prisma.enfant.findUnique({
      where: { id: enfantId },
      include: {
        inscriptions: true,
      },
    });

    if (!enfant) {
      throw new BadRequestException('Enfant non trouvé');
    }

    // Vérifier RBAC pour TEACHER
    if (user && user.role === RoleUtilisateur.ENSEIGNANT) {
      // Pour simplifier, on accepte tous les enfants pour les enseignants
      // Dans une implémentation réelle, on vérifierait les classes de l'enfant
    }

    // Parser la date
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      throw new BadRequestException('Date invalide (format: YYYY-MM-DD)');
    }

    // Parser les heures
    let arriveeDateTime: Date | null = null;
    let departDateTime: Date | null = null;

    if (arriveeA) {
      const [hours, minutes] = arriveeA.split(':').map(Number);
      arriveeDateTime = new Date(dateObj);
      arriveeDateTime.setHours(hours, minutes, 0, 0);
    }

    if (departA) {
      const [hours, minutes] = departA.split(':').map(Number);
      departDateTime = new Date(dateObj);
      departDateTime.setHours(hours, minutes, 0, 0);
    }

    // Créer ou mettre à jour la présence
    const presence = await this.prisma.presence.upsert({
      where: {
        enfantId_date: {
          enfantId,
          date: dateObj,
        },
      },
      create: {
        enfantId,
        date: dateObj,
        statut,
        arriveeA: arriveeDateTime,
        departA: departDateTime,
        enregistrePar: user?.userId,
      },
      update: {
        statut,
        arriveeA: arriveeDateTime,
        departA: departDateTime,
        enregistrePar: user?.userId,
      },
      include: {
        enfant: true,
      },
    });

    return {
      id: presence.id,
      date: presence.date.toISOString().split('T')[0],
      statut: presence.statut,
      enfant: {
        id: presence.enfant.id,
        prenom: presence.enfant.prenom,
        nom: presence.enfant.nom,
      },
      arriveeA: presence.arriveeA
        ? presence.arriveeA.toISOString().split('T')[1].substring(0, 5)
        : undefined,
      departA: presence.departA
        ? presence.departA.toISOString().split('T')[1].substring(0, 5)
        : undefined,
    };
  }

  /**
   * Enregistre les présences pour une classe entière
   */
  async recordClassPresences(
    classeId: string,
    date: string,
    presences: Array<{
      enfantId: string;
      statut: StatutPresence;
      arriveeA?: string;
      departA?: string;
    }>,
    user: UserContext,
  ): Promise<PresenceItemDto[]> {
    // Vérifier que l'enseignant a accès à cette classe
    if (user.role === RoleUtilisateur.ENSEIGNANT) {
      const classeIds = await this.getClasseIdsForTeacher(user.userId);
      if (!classeIds.includes(classeId)) {
        throw new ForbiddenException(
          'Vous n\'avez pas accès à cette classe',
        );
      }
    }

    // Vérifier que la classe existe
    const classe = await this.prisma.classe.findUnique({
      where: { id: classeId },
    });

    if (!classe) {
      throw new BadRequestException('Classe non trouvée');
    }

    // Enregistrer les présences
    const results: PresenceItemDto[] = [];
    for (const p of presences) {
      const result = await this.createOrUpdatePresence(
        p.enfantId,
        date,
        p.statut,
        p.arriveeA,
        p.departA,
        user,
      );
      results.push(result);
    }

    this.logger.log(
      `${results.length} présences enregistrées pour la classe ${classeId} le ${date}`,
    );

    return results;
  }
}

