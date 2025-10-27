import {
  Injectable,
  BadRequestException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateInscriptionDto } from './dto/create-inscription.dto';

/**
 * Service pour gérer les inscriptions publiques
 * Crée en une transaction atomique : Famille (upsert), Tuteur(s), Enfant, Inscription
 */
@Injectable()
export class InscriptionsService {
  private readonly logger = new Logger(InscriptionsService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Crée une nouvelle inscription (candidature)
   * Transaction atomique : upsert Famille → create Tuteurs → find/create Enfant → validate Classe → create Inscription
   *
   * @param dto Données d'inscription
   * @returns { applicationId, statut }
   */
  async apply(dto: CreateInscriptionDto) {
    try {
      // Valider que la classe existe et est active
      const classe = await this.prisma.classe.findUnique({
        where: { id: dto.classeIdSouhaitee },
      });

      if (!classe) {
        throw new NotFoundException(
          `Classe avec l'ID ${dto.classeIdSouhaitee} non trouvée`,
        );
      }

      if (!classe.active) {
        throw new BadRequestException(
          `La classe ${classe.nom} n'est pas disponible pour les inscriptions`,
        );
      }

      // Transaction atomique
      const result = await this.prisma.$transaction(async (tx) => {
        // 1. Upsert Famille sur emailPrincipal
        const famille = await tx.famille.upsert({
          where: { emailPrincipal: dto.famille.emailPrincipal },
          update: {
            languePreferee: dto.famille.languePreferee || 'fr',
            adresseFacturation: dto.famille.adresseFacturation,
          },
          create: {
            emailPrincipal: dto.famille.emailPrincipal,
            languePreferee: dto.famille.languePreferee || 'fr',
            adresseFacturation: dto.famille.adresseFacturation,
          },
        });

        // 2. Créer les tuteurs liés à la famille
        // Supprimer les tuteurs existants pour cette famille (optionnel, selon métier)
        // Pour l'instant, on crée simplement les nouveaux
        const tuteurs = await Promise.all(
          dto.tuteurs.map((tuteurDto) =>
            tx.tuteur.create({
              data: {
                familleId: famille.id,
                lien: tuteurDto.lien,
                email: tuteurDto.email,
                telephone: tuteurDto.telephone,
                principal: tuteurDto.principal || false,
              },
            }),
          ),
        );

        // 3. Trouver ou créer l'enfant par (familleId, prenom, nom, dateNaissance)
        const dateNaissance = new Date(dto.enfant.dateNaissance);
        let enfant = await tx.enfant.findFirst({
          where: {
            familleId: famille.id,
            prenom: dto.enfant.prenom,
            nom: dto.enfant.nom,
            dateNaissance: dateNaissance,
          },
        });

        if (!enfant) {
          enfant = await tx.enfant.create({
            data: {
              familleId: famille.id,
              prenom: dto.enfant.prenom,
              nom: dto.enfant.nom,
              dateNaissance: dateNaissance,
              genre: dto.enfant.genre,
              photoUrl: dto.enfant.photoUrl,
            },
          });
        }

        // 4. Créer l'inscription avec statut Candidature
        const inscription = await tx.inscription.create({
          data: {
            enfantId: enfant.id,
            classeId: classe.id,
            statut: 'Candidature',
          },
        });

        return {
          applicationId: inscription.id,
          statut: inscription.statut,
          enfantId: enfant.id,
          familleId: famille.id,
          classeId: classe.id,
        };
      });

      // Log l'événement
      this.logger.log(
        `Inscription créée: applicationId=${result.applicationId}, famille=${dto.famille.emailPrincipal}, classe=${classe.nom}`,
      );

      // TODO: Envoyer email de confirmation
      // TODO: Déclencher webhook n8n

      return {
        applicationId: result.applicationId,
        statut: result.statut,
      };
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (error.code === 'P2002') {
        throw new BadRequestException(
          'Email principal déjà utilisé par une autre famille',
        );
      }

      // Re-throw les exceptions métier
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      this.logger.error(
        `Erreur lors de la création d'inscription: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      throw new BadRequestException(
        'Erreur lors de la création de l\'inscription',
      );
    }
  }
}

