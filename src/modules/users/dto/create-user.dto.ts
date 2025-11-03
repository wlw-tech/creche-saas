import { IsEmail, IsString, IsOptional, IsEnum, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { RoleUtilisateur } from '@prisma/client';

/**
 * DTO pour créer un utilisateur (enseignant ou parent)
 */
export class CreateUserDto {
  @ApiProperty({
    example: 'prof@wlw.ma',
    description: 'Email de l\'utilisateur',
  })
  @IsEmail({}, { message: 'Email invalide' })
  email: string;

  @ApiProperty({
    example: 'Ahmed',
    description: 'Prénom',
  })
  @IsString()
  @MinLength(2, { message: 'Le prénom doit contenir au moins 2 caractères' })
  prenom: string;

  @ApiProperty({
    example: 'Dupont',
    description: 'Nom',
  })
  @IsString()
  @MinLength(2, { message: 'Le nom doit contenir au moins 2 caractères' })
  nom: string;

  @ApiProperty({
    example: 'ENSEIGNANT',
    description: 'Rôle de l\'utilisateur',
    enum: ['ENSEIGNANT', 'PARENT'],
  })
  @IsEnum(['ENSEIGNANT', 'PARENT'], {
    message: 'Le rôle doit être ENSEIGNANT ou PARENT',
  })
  role: string;

  @ApiProperty({
    example: '+212612345678',
    description: 'Téléphone (optionnel)',
    required: false,
  })
  @IsOptional()
  @IsString()
  telephone?: string;
}

/**
 * DTO pour inviter un enseignant (legacy - utilise CreateUserDto maintenant)
 */
export class InviteTeacherDto {
  @ApiProperty({
    example: 'prof@wlw.ma',
    description: 'Email de l\'enseignant',
  })
  @IsEmail({}, { message: 'Email invalide' })
  email: string;

  @ApiProperty({
    example: 'Ahmed',
    description: 'Prénom de l\'enseignant',
  })
  @IsString()
  prenom: string;

  @ApiProperty({
    example: 'Dupont',
    description: 'Nom de l\'enseignant',
  })
  @IsString()
  nom: string;

  @ApiProperty({
    example: '+212612345678',
    description: 'Téléphone (optionnel)',
    required: false,
  })
  @IsOptional()
  @IsString()
  telephone?: string;
}

/**
 * DTO pour mettre à jour le statut d'un utilisateur
 */
export class UpdateUserStatusDto {
  @ApiProperty({
    example: 'ACTIVE',
    description: 'Nouveau statut',
    enum: ['INVITED', 'ACTIVE', 'DISABLED'],
  })
  @IsEnum(['INVITED', 'ACTIVE', 'DISABLED'], {
    message: 'Statut invalide. Doit être INVITED, ACTIVE ou DISABLED',
  })
  statut: string;
}

/**
 * DTO pour filtrer les utilisateurs
 */
export class ListUsersQueryDto {
  @ApiProperty({
    example: 'ADMIN',
    description: 'Filtrer par rôle',
    required: false,
  })
  @IsOptional()
  @IsEnum(['ADMIN', 'ENSEIGNANT', 'PARENT'], {
    message: 'Rôle invalide',
  })
  role?: string;

  @ApiProperty({
    example: 'ACTIVE',
    description: 'Filtrer par statut',
    required: false,
  })
  @IsOptional()
  @IsEnum(['INVITED', 'ACTIVE', 'DISABLED'], {
    message: 'Statut invalide',
  })
  statut?: string;

  @ApiProperty({
    example: 'ahmed',
    description: 'Recherche par email/prénom/nom',
    required: false,
  })
  @IsOptional()
  @IsString()
  q?: string;

  @ApiProperty({
    example: '1',
    description: 'Numéro de page',
    required: false,
  })
  @IsOptional()
  page?: number;

  @ApiProperty({
    example: '10',
    description: 'Nombre de résultats par page',
    required: false,
  })
  @IsOptional()
  limit?: number;
}

