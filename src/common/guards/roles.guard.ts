import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../prisma/prisma.service';

/**
 * Guard RBAC pour vérifier les rôles et statuts
 * Utilise le décorateur @Roles() pour spécifier les rôles autorisés
 */
@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);

  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );

    if (!requiredRoles) {
      return true; // Pas de rôles requis
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('Utilisateur non authentifié');
    }

    // Récupérer l'utilisateur depuis la base de données
    const utilisateur = await this.prisma.utilisateur.findUnique({
      where: { email: user.email },
    });

    if (!utilisateur) {
      throw new ForbiddenException('Utilisateur non trouvé');
    }

    // Vérifier le rôle
    if (!requiredRoles.includes(utilisateur.role)) {
      this.logger.warn(
        `Accès refusé: ${utilisateur.email} (${utilisateur.role}) ne peut pas accéder à ${context.getClass().name}`,
      );
      throw new ForbiddenException(
        `Rôle insuffisant. Rôles autorisés: ${requiredRoles.join(', ')}`,
      );
    }

    // Vérifier le statut (doit être ACTIVE sauf pour certains endpoints)
    const allowedStatuses = this.reflector.get<string[]>(
      'allowedStatuses',
      context.getHandler(),
    ) || ['ACTIVE'];

    if (!allowedStatuses.includes(utilisateur.statut)) {
      throw new ForbiddenException(
        `Compte désactivé ou en attente d'activation`,
      );
    }

    // Ajouter l'utilisateur au contexte
    request.utilisateur = utilisateur;

    return true;
  }
}

