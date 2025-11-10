import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { StatutInscription } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateClasseDto } from './dto/create-classe.dto';
import { UpdateClasseDto } from './dto/update-classe.dto';

@Injectable()
export class ClassesService {
  constructor(private prisma: PrismaService) {}

  async create(createClasseDto: CreateClasseDto) {
    try {
      return await this.prisma.classe.create({
        data: {
          nom: createClasseDto.nom,
          capacite: createClasseDto.capacite,
          trancheAge: createClasseDto.trancheAge,
          active: createClasseDto.active ?? true,
        },
        include: {
          journauxClasse: true,
          evenements: true,
        },
      });
    } catch (error) {
      throw new BadRequestException('Failed to create classe');
    }
  }

  async findAll() {
    return await this.prisma.classe.findMany({
      include: {
        journauxClasse: true,
        evenements: true,
      },
      orderBy: {
        nom: 'asc',
      },
    });
  }

  async findOne(id: string) {
    const classe = await this.prisma.classe.findUnique({
      where: { id },
      include: {
        journauxClasse: {
          include: {
            diffusions: true,
          },
        },
        evenements: true,
      },
    });

    if (!classe) {
      throw new NotFoundException(`Classe with ID ${id} not found`);
    }

    return classe;
  }

  async update(id: string, updateClasseDto: UpdateClasseDto) {
    const classe = await this.findOne(id);

    try {
      return await this.prisma.classe.update({
        where: { id },
        data: {
          nom: updateClasseDto.nom ?? classe.nom,
          capacite: updateClasseDto.capacite ?? classe.capacite,
          trancheAge: updateClasseDto.trancheAge ?? classe.trancheAge,
          active: updateClasseDto.active ?? classe.active,
        },
        include: {
          journauxClasse: true,
          evenements: true,
        },
      });
    } catch (error) {
      throw new BadRequestException('Failed to update classe');
    }
  }

  async remove(id: string) {
    // Verify classe exists before deletion
    await this.findOne(id);

    try {
      return await this.prisma.classe.delete({
        where: { id },
      });
    } catch (error) {
      throw new BadRequestException(
        'Failed to delete classe. It may have related records.',
      );
    }
  }

  async getClasseStats(id: string) {
    const classe = await this.findOne(id);

    // Compter les enfants inscrits dans cette classe
    const enfants = await this.prisma.enfant.findMany({
      where: {
        inscriptions: {
          some: {
            familleId: { not: null }, // Inscriptions acceptées
          },
        },
      },
    });

    return {
      id: classe.id,
      nom: classe.nom,
      capacite: classe.capacite,
      totalEnfants: enfants.length,
      availableSpots: classe.capacite
        ? classe.capacite - enfants.length
        : null,
      occupancyRate: classe.capacite
        ? Math.round((enfants.length / classe.capacite) * 100)
        : null,
    };
  }

  /**
   * Récupérer tous les enfants d'une classe avec leur statut de présence du jour
   */
  async getChildrenWithPresence(classeId: string) {
    // Vérifier que la classe existe
    const classe = await this.findOne(classeId);

    // Récupérer tous les enfants de la classe
    const enfants = await this.prisma.enfant.findMany({
      where: { classeId },
      include: {
        famille: true,
      },
      orderBy: {
        prenom: 'asc',
      },
    });

    // Récupérer les présences du jour pour chaque enfant
    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    const presences = await this.prisma.presence.findMany({
      where: {
        enfantId: { in: enfants.map((e) => e.id) },
        date: {
          gte: startOfToday,
          lt: endOfToday,
        },
      },
    });

    // Mapper les présences par enfant
    const presenceMap = new Map(presences.map((p) => [p.enfantId, p]));

    return {
      classeId: classe.id,
      classeNom: classe.nom,
      date: today.toISOString().split('T')[0],
      totalEnfants: enfants.length,
      enfants: enfants.map((enfant) => {
        const presence = presenceMap.get(enfant.id);
        return {
          id: enfant.id,
          prenom: enfant.prenom,
          nom: enfant.nom,
          dateNaissance: enfant.dateNaissance,
          presence: presence
            ? {
                id: presence.id,
                statut: presence.statut,
                arriveeA: presence.arriveeA,
                departA: presence.departA,
              }
            : null,
        };
      }),
    };
  }

  /**
   * Assigner un enseignant à une classe
   */
  async assignTeacherToClass(classeId: string, enseignantId: string) {
    // Vérifier que la classe existe
    await this.findOne(classeId);

    // Vérifier que l'enseignant existe
    const enseignant = await this.prisma.enseignant.findUnique({
      where: { id: enseignantId },
      include: {
        utilisateur: true,
      },
    });

    if (!enseignant) {
      throw new NotFoundException(`Enseignant with ID ${enseignantId} not found`);
    }

    // Vérifier que l'enseignant n'est pas déjà assigné à cette classe
    const existing = await this.prisma.enseignantClasse.findUnique({
      where: {
        enseignantId_classeId: {
          enseignantId,
          classeId,
        },
      },
    });

    if (existing) {
      throw new ConflictException(
        'Cet enseignant est déjà assigné à cette classe',
      );
    }

    // Créer la relation
    return await this.prisma.enseignantClasse.create({
      data: {
        enseignantId,
        classeId,
      },
      include: {
        enseignant: {
          include: {
            utilisateur: {
              select: {
                id: true,
                prenom: true,
                nom: true,
                email: true,
              },
            },
          },
        },
        classe: {
          select: {
            id: true,
            nom: true,
          },
        },
      },
    });
  }

  /**
   * Retirer un enseignant d'une classe
   */
  async removeTeacherFromClass(classeId: string, enseignantId: string) {
    // Vérifier que la classe existe
    await this.findOne(classeId);

    // Vérifier que l'enseignant existe
    const enseignant = await this.prisma.enseignant.findUnique({
      where: { id: enseignantId },
    });

    if (!enseignant) {
      throw new NotFoundException(`Enseignant with ID ${enseignantId} not found`);
    }

    // Vérifier que la relation existe
    const existing = await this.prisma.enseignantClasse.findUnique({
      where: {
        enseignantId_classeId: {
          enseignantId,
          classeId,
        },
      },
    });

    if (!existing) {
      throw new NotFoundException(
        'Cette relation enseignant-classe n\'existe pas',
      );
    }

    // Supprimer la relation
    await this.prisma.enseignantClasse.delete({
      where: {
        id: existing.id,
      },
    });

    return { message: 'Enseignant retiré de la classe avec succès' };
  }
}

