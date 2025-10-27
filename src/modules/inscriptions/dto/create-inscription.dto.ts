import {
  IsEmail,
  IsString,
  IsEnum,
  IsOptional,
  IsBoolean,
  IsArray,
  ValidateNested,
  IsUUID,
  IsISO8601,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Langue, LienTuteur } from '@prisma/client';

/**
 * DTO pour les données de la famille
 */
export class FamilleDto {
  @ApiProperty({
    description: 'Email principal de la famille (unique)',
    example: 'maman@example.com',
  })
  @IsEmail()
  emailPrincipal: string;

  @ApiPropertyOptional({
    description: 'Langue préférée de la famille',
    enum: ['fr', 'ar'],
    default: 'fr',
  })
  @IsOptional()
  @IsEnum(['fr', 'ar'])
  languePreferee?: Langue;

  @ApiPropertyOptional({
    description: 'Adresse de facturation',
    example: '12 rue Atlas, Marrakech',
  })
  @IsOptional()
  @IsString()
  adresseFacturation?: string;
}

/**
 * DTO pour les données d'un tuteur
 */
export class TuteurDto {
  @ApiProperty({
    description: 'Lien de parenté avec l\'enfant',
    enum: ['Mere', 'Pere', 'Proche', 'Tuteur', 'Autre'],
  })
  @IsEnum(LienTuteur)
  lien: LienTuteur;

  @ApiProperty({
    description: 'Prénom du tuteur',
    example: 'Amina',
  })
  @IsString()
  prenom: string;

  @ApiProperty({
    description: 'Nom du tuteur',
    example: 'B.',
  })
  @IsString()
  nom: string;

  @ApiPropertyOptional({
    description: 'Email du tuteur',
    example: 'maman@example.com',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    description: 'Téléphone du tuteur',
    example: '+2126000000',
  })
  @IsOptional()
  @IsString()
  telephone?: string;

  @ApiPropertyOptional({
    description: 'Tuteur principal (contact prioritaire)',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  principal?: boolean;
}

/**
 * DTO pour les données d'un enfant
 */
export class EnfantDto {
  @ApiProperty({
    description: 'Prénom de l\'enfant',
    example: 'Nour',
  })
  @IsString()
  prenom: string;

  @ApiProperty({
    description: 'Nom de l\'enfant',
    example: 'B.',
  })
  @IsString()
  nom: string;

  @ApiProperty({
    description: 'Date de naissance (ISO 8601)',
    example: '2021-05-10',
  })
  @IsISO8601()
  dateNaissance: string;

  @ApiPropertyOptional({
    description: 'Genre de l\'enfant',
    example: 'F',
  })
  @IsOptional()
  @IsString()
  genre?: string;

  @ApiPropertyOptional({
    description: 'URL de la photo de l\'enfant',
    example: null,
  })
  @IsOptional()
  @IsString()
  photoUrl?: string | null;
}

/**
 * DTO pour les consentements
 */
export class ConsentementsDto {
  @ApiPropertyOptional({
    description: 'Consentement pour les photos',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  photo?: boolean;

  @ApiPropertyOptional({
    description: 'Consentement pour les sorties',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  sortie?: boolean;
}

/**
 * DTO principal pour créer une inscription
 * Crée en une transaction : Famille (upsert), Tuteur(s), Enfant, Inscription
 */
export class CreateInscriptionDto {
  @ApiProperty({
    description: 'Données de la famille',
    type: FamilleDto,
  })
  @ValidateNested()
  @Type(() => FamilleDto)
  famille: FamilleDto;

  @ApiProperty({
    description: 'Liste des tuteurs (au moins 1 recommandé)',
    type: [TuteurDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TuteurDto)
  tuteurs: TuteurDto[];

  @ApiProperty({
    description: 'Données de l\'enfant',
    type: EnfantDto,
  })
  @ValidateNested()
  @Type(() => EnfantDto)
  enfant: EnfantDto;

  @ApiProperty({
    description: 'UUID de la classe souhaitée',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  @IsString()
  classeIdSouhaitee: string;

  @ApiPropertyOptional({
    description: 'Consentements parentaux',
    type: ConsentementsDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => ConsentementsDto)
  consentements?: ConsentementsDto;

  @ApiPropertyOptional({
    description: 'Commentaires additionnels (allergies, etc.)',
    example: 'Allergie légère aux œufs.',
  })
  @IsOptional()
  @IsString()
  commentaire?: string;
}

