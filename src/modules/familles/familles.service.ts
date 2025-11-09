import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateFamilleDto } from './dto/create-famille.dto';
import { UpdateFamilleDto } from './dto/update-famille.dto';

@Injectable()
export class FamillesService {
  constructor(private prisma: PrismaService) {}

  async create(createFamilleDto: CreateFamilleDto) {
    try {
      const famille = await this.prisma.famille.create({
        data: {
          emailPrincipal: createFamilleDto.emailPrincipal,
          languePreferee: createFamilleDto.languePreferee || 'fr',
          adresseFacturation: createFamilleDto.adresseFacturation,
          tuteurs: createFamilleDto.tuteurs
            ? {
                create: createFamilleDto.tuteurs,
              }
            : undefined,
        },
        include: {
          tuteurs: true,
          enfants: true,
        },
      });
      return famille;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (error.code === 'P2002') {
        throw new BadRequestException(
          'Email principal déjà utilisé par une autre famille',
        );
      }
      throw error;
    }
  }

  async findAll() {
    const familles = await this.prisma.famille.findMany({
      include: {
        tuteurs: true,
        enfants: {
          include: {
            inscriptions: true,
          },
        },
      },
      orderBy: {
        emailPrincipal: 'asc',
      },
    });
    return {
      value: familles,
      count: familles.length,
    };
  }

  async findOne(id: string) {
    const famille = await this.prisma.famille.findUnique({
      where: { id },
      include: {
        tuteurs: true,
        enfants: {
          include: {
            inscriptions: true,
          },
        },
      },
    });

    if (!famille) {
      throw new NotFoundException(`Famille avec l'ID ${id} non trouvée`);
    }

    return famille;
  }

  async update(id: string, updateFamilleDto: UpdateFamilleDto) {
    try {
      const updated = await this.prisma.famille.update({
        where: { id },
        data: {
          emailPrincipal: updateFamilleDto.emailPrincipal,
          languePreferee: updateFamilleDto.languePreferee,
          adresseFacturation: updateFamilleDto.adresseFacturation,
        },
        include: {
          tuteurs: true,
          enfants: true,
        },
      });
      return updated;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (error.code === 'P2002') {
        throw new BadRequestException(
          'Email principal déjà utilisé par une autre famille',
        );
      }
      throw error;
    }
  }

  async remove(id: string) {
    try {
      // Supprimer d'abord les tuteurs
      await this.prisma.tuteur.deleteMany({
        where: { familleId: id },
      });

      // Puis supprimer la famille
      await this.prisma.famille.delete({
        where: { id },
      });

      return { message: 'Famille supprimée avec succès' };
    } catch {
      throw new BadRequestException(
        'Impossible de supprimer la famille. Vérifiez les dépendances.',
      );
    }
  }

  async getFamilleStats(id: string) {
    const famille = await this.findOne(id);

    const enfants = await this.prisma.enfant.findMany({
      where: { familleId: id },
      include: {
        inscriptions: true,
      },
    });

    const totalEnfants = enfants.length;
    const enfantsActifs = enfants.filter((enfant) =>
      enfant.inscriptions.some((i) => i.statut === 'ACTIF'),
    ).length;

    return {
      id: famille.id,
      emailPrincipal: famille.emailPrincipal,
      languePreferee: famille.languePreferee,
      totalEnfants,
      enfantsActifs,
      totalTuteurs: famille.tuteurs?.length || 0,
    };
  }
}
