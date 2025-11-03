import { SetMetadata } from '@nestjs/common';

/**
 * Décorateur pour spécifier les rôles autorisés sur une route
 * Utilisé avec RolesGuard
 *
 * @example
 * @Roles('ADMIN', 'ENSEIGNANT')
 * @Get()
 * findAll() { ... }
 */
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);

/**
 * Décorateur pour spécifier les statuts autorisés
 * Par défaut: ['ACTIVE']
 *
 * @example
 * @AllowedStatuses('ACTIVE', 'INVITED')
 * @Post()
 * create() { ... }
 */
export const AllowedStatuses = (...statuses: string[]) =>
  SetMetadata('allowedStatuses', statuses);
