import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
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
}

