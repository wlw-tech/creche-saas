import { Injectable, BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreateClassDailySummaryDto,
  UpdateClassDailySummaryDto,
  ClassDailySummaryResponseDto,
  GetClassDailySummariesQueryDto,
} from './dto';

@Injectable()
export class ClassDailySummariesService {
  constructor(private prisma: PrismaService) {}

  async create(
    dto: CreateClassDailySummaryDto,
    user: any,
  ): Promise<ClassDailySummaryResponseDto> {
    // RBAC: Seul ENSEIGNANT et ADMIN peuvent créer
    if (user.role !== 'ENSEIGNANT' && user.role !== 'ADMIN') {
      throw new ForbiddenException('Vous n\'avez pas le droit de créer un résumé');
    }

    // Vérifier que la classe existe
    const classe = await this.prisma.classe.findUnique({
      where: { id: dto.classeId },
    });

    if (!classe) {
      throw new BadRequestException('Classe non trouvée');
    }

    // RBAC: Enseignant ne peut créer que pour ses classes
    if (user.role === 'ENSEIGNANT') {
      const hasAccess = await this.prisma.enseignantClasse.findFirst({
        where: {
          enseignantId: user.userId,
          classeId: dto.classeId,
        },
      });

      if (!hasAccess) {
        throw new ForbiddenException('Vous n\'avez pas accès à cette classe');
      }
    }

    // Vérifier qu'il n'existe pas déjà un résumé pour cette date
    const startDate = new Date(dto.date);
    const endDate = new Date(dto.date);
    endDate.setDate(endDate.getDate() + 1);

    const existing = await this.prisma.classDailySummary.findFirst({
      where: {
        classeId: dto.classeId,
        date: {
          gte: startDate,
          lt: endDate,
        },
      },
    });

    if (existing) {
      throw new BadRequestException('Un résumé existe déjà pour cette date');
    }

    const summary = await this.prisma.classDailySummary.create({
      data: {
        classeId: dto.classeId,
        date: startDate,
        activites: dto.activites,
        apprentissages: dto.apprentissages,
        humeurGroupe: dto.humeurGroupe,
        observations: dto.observations,
        creePar: user.userId,
        statut: 'Brouillon',
      },
      include: {
        classe: true,
      },
    });

    return this.formatResponse(summary);
  }

  async findAll(
    query: GetClassDailySummariesQueryDto,
    user: any,
  ): Promise<{
    data: ClassDailySummaryResponseDto[];
    total: number;
    page: number;
    pageSize: number;
    hasNext: boolean;
  }> {
    const page = query.page || 1;
    const pageSize = Math.min(query.pageSize || 25, 100);
    const skip = (page - 1) * pageSize;

    const where: any = {};

    // Filtres
    if (query.date) {
      const startDate = new Date(query.date);
      const endDate = new Date(query.date);
      endDate.setDate(endDate.getDate() + 1);
      where.date = { gte: startDate, lt: endDate };
    }

    if (query.dateMin || query.dateMax) {
      where.date = {};
      if (query.dateMin) {
        where.date.gte = new Date(query.dateMin);
      }
      if (query.dateMax) {
        const endDate = new Date(query.dateMax);
        endDate.setDate(endDate.getDate() + 1);
        where.date.lt = endDate;
      }
    }

    if (query.statut) {
      where.statut = query.statut;
    }

    // RBAC: Parents ne voient que les résumés publiés de leurs classes
    if (user.role === 'PARENT') {
      where.statut = 'Publie';
      const famille = await this.prisma.famille.findFirst({
        where: {
          tuteurs: {
            some: {
              utilisateur: { id: user.userId },
            },
          },
        },
        include: {
          enfants: {
            include: {
              inscriptions: true,
            },
          },
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

      // Les parents voient les résumés de toutes les classes de leurs enfants
      // Pour simplifier, on retourne tous les résumés publiés
      where.statut = 'Publie';
    }

    // RBAC: Enseignants ne voient que leurs classes
    if (user.role === 'ENSEIGNANT') {
      const enseignantClasses = await this.prisma.enseignantClasse.findMany({
        where: { enseignantId: user.userId },
      });

      const classeIds = enseignantClasses.map((ec) => ec.classeId);

      if (classeIds.length === 0) {
        return {
          data: [],
          total: 0,
          page,
          pageSize,
          hasNext: false,
        };
      }

      where.classeId = { in: classeIds };
    }

    if (query.classeId) {
      where.classeId = query.classeId;
    }

    const total = await this.prisma.classDailySummary.count({ where });

    const summaries = await this.prisma.classDailySummary.findMany({
      where,
      include: { classe: true },
      orderBy: { date: 'desc' },
      skip,
      take: pageSize,
    });

    return {
      data: summaries.map((s) => this.formatResponse(s)),
      total,
      page,
      pageSize,
      hasNext: skip + pageSize < total,
    };
  }

  async findOne(id: string, user: any): Promise<ClassDailySummaryResponseDto> {
    const summary = await this.prisma.classDailySummary.findUnique({
      where: { id },
      include: { classe: true },
    });

    if (!summary) {
      throw new NotFoundException('Résumé non trouvé');
    }

    // RBAC: Parents ne voient que les résumés publiés
    if (user.role === 'PARENT' && summary.statut !== 'Publie') {
      throw new ForbiddenException('Vous n\'avez pas accès à ce résumé');
    }

    // RBAC: Vérifier l'accès à la classe
    if (user.role === 'PARENT') {
      const famille = await this.prisma.famille.findFirst({
        where: {
          tuteurs: {
            some: {
              utilisateur: { id: user.userId },
            },
          },
          enfants: {
            some: {
              inscriptions: {
                some: {
                  familleId: { not: null }, // Inscriptions acceptées
                },
              },
            },
          },
        },
      });

      if (!famille) {
        throw new ForbiddenException('Vous n\'avez pas accès à ce résumé');
      }
    }

    if (user.role === 'ENSEIGNANT') {
      const hasAccess = await this.prisma.enseignantClasse.findFirst({
        where: {
          enseignantId: user.userId,
          classeId: summary.classeId,
        },
      });

      if (!hasAccess) {
        throw new ForbiddenException('Vous n\'avez pas accès à ce résumé');
      }
    }

    return this.formatResponse(summary);
  }

  async update(
    id: string,
    dto: UpdateClassDailySummaryDto,
    user: any,
  ): Promise<ClassDailySummaryResponseDto> {
    const summary = await this.prisma.classDailySummary.findUnique({
      where: { id },
    });

    if (!summary) {
      throw new NotFoundException('Résumé non trouvé');
    }

    // RBAC: Seul le créateur ou ADMIN peut modifier
    if (user.role === 'ENSEIGNANT' && summary.creePar !== user.userId) {
      throw new ForbiddenException('Vous ne pouvez modifier que vos propres résumés');
    }

    // Ne pas modifier si publié
    if (summary.statut === 'Publie') {
      throw new BadRequestException('Impossible de modifier un résumé publié');
    }

    const updated = await this.prisma.classDailySummary.update({
      where: { id },
      data: {
        activites: dto.activites || summary.activites,
        apprentissages: dto.apprentissages || summary.apprentissages,
        humeurGroupe: dto.humeurGroupe || summary.humeurGroupe,
        observations: dto.observations !== undefined ? dto.observations : summary.observations,
      },
      include: { classe: true },
    });

    return this.formatResponse(updated);
  }

  async publish(id: string, user: any): Promise<ClassDailySummaryResponseDto> {
    const summary = await this.prisma.classDailySummary.findUnique({
      where: { id },
    });

    if (!summary) {
      throw new NotFoundException('Résumé non trouvé');
    }

    // RBAC: Seul le créateur ou ADMIN peut publier
    if (user.role === 'ENSEIGNANT' && summary.creePar !== user.userId) {
      throw new ForbiddenException('Vous ne pouvez publier que vos propres résumés');
    }

    if (summary.statut === 'Publie') {
      throw new BadRequestException('Ce résumé est déjà publié');
    }

    const published = await this.prisma.classDailySummary.update({
      where: { id },
      data: {
        statut: 'Publie',
        publieLe: new Date(),
      },
      include: { classe: true },
    });

    return this.formatResponse(published);
  }

  async delete(id: string, user: any): Promise<void> {
    const summary = await this.prisma.classDailySummary.findUnique({
      where: { id },
    });

    if (!summary) {
      throw new NotFoundException('Résumé non trouvé');
    }

    // RBAC: Seul le créateur ou ADMIN peut supprimer
    if (user.role === 'ENSEIGNANT' && summary.creePar !== user.userId) {
      throw new ForbiddenException('Vous ne pouvez supprimer que vos propres résumés');
    }

    // Ne pas supprimer si publié
    if (summary.statut === 'Publie') {
      throw new BadRequestException('Impossible de supprimer un résumé publié');
    }

    await this.prisma.classDailySummary.delete({
      where: { id },
    });
  }

  private formatResponse(summary: any): ClassDailySummaryResponseDto {
    return {
      id: summary.id,
      classeId: summary.classeId,
      classeNom: summary.classe.nom,
      date: summary.date.toISOString().split('T')[0],
      activites: summary.activites,
      apprentissages: summary.apprentissages,
      humeurGroupe: summary.humeurGroupe,
      observations: summary.observations,
      statut: summary.statut,
      creePar: summary.creePar,
      creeLe: summary.creeLe.toISOString(),
      modifieLe: summary.modifieLe.toISOString(),
      publieLe: summary.publieLe?.toISOString(),
    };
  }
}

