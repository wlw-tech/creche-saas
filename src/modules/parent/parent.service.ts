import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateParentMeDto, GetPresencesQueryDto, GetEventsQueryDto } from './dto';

@Injectable()
export class ParentService {
  constructor(private prisma: PrismaService) {}

  /**
   * Récupère les infos du tuteur connecté + ses enfants
   */
  async getMyProfile(utilisateurId: string) {
    const utilisateur = await this.prisma.utilisateur.findUnique({
      where: { id: utilisateurId },
      include: {
        tuteur: {
          include: {
            famille: {
              include: {
                enfants: {
                  include: {
                    classe: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!utilisateur || !utilisateur.tuteur) {
      throw new NotFoundException('Tuteur non trouvé');
    }

    return {
      id: utilisateur.id,
      email: utilisateur.email,
      prenom: utilisateur.tuteur.prenom,
      nom: utilisateur.tuteur.nom,
      telephone: utilisateur.tuteur.telephone,
      adresse: utilisateur.tuteur.adresse,
      langue: utilisateur.langue,
      tuteurId: utilisateur.tuteur.id,
      familleId: utilisateur.tuteur.familleId,
      enfants: utilisateur.tuteur.famille.enfants.map((e) => ({
        id: e.id,
        prenom: e.prenom,
        nom: e.nom,
        dateNaissance: e.dateNaissance,
        classeId: e.classeId,
      })),
    };
  }

  /**
   * Met à jour le profil du tuteur
   */
  async updateMyProfile(utilisateurId: string, dto: UpdateParentMeDto) {
    const utilisateur = await this.prisma.utilisateur.findUnique({
      where: { id: utilisateurId },
      include: { tuteur: true },
    });

    if (!utilisateur || !utilisateur.tuteur) {
      throw new NotFoundException('Tuteur non trouvé');
    }

    const updatedTuteur = await this.prisma.tuteur.update({
      where: { id: utilisateur.tuteur.id },
      data: {
        telephone: dto.telephone ?? utilisateur.tuteur.telephone,
        adresse: dto.adresse ?? utilisateur.tuteur.adresse,
      },
    });

    return {
      id: updatedTuteur.id,
      prenom: updatedTuteur.prenom,
      nom: updatedTuteur.nom,
      telephone: updatedTuteur.telephone,
      adresse: updatedTuteur.adresse,
    };
  }

  /**
   * Récupère les présences d'un enfant du tuteur
   */
  async getChildPresences(utilisateurId: string, enfantId: string, query: GetPresencesQueryDto) {
    // Vérifier que l'enfant appartient au tuteur
    const utilisateur = await this.prisma.utilisateur.findUnique({
      where: { id: utilisateurId },
      include: {
        tuteur: {
          include: {
            famille: {
              include: {
                enfants: {
                  include: {
                    classe: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!utilisateur?.tuteur) {
      throw new NotFoundException('Tuteur non trouvé');
    }

    const enfantBelongsToTuteur = utilisateur.tuteur.famille.enfants.some((e) => e.id === enfantId);
    if (!enfantBelongsToTuteur) {
      throw new ForbiddenException('Cet enfant ne vous appartient pas');
    }

    const page = query.page || 1;
    const pageSize = query.pageSize || 30;
    const skip = (page - 1) * pageSize;

    const where: any = { enfantId };
    if (query.dateMin) {
      where.date = { gte: new Date(query.dateMin) };
    }
    if (query.dateMax) {
      where.date = { ...where.date, lte: new Date(query.dateMax) };
    }

    const [presences, total] = await Promise.all([
      this.prisma.presence.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { date: 'desc' },
      }),
      this.prisma.presence.count({ where }),
    ]);

    return {
      data: presences.map((p) => ({
        id: p.id,
        date: p.date,
        statut: p.statut,
        arriveeA: p.arriveeA,
        departA: p.departA,
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
   * Récupère le dernier résumé publié d'une classe
   */
  async getLatestClassJournal(utilisateurId: string, classeId: string) {
    // Vérifier que l'utilisateur a un enfant dans cette classe
    const utilisateur = await this.prisma.utilisateur.findUnique({
      where: { id: utilisateurId },
      include: {
        tuteur: {
          include: {
            famille: {
              include: {
                enfants: {
                  include: {
                    classe: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!utilisateur?.tuteur) {
      throw new NotFoundException('Tuteur non trouvé');
    }

    const hasChildInClass = utilisateur.tuteur.famille.enfants.some((e) => e.classeId === classeId);
    if (!hasChildInClass) {
      throw new ForbiddenException('Vous n\'avez pas d\'enfant dans cette classe');
    }

    const journal = await this.prisma.classDailySummary.findFirst({
      where: {
        classeId,
        statut: 'Publie',
      },
      orderBy: { date: 'desc' },
    });

    if (!journal) {
      throw new NotFoundException('Aucun résumé publié trouvé');
    }

    return {
      id: journal.id,
      date: journal.date,
      activites: journal.activites,
      apprentissages: journal.apprentissages,
      humeurGroupe: journal.humeurGroupe,
      observations: journal.observations,
      publieLe: journal.publieLe,
    };
  }

  /**
   * Récupère les événements visibles pour le parent
   */
  async getMyEvents(utilisateurId: string, query: GetEventsQueryDto) {
    const utilisateur = await this.prisma.utilisateur.findUnique({
      where: { id: utilisateurId },
      include: {
        tuteur: {
          include: {
            famille: {
              include: {
                enfants: {
                  include: {
                    classe: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!utilisateur?.tuteur) {
      throw new NotFoundException('Tuteur non trouvé');
    }

    const classeIds = utilisateur.tuteur.famille.enfants
      .filter((e) => e.classeId)
      .map((e) => e.classeId);

    if (classeIds.length === 0) {
      return {
        data: [],
        pagination: { page: 1, pageSize: 20, total: 0, hasNext: false },
      };
    }

    const page = query.page || 1;
    const pageSize = query.pageSize || 20;
    const skip = (page - 1) * pageSize;

    const dateFrom = query.dateFrom === 'today' ? new Date() : new Date(query.dateFrom || new Date().toISOString());

    const where: any = {
      classeId: { in: classeIds },
      status: 'PUBLISHED',
      startAt: { gte: dateFrom },
    };

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
      })),
      pagination: {
        page,
        pageSize,
        total,
        hasNext: page * pageSize < total,
      },
    };
  }
}

