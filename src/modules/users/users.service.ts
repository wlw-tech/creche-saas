import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SupabaseAdminService } from '../../common/services/supabase-admin.service';
import { CreateUserDto, InviteTeacherDto, UpdateUserStatusDto, ListUsersQueryDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private prisma: PrismaService,
    private supabaseAdmin: SupabaseAdminService,
  ) {}

  /**
   * Créer un utilisateur (enseignant ou parent)
   * Crée un Utilisateur avec le rôle spécifié et statut INVITED
   * Envoie une invitation Supabase
   */
  async createUser(dto: CreateUserDto) {
    // Vérifier si l'email existe déjà
    const existing = await this.prisma.utilisateur.findUnique({
      where: { email: dto.email },
    });

    if (existing) {
      throw new BadRequestException(
        `Un utilisateur avec l'email ${dto.email} existe déjà`,
      );
    }

    try {
      // Créer l'invitation Supabase
      const supabaseUser = await this.supabaseAdmin.createUserInvite(dto.email);

      // Créer l'utilisateur local
      const utilisateur = await this.prisma.utilisateur.create({
        data: {
          email: dto.email,
          prenom: dto.prenom,
          nom: dto.nom,
          telephone: dto.telephone,
          role: dto.role as any,
          statut: 'INVITED',
          authUserId: supabaseUser.userId,
          inviteLe: new Date(),
        },
      });

      this.logger.log(`Utilisateur créé: ${utilisateur.email} (${utilisateur.role})`);

      return {
        utilisateurId: utilisateur.id,
        email: utilisateur.email,
        role: utilisateur.role,
        statut: utilisateur.statut,
        invited: supabaseUser.invited,
      };
    } catch (error) {
      this.logger.error(`Erreur création utilisateur: ${error.message}`);
      throw error;
    }
  }

  /**
   * Inviter un enseignant
   * Crée un Utilisateur avec rôle ENSEIGNANT et statut INVITED
   * Envoie une invitation Supabase
   */
  async inviteTeacher(dto: InviteTeacherDto) {
    // Vérifier si l'email existe déjà
    const existing = await this.prisma.utilisateur.findUnique({
      where: { email: dto.email },
    });

    if (existing) {
      throw new BadRequestException(
        `Un utilisateur avec l'email ${dto.email} existe déjà`,
      );
    }

    try {
      // Créer l'invitation Supabase
      const supabaseUser = await this.supabaseAdmin.createUserInvite(dto.email);

      // Créer l'utilisateur local
      const utilisateur = await this.prisma.utilisateur.create({
        data: {
          email: dto.email,
          prenom: dto.prenom,
          nom: dto.nom,
          telephone: dto.telephone,
          role: 'ENSEIGNANT',
          statut: 'INVITED',
          authUserId: supabaseUser.userId,
          inviteLe: new Date(),
        },
      });

      this.logger.log(`Enseignant invité: ${utilisateur.email}`);

      return {
        utilisateurId: utilisateur.id,
        email: utilisateur.email,
        statut: utilisateur.statut,
        invited: supabaseUser.invited,
      };
    } catch (error) {
      this.logger.error(`Erreur invitation enseignant: ${error.message}`);
      throw error;
    }
  }

  /**
   * Mettre à jour le statut d'un utilisateur
   */
  async updateStatus(userId: string, dto: UpdateUserStatusDto) {
    const utilisateur = await this.prisma.utilisateur.findUnique({
      where: { id: userId },
    });

    if (!utilisateur) {
      throw new NotFoundException(`Utilisateur ${userId} non trouvé`);
    }

    const updated = await this.prisma.utilisateur.update({
      where: { id: userId },
      data: {
        statut: dto.statut as any,
        activeLe: dto.statut === 'ACTIVE' ? new Date() : utilisateur.activeLe,
      },
    });

    this.logger.log(`Statut utilisateur ${userId} mis à jour: ${dto.statut}`);

    return updated;
  }

  /**
   * Lister les utilisateurs avec filtres
   */
  async listUsers(query: ListUsersQueryDto) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (query.role) {
      where.role = query.role;
    }

    if (query.statut) {
      where.statut = query.statut;
    }

    if (query.q) {
      where.OR = [
        { email: { contains: query.q, mode: 'insensitive' } },
        { prenom: { contains: query.q, mode: 'insensitive' } },
        { nom: { contains: query.q, mode: 'insensitive' } },
      ];
    }

    const [utilisateurs, total] = await Promise.all([
      this.prisma.utilisateur.findMany({
        where,
        skip,
        take: limit,
        orderBy: { creeLe: 'desc' },
      }),
      this.prisma.utilisateur.count({ where }),
    ]);

    return {
      data: utilisateurs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Obtenir un utilisateur par ID
   */
  async findById(id: string) {
    const utilisateur = await this.prisma.utilisateur.findUnique({
      where: { id },
      include: {
        tuteur: true,
      },
    });

    if (!utilisateur) {
      throw new NotFoundException(`Utilisateur ${id} non trouvé`);
    }

    return utilisateur;
  }

  /**
   * Obtenir un utilisateur par email
   */
  async findByEmail(email: string) {
    return this.prisma.utilisateur.findUnique({
      where: { email },
      include: {
        tuteur: true,
      },
    });
  }

  /**
   * Supprimer un utilisateur
   */
  async deleteUser(userId: string) {
    const utilisateur = await this.prisma.utilisateur.findUnique({
      where: { id: userId },
    });

    if (!utilisateur) {
      throw new NotFoundException(`Utilisateur ${userId} non trouvé`);
    }

    // Supprimer l'utilisateur
    await this.prisma.utilisateur.delete({
      where: { id: userId },
    });

    this.logger.log(`Utilisateur ${userId} supprimé`);

    return {
      message: 'Utilisateur supprimé avec succès',
      id: userId,
    };
  }
}

