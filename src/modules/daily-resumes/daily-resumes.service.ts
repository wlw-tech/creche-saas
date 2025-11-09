import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreateDailyResumeDto,
  UpdateDailyResumeDto,
  DailyResumeResponseDto,
  GetDailyResumesQueryDto,
  ClassSummaryDto,
  ExportStatisticsDto,
} from './dto';
import { StatutPresence } from '@prisma/client';

@Injectable()
export class DailyResumesService {
  private readonly logger = new Logger(DailyResumesService.name);

  constructor(private prisma: PrismaService) {}

  async create(
    createDto: CreateDailyResumeDto,
    userId: string,
  ): Promise<DailyResumeResponseDto> {
    // Vérifier que l'enfant existe
    const enfant = await this.prisma.enfant.findUnique({
      where: { id: createDto.enfantId },
    });

    if (!enfant) {
      throw new NotFoundException(`Enfant ${createDto.enfantId} non trouvé`);
    }

    // Vérifier qu'il n'existe pas déjà un résumé pour cette date
    const existingResume = await this.prisma.dailyResume.findUnique({
      where: {
        enfantId_date: {
          enfantId: createDto.enfantId,
          date: new Date(createDto.date),
        },
      },
    });

    if (existingResume) {
      throw new BadRequestException(
        `Un résumé existe déjà pour cet enfant à cette date`,
      );
    }

    // Créer le résumé
    const resume = await this.prisma.dailyResume.create({
      data: {
        enfantId: createDto.enfantId,
        date: new Date(createDto.date),
        appetit: createDto.appetit,
        humeur: createDto.humeur,
        sieste: createDto.sieste,
        participation: createDto.participation,
        creePar: userId,
        observations: {
          create: (createDto.observations || []).map((obs) => ({
            observation: obs,
          })),
        },
      },
      include: {
        enfant: true,
        observations: true,
      },
    });

    return this.formatResumeResponse(resume);
  }

  async findAll(
    query: GetDailyResumesQueryDto,
    user: any,
  ): Promise<{
    data: DailyResumeResponseDto[];
    total: number;
    page: number;
    pageSize: number;
    hasNext: boolean;
  }> {
    const page = query.page || 1;
    const pageSize = Math.min(query.pageSize || 25, 100);
    const skip = (page - 1) * pageSize;

    const where: any = {};

    // Filtrer par date
    if (query.date) {
      const startDate = new Date(query.date);
      const endDate = new Date(query.date);
      endDate.setDate(endDate.getDate() + 1);
      where.date = {
        gte: startDate,
        lt: endDate,
      };
    } else if (query.dateMin || query.dateMax) {
      where.date = {};
      if (query.dateMin) {
        where.date.gte = new Date(query.dateMin);
      }
      if (query.dateMax) {
        where.date.lte = new Date(query.dateMax);
      }
    }

    // Filtrer par enfant
    if (query.enfantId) {
      where.enfantId = query.enfantId;
    }

    // RBAC: Parents ne voient que leurs enfants
    if (user.role === 'PARENT') {
      const famille = await this.prisma.famille.findFirst({
        where: {
          tuteurs: {
            some: {
              utilisateur: { id: user.userId },
            },
          },
        },
        include: {
          enfants: true,
        },
      });

      if (!famille) {
        return {
          data: [],
          total: 0,
          page,
          pageSize,
          hasNext: false,
        };
      }

      where.enfantId = {
        in: famille.enfants.map((e) => e.id),
      };
    }

    // RBAC: Enseignants ne voient que les résumés de leurs classes
    if (user.role === 'ENSEIGNANT') {
      const enseignantClasses = await this.prisma.enseignantClasse.findMany({
        where: { enseignantId: user.userId },
      });

      const classeIds = enseignantClasses.map((ec) => ec.classeId);

      // Récupérer les enfants des classes de l'enseignant
      const enfants = await this.prisma.enfant.findMany({
        where: {
          inscriptions: {
            some: {
              familleId: { not: null }, // Inscriptions acceptées
            },
          },
        },
      });

      const enfantIds = enfants.map((e) => e.id);

      if (enfantIds.length === 0) {
        return {
          data: [],
          total: 0,
          page,
          pageSize,
          hasNext: false,
        };
      }

      where.enfantId = {
        in: enfantIds,
      };
    }

    const total = await this.prisma.dailyResume.count({ where });

    const resumes = await this.prisma.dailyResume.findMany({
      where,
      include: {
        enfant: true,
        observations: true,
      },
      orderBy: { date: 'desc' },
      skip,
      take: pageSize,
    });

    return {
      data: resumes.map((r) => this.formatResumeResponse(r)),
      total,
      page,
      pageSize,
      hasNext: skip + pageSize < total,
    };
  }

  async findOne(id: string, user: any): Promise<DailyResumeResponseDto> {
    const resume = await this.prisma.dailyResume.findUnique({
      where: { id },
      include: {
        enfant: true,
        observations: true,
      },
    });

    if (!resume) {
      throw new NotFoundException(`Résumé ${id} non trouvé`);
    }

    // RBAC: Vérifier l'accès
    if (user.role === 'PARENT') {
      const famille = await this.prisma.famille.findFirst({
        where: {
          tuteurs: {
            some: {
              utilisateur: { id: user.userId },
            },
          },
          enfants: { some: { id: resume.enfantId } },
        },
      });

      if (!famille) {
        throw new ForbiddenException(
          'Vous n\'avez pas accès à ce résumé',
        );
      }
    }

    if (user.role === 'ENSEIGNANT') {
      // Vérifier que l'enseignant a accès à l'enfant
      const enfant = await this.prisma.enfant.findUnique({
        where: { id: resume.enfantId },
      });

      const hasAccess = enfant !== null;

      if (!hasAccess) {
        throw new ForbiddenException(
          'Vous n\'avez pas accès à ce résumé',
        );
      }
    }

    return this.formatResumeResponse(resume);
  }

  async update(
    id: string,
    updateDto: UpdateDailyResumeDto,
    user: any,
  ): Promise<DailyResumeResponseDto> {
    const resume = await this.prisma.dailyResume.findUnique({
      where: { id },
      include: { observations: true },
    });

    if (!resume) {
      throw new NotFoundException(`Résumé ${id} non trouvé`);
    }

    // RBAC: Seul l'enseignant qui a créé peut modifier
    if (user.role === 'ENSEIGNANT' && resume.creePar !== user.userId) {
      throw new ForbiddenException(
        'Vous ne pouvez modifier que vos propres résumés',
      );
    }

    // Supprimer les anciennes observations si fournies
    if (updateDto.observations) {
      await this.prisma.dailyResumeObservation.deleteMany({
        where: { dailyResumeId: id },
      });
    }

    const updated = await this.prisma.dailyResume.update({
      where: { id },
      data: {
        appetit: updateDto.appetit,
        humeur: updateDto.humeur,
        sieste: updateDto.sieste,
        participation: updateDto.participation,
        observations: updateDto.observations
          ? {
              create: updateDto.observations.map((obs) => ({
                observation: obs,
              })),
            }
          : undefined,
      },
      include: {
        enfant: true,
        observations: true,
      },
    });

    return this.formatResumeResponse(updated);
  }

  async getClassSummary(
    classeId: string,
    date: string,
    user: any,
  ): Promise<ClassSummaryDto> {
    // RBAC: Vérifier l'accès à la classe
    if (user.role === 'ENSEIGNANT') {
      const hasAccess = await this.prisma.enseignantClasse.findFirst({
        where: {
          enseignantId: user.userId,
          classeId,
        },
      });

      if (!hasAccess) {
        throw new ForbiddenException(
          'Vous n\'avez pas accès à cette classe',
        );
      }
    }

    const classe = await this.prisma.classe.findUnique({
      where: { id: classeId },
    });

    if (!classe) {
      throw new NotFoundException(`Classe ${classeId} non trouvée`);
    }

    const startDate = new Date(date);
    const endDate = new Date(date);
    endDate.setDate(endDate.getDate() + 1);

    // Récupérer les enfants de la classe
    const enfants = await this.prisma.enfant.findMany({
      where: {
        inscriptions: {
          some: {
            familleId: { not: null }, // Inscriptions acceptées
          },
        },
      },
    });

    const enfantIds = enfants.map((e) => e.id);

    // Récupérer les présences du jour
    const presences = await this.prisma.presence.findMany({
      where: {
        date: {
          gte: startDate,
          lt: endDate,
        },
        enfantId: { in: enfantIds },
      },
    });

    // Récupérer les résumés du jour
    const resumes = await this.prisma.dailyResume.findMany({
      where: {
        date: {
          gte: startDate,
          lt: endDate,
        },
        enfantId: { in: enfantIds },
      },
      include: {
        enfant: true,
      },
    });

    const presentsCount = presences.filter(
      (p) => p.statut === StatutPresence.Present,
    ).length;
    const absentsCount = presences.filter(
      (p) => p.statut === StatutPresence.Absent,
    ).length;
    const justifiesCount = presences.filter(
      (p) => p.statut === StatutPresence.Justifie,
    ).length;

    return {
      date,
      classeId,
      classeNom: classe.nom,
      totalEnfants: enfantIds.length,
      presentsCount,
      absentsCount,
      justifiesCount,
      resumesCount: resumes.length,
    };
  }

  async exportStatistics(
    classeId: string,
    dateMin: string,
    dateMax: string,
    user: any,
  ): Promise<ExportStatisticsDto[]> {
    // RBAC: Vérifier l'accès
    if (user.role === 'ENSEIGNANT') {
      const hasAccess = await this.prisma.enseignantClasse.findFirst({
        where: {
          enseignantId: user.userId,
          classeId,
        },
      });

      if (!hasAccess) {
        throw new ForbiddenException(
          'Vous n\'avez pas accès à cette classe',
        );
      }
    }

    const classe = await this.prisma.classe.findUnique({
      where: { id: classeId },
    });

    if (!classe) {
      throw new NotFoundException(`Classe ${classeId} non trouvée`);
    }

    const startDate = new Date(dateMin);
    const endDate = new Date(dateMax);
    endDate.setDate(endDate.getDate() + 1);

    // Récupérer les enfants de la classe
    const enfants = await this.prisma.enfant.findMany({
      where: {
        inscriptions: {
          some: {
            familleId: { not: null }, // Inscriptions acceptées
          },
        },
      },
    });

    const enfantIds = enfants.map((e) => e.id);

    const resumes = await this.prisma.dailyResume.findMany({
      where: {
        date: {
          gte: startDate,
          lt: endDate,
        },
        enfantId: { in: enfantIds },
      },
    });

    // Grouper par date
    const byDate = new Map<string, typeof resumes>();
    resumes.forEach((r) => {
      const dateStr = r.date.toISOString().split('T')[0];
      if (!byDate.has(dateStr)) {
        byDate.set(dateStr, []);
      }
      const dayResumes = byDate.get(dateStr);
      if (dayResumes) {
        dayResumes.push(r);
      }
    });

    const result: ExportStatisticsDto[] = [];

    byDate.forEach((dayResumes, dateStr) => {
      const stats = {
        Excellent: 0,
        Bon: 0,
        Moyen: 0,
        Faible: 0,
        Refus: 0,
      };

      const humeurStats = {
        Excellent: 0,
        Bon: 0,
        Moyen: 0,
        Difficile: 0,
        Tres_difficile: 0,
      };

      const siesteStats = {
        Excellent: 0,
        Bon: 0,
        Moyen: 0,
        Difficile: 0,
        Pas_de_sieste: 0,
      };

      const participationStats = {
        Excellent: 0,
        Bon: 0,
        Moyen: 0,
        Faible: 0,
        Absent: 0,
      };

      dayResumes.forEach((r) => {
        if (r.appetit) stats[r.appetit]++;
        if (r.humeur) humeurStats[r.humeur]++;
        if (r.sieste) siesteStats[r.sieste]++;
        if (r.participation) participationStats[r.participation]++;
      });

      result.push({
        date: dateStr,
        classeId,
        classeNom: classe.nom,
        totalEnfants: enfantIds.length,
        resumesCount: dayResumes.length,
        appetitStats: stats,
        humeurStats,
        siesteStats,
        participationStats,
      });
    });

    return result.sort((a, b) => a.date.localeCompare(b.date));
  }

  private formatResumeResponse(resume: any): DailyResumeResponseDto {
    return {
      id: resume.id,
      enfantId: resume.enfantId,
      enfantPrenom: resume.enfant.prenom,
      enfantNom: resume.enfant.nom,
      date: resume.date.toISOString().split('T')[0],
      appetit: resume.appetit,
      humeur: resume.humeur,
      sieste: resume.sieste,
      participation: resume.participation,
      observations: resume.observations.map((o: any) => o.observation),
      creePar: resume.creePar,
      creeLe: resume.creeLe.toISOString(),
      modifieLe: resume.modifieLe.toISOString(),
    };
  }
}

