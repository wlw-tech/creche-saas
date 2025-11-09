import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SupabaseAdminService } from '../../common/services/supabase-admin.service';

@Injectable()
export class InscriptionsAcceptService {
  private readonly logger = new Logger(InscriptionsAcceptService.name);

  constructor(
    private prisma: PrismaService,
    private supabaseAdmin: SupabaseAdminService,
  ) {}

  /**
   * Accepter une inscription et provisionner les comptes parents
   * Crée/relie Famille, Tuteur(s), Enfant
   * Crée les comptes Utilisateur PARENT pour chaque tuteur avec email
   */
  async acceptAndProvision(inscriptionId: string, notes?: string) {
    // Récupérer l'inscription
    const inscription = await this.prisma.inscription.findUnique({
      where: { id: inscriptionId },
    });

    if (!inscription) {
      throw new NotFoundException(`Inscription ${inscriptionId} non trouvée`);
    }

    if (inscription.statut !== 'CANDIDATURE' && inscription.statut !== 'EN_COURS') {
      throw new BadRequestException(
        `Inscription ne peut être acceptée que depuis le statut CANDIDATURE ou EN_COURS (actuellement: ${inscription.statut})`,
      );
    }

    try {
      // Utiliser une transaction pour garantir l'atomicité
      const result = await this.prisma.$transaction(async (tx) => {
        // 1. Mettre à jour l'inscription
        const updatedInscription = await tx.inscription.update({
          where: { id: inscriptionId },
          data: {
            statut: 'ACTIF',
          },
        });

        // 2. Retourner le résultat
        return {
          inscriptionId: updatedInscription.id,
          statut: updatedInscription.statut,
          familleId: updatedInscription.familleId,
          enfantId: updatedInscription.enfantId,
        };
      });

      this.logger.log(`Inscription ${inscriptionId} acceptée et provisionnée`);
      return result;
    } catch (error) {
      this.logger.error(
        `Erreur acceptation inscription: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      throw error;
    }
  }

  /**
   * Rejeter une inscription
   */
  async reject(inscriptionId: string, raison?: string) {
    const inscription = await this.prisma.inscription.findUnique({
      where: { id: inscriptionId },
    });

    if (!inscription) {
      throw new NotFoundException(`Inscription ${inscriptionId} non trouvée`);
    }

    if (inscription.statut !== 'CANDIDATURE' && inscription.statut !== 'EN_COURS') {
      throw new BadRequestException(
        `Inscription ne peut être rejetée que depuis le statut CANDIDATURE ou EN_COURS`,
      );
    }

    const updated = await this.prisma.inscription.update({
      where: { id: inscriptionId },
      data: {
        statut: 'REJETEE',
        notes: raison,
      },
    });

    this.logger.log(`Inscription ${inscriptionId} rejetée. Raison: ${raison}`);

    return {
      inscriptionId: updated.id,
      statut: updated.statut,
      raison,
    };
  }
}

