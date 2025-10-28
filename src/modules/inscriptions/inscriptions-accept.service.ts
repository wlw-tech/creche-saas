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
      include: {
        enfant: {
          include: {
            famille: {
              include: {
                tuteurs: true,
              },
            },
          },
        },
        classe: true,
      },
    });

    if (!inscription) {
      throw new NotFoundException(`Inscription ${inscriptionId} non trouvée`);
    }

    if (inscription.statut !== 'Candidature') {
      throw new BadRequestException(
        `Inscription ne peut être acceptée que depuis le statut Candidature (actuellement: ${inscription.statut})`,
      );
    }

    try {
      // Utiliser une transaction pour garantir l'atomicité
      const result = await this.prisma.$transaction(async (tx) => {
        // 1. Mettre à jour l'inscription
        const updatedInscription = await tx.inscription.update({
          where: { id: inscriptionId },
          data: {
            statut: 'Actif',
            dateDebut: new Date(),
          },
        });

        // 2. Inviter les tuteurs avec email
        const tuteurResults: Array<{
          tuteurId: string;
          email?: string;
          invite: 'sent' | 'missing_email' | 'error' | 'existing';
          utilisateurId?: string;
        }> = [];

        for (const tuteur of inscription.enfant.famille.tuteurs) {
          const result: {
            tuteurId: string;
            email?: string;
            invite: 'sent' | 'missing_email' | 'error' | 'existing';
            utilisateurId?: string;
          } = {
            tuteurId: tuteur.id,
            email: tuteur.email || undefined,
            invite: 'missing_email',
            utilisateurId: undefined,
          };

          if (tuteur.email) {
            try {
              // Vérifier si l'utilisateur existe déjà
              let utilisateur = await tx.utilisateur.findUnique({
                where: { email: tuteur.email },
              });

              if (!utilisateur) {
                // Créer l'invitation Supabase
                const supabaseUser =
                  await this.supabaseAdmin.createUserInvite(tuteur.email);

                // Créer l'utilisateur PARENT
                utilisateur = await tx.utilisateur.create({
                  data: {
                    email: tuteur.email,
                    prenom: tuteur.email.split('@')[0], // Placeholder
                    nom: 'Parent',
                    telephone: tuteur.telephone,
                    role: 'PARENT',
                    statut: 'INVITED',
                    authUserId: supabaseUser.userId,
                    tuteurId: tuteur.id,
                    inviteLe: new Date(),
                  },
                });

                result.invite = 'sent';
                result.utilisateurId = utilisateur.id;

                this.logger.log(
                  `Parent invité: ${tuteur.email} (tuteur: ${tuteur.id})`,
                );
              } else {
                // Utilisateur existe déjà
                result.invite = 'existing';
                result.utilisateurId = utilisateur.id;
              }
            } catch (error) {
              this.logger.error(
                `Erreur invitation parent ${tuteur.email}: ${error.message}`,
              );
              result.invite = 'error';
            }
          }

          tuteurResults.push(result);
        }

        return {
          inscriptionId: updatedInscription.id,
          statut: updatedInscription.statut,
          familleId: inscription.enfant.familleId,
          enfantId: inscription.enfantId,
          tuteurs: tuteurResults,
        };
      });

      this.logger.log(`Inscription ${inscriptionId} acceptée et provisionnée`);
      return result;
    } catch (error) {
      this.logger.error(
        `Erreur acceptation inscription: ${error.message}`,
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

    if (inscription.statut !== 'Candidature') {
      throw new BadRequestException(
        `Inscription ne peut être rejetée que depuis le statut Candidature`,
      );
    }

    const updated = await this.prisma.inscription.update({
      where: { id: inscriptionId },
      data: {
        statut: 'Inactif', // Utiliser Inactif pour "rejetée"
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

