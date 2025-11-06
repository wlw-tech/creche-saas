import {
  IsString,
  IsOptional,
  IsArray,
  IsDateString,
  IsEnum,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { StatutMenu } from '@prisma/client';

export class CreateMenuDto {
  @ApiProperty({
    example: '2025-11-06',
    description: 'Date du menu (YYYY-MM-DD)',
  })
  @IsDateString()
  date: string;

  @ApiPropertyOptional({
    example: 'Soupe de légumes',
    description: 'Plat d\'entrée',
  })
  @IsOptional()
  @IsString()
  entree?: string;

  @ApiPropertyOptional({
    example: 'Poulet rôti avec riz',
    description: 'Plat principal',
  })
  @IsOptional()
  @IsString()
  plat?: string;

  @ApiPropertyOptional({
    example: 'Yaourt nature',
    description: 'Dessert',
  })
  @IsOptional()
  @IsString()
  dessert?: string;

  @ApiPropertyOptional({
    example: ['Arachides', 'Gluten', 'Lait'],
    description: 'Liste des allergènes',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  allergenes?: string[];
}

export class UpdateMenuDto {
  @ApiPropertyOptional({
    example: 'Soupe de légumes',
    description: 'Plat d\'entrée',
  })
  @IsOptional()
  @IsString()
  entree?: string;

  @ApiPropertyOptional({
    example: 'Poulet rôti avec riz',
    description: 'Plat principal',
  })
  @IsOptional()
  @IsString()
  plat?: string;

  @ApiPropertyOptional({
    example: 'Yaourt nature',
    description: 'Dessert',
  })
  @IsOptional()
  @IsString()
  dessert?: string;

  @ApiPropertyOptional({
    example: ['Arachides', 'Gluten', 'Lait'],
    description: 'Liste des allergènes',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  allergenes?: string[];

  @ApiPropertyOptional({
    example: 'Publie',
    enum: ['Brouillon', 'Publie'],
    description: 'Statut du menu',
  })
  @IsOptional()
  @IsEnum(StatutMenu)
  statut?: StatutMenu;
}

export class MenuAllergenDto {
  @ApiProperty({
    example: 'Arachides',
    description: 'Nom de l\'allergène',
  })
  @IsString()
  allergen: string;
}

export class MenuResponseDto {
  @ApiProperty({ example: 'mnu_123' })
  id: string;

  @ApiProperty({ example: '2025-11-06' })
  date: string;

  @ApiPropertyOptional({ example: 'Soupe de légumes' })
  entree?: string;

  @ApiPropertyOptional({ example: 'Poulet rôti avec riz' })
  plat?: string;

  @ApiPropertyOptional({ example: 'Yaourt nature' })
  dessert?: string;

  @ApiProperty({ example: 'Publie', enum: ['Brouillon', 'Publie'] })
  statut: StatutMenu;

  @ApiProperty({
    example: ['Arachides', 'Gluten', 'Lait'],
    type: [String],
  })
  allergenes: string[];

  @ApiPropertyOptional({ example: 'admin@wlw.ma' })
  creePar?: string;

  @ApiProperty({ example: '2025-11-06T10:00:00Z' })
  creeLe: string;

  @ApiProperty({ example: '2025-11-06T10:00:00Z' })
  modifieLe: string;

  @ApiPropertyOptional({ example: '2025-11-06T10:00:00Z' })
  publieLe?: string;
}

export class GetMenusQueryDto {
  @ApiPropertyOptional({
    example: '2025-11-06',
    description: 'Filtrer par date (YYYY-MM-DD)',
  })
  @IsOptional()
  @IsDateString()
  date?: string;

  @ApiPropertyOptional({
    example: '2025-11-01',
    description: 'Date de début (YYYY-MM-DD)',
  })
  @IsOptional()
  @IsDateString()
  dateMin?: string;

  @ApiPropertyOptional({
    example: '2025-11-30',
    description: 'Date de fin (YYYY-MM-DD)',
  })
  @IsOptional()
  @IsDateString()
  dateMax?: string;

  @ApiPropertyOptional({
    example: 'Publie',
    enum: ['Brouillon', 'Publie'],
    description: 'Filtrer par statut',
  })
  @IsOptional()
  @IsEnum(StatutMenu)
  statut?: StatutMenu;

  @ApiPropertyOptional({
    example: 1,
    description: 'Numéro de page',
  })
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @ApiPropertyOptional({
    example: 25,
    description: 'Nombre de résultats par page (max 100)',
  })
  @IsOptional()
  @Type(() => Number)
  pageSize?: number = 25;
}

