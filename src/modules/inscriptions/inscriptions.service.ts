import {
  Injectable,
  BadRequestException,
  Logger,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateInscriptionDto, ListInscriptionsQueryDto, UpdateInscriptionStatusDto } from './dto/create-inscription.dto';
import { EmailService } from '../../common/services/email.service';

/**
 * Service pour gérer les inscriptions publiques
 * Crée en une transaction atomique : Famille (upsert), Tuteur(s), Enfant, Inscription
 */
@Injectable()
export class InscriptionsService {
  private readonly logger = new Logger(InscriptionsService.name);

  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
  ) {}

  /**
   * Crée une nouvelle inscription (candidature)
   * Transaction atomique : sauvegarde le payload complet et crée l'inscription
   *
   * @param dto Données d'inscription
   * @returns { applicationId, statut }
   */
  async apply(dto: CreateInscriptionDto) {
    try {
      // Créer l'inscription avec le payload complet
      const inscription = await this.prisma.inscription.create({
        data: {
          statut: 'CANDIDATURE',
          payload: dto as any, // Sauvegarder le payload complet
          notes: null,
        },
      });

      this.logger.log(
        `Inscription créée: applicationId=${inscription.id}, statut=CANDIDATURE`,
      );

      // TODO: Envoyer email de confirmation
      // TODO: Déclencher webhook n8n

      return {
        applicationId: inscription.id,
        statut: inscription.statut,
      };
    } catch (error) {
      this.logger.error(
        `Erreur lors de la création d'inscription: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      throw new BadRequestException(
        'Erreur lors de la création de l\'inscription',
      );
    }
  }

  /**
   * Lister les inscriptions avec filtres et pagination
   */
  async listInscriptions(query: ListInscriptionsQueryDto) {
    const page = query.page || 1;
    const pageSize = query.pageSize || 25;
    const skip = (page - 1) * pageSize;

    const where: any = {};

    if (query.statut) {
      where.statut = query.statut;
    }

    if (query.dateMin || query.dateMax) {
      where.createdAt = {};
      if (query.dateMin) {
        where.createdAt.gte = new Date(query.dateMin);
      }
      if (query.dateMax) {
        where.createdAt.lte = new Date(query.dateMax);
      }
    }

    // Recherche dans le payload
    if (query.q) {
      // Note: La recherche full-text sur JSON n'est pas directement supportée
      // On récupère tous et on filtre en mémoire
      const allInscriptions = await this.prisma.inscription.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      });

      const filtered = allInscriptions.filter((insc) => {
        const payload = insc.payload as any;
        const searchStr = query.q?.toLowerCase() || '';
        return (
          payload?.enfant?.nom?.toLowerCase().includes(searchStr) ||
          payload?.enfant?.prenom?.toLowerCase().includes(searchStr) ||
          payload?.mere?.email?.toLowerCase().includes(searchStr) ||
          payload?.pere?.email?.toLowerCase().includes(searchStr)
        );
      });

      const total = filtered.length;
      return {
        items: filtered.map((insc) => this.formatInscriptionResponse(insc)),
        page,
        pageSize,
        total,
        hasNext: skip + pageSize < total,
      };
    }

    const [items, total] = await Promise.all([
      this.prisma.inscription.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.inscription.count({ where }),
    ]);

    return {
      items: items.map((insc) => this.formatInscriptionResponse(insc)),
      page,
      pageSize,
      total,
      hasNext: skip + pageSize < total,
    };
  }

  /**
   * Récupérer une inscription par ID
   */
  async getInscriptionById(id: string) {
    const inscription = await this.prisma.inscription.findUnique({
      where: { id },
    });

    if (!inscription) {
      throw new NotFoundException(`Inscription ${id} non trouvée`);
    }

    return this.formatInscriptionResponse(inscription);
  }

  /**
   * Mettre à jour le statut d'une inscription
   */
  async updateInscriptionStatus(id: string, dto: UpdateInscriptionStatusDto) {
    const inscription = await this.prisma.inscription.findUnique({
      where: { id },
    });

    if (!inscription) {
      throw new NotFoundException(`Inscription ${id} non trouvée`);
    }

    // Vérifier les transitions autorisées
    const validTransitions: Record<string, string[]> = {
      CANDIDATURE: ['EN_COURS', 'ACTIF', 'REJETEE'],
      EN_COURS: ['ACTIF', 'REJETEE'],
      ACTIF: [],
      REJETEE: [],
    };

    if (!validTransitions[inscription.statut]?.includes(dto.statut)) {
      throw new ConflictException(
        `Transition invalide: ${inscription.statut} -> ${dto.statut}`,
      );
    }

    const updated = await this.prisma.inscription.update({
      where: { id },
      data: {
        statut: dto.statut as any,
        notes: dto.notes || inscription.notes,
      },
    });

    return this.formatInscriptionResponse(updated);
  }

  /**
   * Rejeter une inscription
   */
  async rejectInscription(id: string, raison: string) {
    const inscription = await this.prisma.inscription.findUnique({
      where: { id },
    });

    if (!inscription) {
      throw new NotFoundException(`Inscription ${id} non trouvée`);
    }

    if (inscription.statut === 'REJETEE' || inscription.statut === 'ACTIF') {
      throw new ConflictException(
        `Impossible de rejeter une inscription avec le statut ${inscription.statut}`,
      );
    }

    const updated = await this.prisma.inscription.update({
      where: { id },
      data: {
        statut: 'REJETEE',
        notes: raison,
      },
    });

    return this.formatInscriptionResponse(updated);
  }

  /**
   * Générer un mot de passe temporaire
   */
  private generateTempPassword(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }

  /**
   * Accepter et provisionner une inscription
   * Crée Famille, Tuteur(s), Enfant, Utilisateur(s) PARENT et envoie les emails
   */
  async acceptAndProvisionInscription(id: string, user: any) {
    const inscription = await this.prisma.inscription.findUnique({
      where: { id },
    });

    if (!inscription) {
      throw new NotFoundException(`Inscription ${id} non trouvée`);
    }

    if (inscription.statut !== 'CANDIDATURE' && inscription.statut !== 'EN_COURS') {
      throw new ConflictException(
        `Impossible d'accepter une inscription avec le statut ${inscription.statut}`,
      );
    }

    const payload = inscription.payload as any;

    // Valider qu'il y a au moins un tuteur avec email
    const tuteurAvecEmail = payload.tuteurs?.find((t: any) => t.email);
    if (!tuteurAvecEmail) {
      throw new BadRequestException('Aucun tuteur avec email trouvé dans le payload');
    }

    // Transaction atomique
    const result = await this.prisma.$transaction(async (tx) => {
      // 1. Créer ou récupérer la famille
      const emailPrincipal = tuteurAvecEmail.email;
      const famille = await tx.famille.upsert({
        where: { emailPrincipal },
        update: {},
        create: {
          emailPrincipal,
          languePreferee: payload.famille?.languePreferee || 'fr',
          adresseFacturation: payload.famille?.adresseFacturation,
        },
      });

      // 2. Créer/mettre à jour les tuteurs et comptes utilisateurs
      const tuteurs: any[] = [];
      const emailsToInvite: Array<{ email: string; prenom: string; nom: string; tuteurId: string }> = [];

      for (const tuteurData of payload.tuteurs || []) {
        if (!tuteurData.email) continue;

        let tuteur = await tx.tuteur.findFirst({
          where: { email: tuteurData.email },
        });

        if (tuteur) {
          tuteur = await tx.tuteur.update({
            where: { id: tuteur.id },
            data: {
              prenom: tuteurData.prenom,
              nom: tuteurData.nom,
              telephone: tuteurData.telephone,
              adresse: tuteurData.adresse,
            },
          });
        } else {
          tuteur = await tx.tuteur.create({
            data: {
              familleId: famille.id,
              lien: tuteurData.lien,
              prenom: tuteurData.prenom,
              nom: tuteurData.nom,
              email: tuteurData.email,
              telephone: tuteurData.telephone,
              adresse: tuteurData.adresse,
              principal: tuteurData.principal || false,
            },
          });
        }

        tuteurs.push(tuteur);

        // Ajouter à la liste d'invitation si email et prenom/nom existent
        if (tuteur.email && tuteur.prenom && tuteur.nom) {
          emailsToInvite.push({
            email: tuteur.email,
            prenom: tuteur.prenom,
            nom: tuteur.nom,
            tuteurId: tuteur.id,
          });
        }
      }

      // 3. Créer l'enfant
      const enfant = await tx.enfant.create({
        data: {
          familleId: famille.id,
          prenom: payload.enfant.prenom,
          nom: payload.enfant.nom,
          dateNaissance: new Date(payload.enfant.dateNaissance),
          genre: payload.enfant.genre,
          photoUrl: payload.enfant.photoUrl,
        },
      });

      // 4. Mettre à jour l'inscription
      const updatedInscription = await tx.inscription.update({
        where: { id },
        data: {
          statut: 'ACTIF',
          familleId: famille.id,
          enfantId: enfant.id,
        },
      });

      return {
        inscriptionId: updatedInscription.id,
        statut: updatedInscription.statut,
        familleId: famille.id,
        enfantId: enfant.id,
        tuteurs: tuteurs.map((t) => ({
          tuteurId: t.id,
          email: t.email,
          lien: t.lien,
        })),
        emailsToInvite,
      };
    });

    // 5. Créer les comptes utilisateurs et envoyer les emails (hors transaction)
    const invitedTuteurs: any[] = [];
    for (const tuteurInfo of result.emailsToInvite) {
      try {
        // Générer mot de passe temporaire
        const tempPassword = this.generateTempPassword();

        // Créer l'utilisateur local
        const utilisateur = await this.prisma.utilisateur.create({
          data: {
            email: tuteurInfo.email,
            prenom: tuteurInfo.prenom,
            nom: tuteurInfo.nom,
            role: 'PARENT',
            statut: 'INVITED',
            tempPassword: tempPassword,
            inviteLe: new Date(),
            tuteurId: tuteurInfo.tuteurId,
          },
        });

        // Envoyer l'email d'invitation
        await this.emailService.sendInvitationEmail(
          utilisateur.email,
          utilisateur.prenom,
          utilisateur.nom,
          'PARENT',
          tempPassword,
        );

        invitedTuteurs.push({
          tuteurId: tuteurInfo.tuteurId,
          email: tuteurInfo.email,
          utilisateurId: utilisateur.id,
          emailSent: true,
        });

        this.logger.log(`Parent invité et email envoyé: ${utilisateur.email}`);
      } catch (error) {
        this.logger.error(
          `Erreur création compte parent ${tuteurInfo.email}: ${error instanceof Error ? error.message : 'Unknown error'}`,
        );
        invitedTuteurs.push({
          tuteurId: tuteurInfo.tuteurId,
          email: tuteurInfo.email,
          emailSent: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    this.logger.log(`Inscription ${id} acceptée et provisionnée`);
    return {
      ...result,
      invitedTuteurs,
    };
  }

  /**
   * Formater la réponse d'une inscription
   */
  private formatInscriptionResponse(inscription: any) {
    const payload = inscription.payload as any;

    // Support both old format (mere/pere) and new format (tuteurs array)
    let parents: any[] = [];

    if (payload?.tuteurs && Array.isArray(payload.tuteurs)) {
      parents = payload.tuteurs
        .filter((t: any) => t.email)
        .map((t: any) => ({
          nom: t.nom,
          email: t.email,
          lien: t.lien,
        }));
    } else {
      // Fallback to old format
      parents = [
        payload?.mere ? {
          nom: payload.mere.nom,
          email: payload.mere.email,
          lien: 'Mere',
        } : null,
        payload?.pere ? {
          nom: payload.pere.nom,
          email: payload.pere.email,
          lien: 'Pere',
        } : null,
      ].filter(Boolean);
    }

    return {
      id: inscription.id,
      statut: inscription.statut,
      createdAt: inscription.createdAt,
      updatedAt: inscription.updatedAt,
      enfant: payload?.enfant ? {
        prenom: payload.enfant.prenom,
        nom: payload.enfant.nom,
      } : null,
      parents,
      notes: inscription.notes,
      familleId: inscription.familleId,
      enfantId: inscription.enfantId,
    };
  }
}

